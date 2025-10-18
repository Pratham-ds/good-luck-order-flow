-- ============================================
-- CRITICAL SECURITY FIX: Role Architecture Migration
-- ============================================
-- This migration addresses 3 critical security vulnerabilities:
-- 1. Missing INSERT policy on profiles (privilege escalation)
-- 2. Insecure role storage in profiles table
-- 3. SQL injection risk in SECURITY DEFINER functions

-- ============================================
-- STEP 1: Create secure user_roles table
-- ============================================

-- Create app_role enum (using different name to avoid conflict with existing user_role)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'customer');

-- Create user_roles table with proper foreign key
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can manage roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "Only admins can view roles"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- ============================================
-- STEP 2: Create secure has_role function
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================
-- STEP 3: Migrate existing role data
-- ============================================

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 
  CASE 
    WHEN role = 'admin' THEN 'admin'::app_role
    WHEN role = 'customer' THEN 'customer'::app_role
    ELSE 'customer'::app_role
  END
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- STEP 4: Update all SECURITY DEFINER functions
-- ============================================

-- Fix is_admin function with search_path and new role check
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.has_role(user_id, 'admin'::app_role);
END;
$$;

-- Fix handle_new_user with search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile without role
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  
  -- Assign default 'customer' role in user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer'::app_role);
  
  RETURN NEW;
END;
$$;

-- Fix get_reorder_suggestions with search_path
CREATE OR REPLACE FUNCTION public.get_reorder_suggestions(user_uuid UUID)
RETURNS TABLE(
  last_order_date DATE, 
  service_type service_type, 
  days_since_last_order INTEGER, 
  suggestion_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.pickup_date,
    o.service_type,
    (CURRENT_DATE - o.pickup_date)::INTEGER as days_since,
    CASE 
      WHEN o.service_type = 'sofa_cleaning' AND (CURRENT_DATE - o.pickup_date) >= 21 THEN
        'It''s been ' || (CURRENT_DATE - o.pickup_date) || ' days since your last sofa cleaning – ready for another?'
      WHEN o.service_type = 'dry_cleaning' AND (CURRENT_DATE - o.pickup_date) >= 14 THEN
        'Time for another dry cleaning service? It''s been ' || (CURRENT_DATE - o.pickup_date) || ' days!'
      WHEN o.service_type = 'laundry' AND (CURRENT_DATE - o.pickup_date) >= 7 THEN
        'Weekly laundry time! Last service was ' || (CURRENT_DATE - o.pickup_date) || ' days ago.'
      ELSE NULL
    END as message
  FROM public.orders o
  WHERE o.user_id = user_uuid 
    AND o.status = 'delivered'
    AND o.pickup_date IS NOT NULL
  ORDER BY o.pickup_date DESC
  LIMIT 5;
END;
$$;

-- ============================================
-- STEP 5: Add INSERT policy to profiles
-- ============================================

-- This policy ensures users can only create their own profile
-- Role assignment is now handled by user_roles table
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- STEP 6: Remove role column from profiles
-- ============================================

-- Drop the role column as it's now in user_roles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- ============================================
-- STEP 7: Create helper function to check if user is customer
-- ============================================

CREATE OR REPLACE FUNCTION public.is_customer(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.has_role(user_id, 'customer'::app_role);
END;
$$;