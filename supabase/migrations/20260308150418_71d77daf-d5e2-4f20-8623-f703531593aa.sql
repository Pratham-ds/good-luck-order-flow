
-- Testimonials table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_location text,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonials" ON public.testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Special offers table
CREATE TABLE public.special_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  discount_text text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  valid_until date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active offers" ON public.special_offers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage offers" ON public.special_offers
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Price items table (replaces hardcoded prices)
CREATE TABLE public.price_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  item_name text NOT NULL,
  regular_price text NOT NULL,
  offer_price text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.price_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active price items" ON public.price_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage price items" ON public.price_items
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Seed default price data
INSERT INTO public.price_items (category, item_name, regular_price, offer_price, sort_order) VALUES
  ('men_wear', 'Shirt/T-shirt', '100/P', '80/P', 1),
  ('men_wear', 'Jacket', '320/P', '250/P', 2),
  ('men_wear', 'Coat', '300/P', '220/P', 3),
  ('men_wear', 'Suit 2 P', '300', '250', 4),
  ('men_wear', 'Suit 3 P', '380', '350', 5),
  ('men_wear', 'Jeans/Trousers', '140', '100', 6),
  ('men_wear', 'Kurta/Pajama', '200', '150', 7),
  ('women_wear', 'Saree', '250', '200', 1),
  ('women_wear', 'Salwar', '180', '150', 2),
  ('women_wear', 'Lengha', '420+', '350+', 3),
  ('women_wear', 'Shawl', '170', '150', 4),
  ('women_wear', 'Kurta', '200', '150', 5),
  ('women_wear', 'Dress', '150+', '120+', 6),
  ('household', 'S blanket S/D Layer', '250/300', '220/280', 1),
  ('household', 'D blanket S/D Layer', '370/520', '300/350+', 2),
  ('household', 'Bedsheet S/D', '200/270', '100/140', 3),
  ('household', 'Curtain (per panel)', '170', '120', 4),
  ('household', 'Pillow cover (per pair)', '80/pair', '70', 5),
  ('shoes', 'Sports', '270', '220', 1),
  ('shoes', 'Canvas', '270', '200', 2),
  ('shoes', 'Boots', '520+', '370+', 3);
