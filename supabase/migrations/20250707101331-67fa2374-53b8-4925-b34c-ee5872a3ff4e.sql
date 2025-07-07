
-- Create enum for order statuses
CREATE TYPE public.order_status AS ENUM (
  'scheduled',
  'picked_up', 
  'in_process',
  'out_for_delivery',
  'delivered'
);

-- Create enum for service types
CREATE TYPE public.service_type AS ENUM (
  'dry_cleaning',
  'laundry',
  'alterations',
  'shoe_cleaning',
  'curtain_cleaning',
  'sofa_cleaning'
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create addresses table for multiple delivery addresses
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL, -- e.g., "Home", "Office"
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'Maharashtra',
  postal_code TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  address_id UUID REFERENCES public.addresses(id) NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  service_type service_type NOT NULL,
  items JSONB NOT NULL, -- Array of items with details
  total_amount DECIMAL(10,2),
  status order_status DEFAULT 'scheduled',
  pickup_date DATE,
  delivery_date DATE,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order tracking table for real-time updates
CREATE TABLE public.order_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status order_status NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'GL' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update order tracking when order status changes
CREATE OR REPLACE FUNCTION public.update_order_tracking()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_tracking (order_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status updated to ' || NEW.status);
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order status updates
CREATE TRIGGER on_order_status_change
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_order_tracking();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create RLS policies for addresses
CREATE POLICY "Users can view their own addresses"
  ON public.addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON public.addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON public.addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON public.addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for order tracking
CREATE POLICY "Users can view tracking for their orders"
  ON public.order_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_tracking.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create function for smart reorder suggestions
CREATE OR REPLACE FUNCTION public.get_reorder_suggestions(user_uuid UUID)
RETURNS TABLE (
  last_order_date DATE,
  service_type service_type,
  days_since_last_order INTEGER,
  suggestion_message TEXT
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
