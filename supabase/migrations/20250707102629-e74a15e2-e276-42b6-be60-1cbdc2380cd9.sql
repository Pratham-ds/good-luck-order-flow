
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'customer');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role user_role DEFAULT 'customer';

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for orders to allow admin access
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders or admins can view all"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own orders or admins can insert any"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can update any order"
  ON public.orders FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Update RLS policies for order tracking to allow admin access
DROP POLICY IF EXISTS "Users can view tracking for their orders" ON public.order_tracking;

CREATE POLICY "Users can view tracking for their orders or admins can view all"
  ON public.order_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_tracking.order_id 
      AND orders.user_id = auth.uid()
    ) OR public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can insert order tracking"
  ON public.order_tracking FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to view all addresses for order management
CREATE POLICY "Admins can view all addresses"
  ON public.addresses FOR SELECT
  USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()) OR auth.uid() = id);
