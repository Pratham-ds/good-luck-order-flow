-- Create services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  category text NOT NULL DEFAULT 'regular',
  icon_emoji text,
  image_key text NOT NULL DEFAULT 'laundry',
  is_available boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_order_tracking();

-- Seed existing services
INSERT INTO public.services (title, description, price, features, category, image_key, sort_order) VALUES
('Dry Cleaning', 'Professional dry cleaning for delicate fabrics and formal wear', 'From ₹80', ARRAY['Suits & Dresses','Delicate Fabrics','Stain Removal','Press & Finish'], 'regular', 'dry_cleaning', 1),
('Wash & Fold', 'Complete washing, drying, and folding service for everyday clothes', 'From ₹50/kg', ARRAY['Washing & Drying','Folding','Fabric Softener','Same Day Service'], 'regular', 'laundry', 2),
('Ironing & Pressing', 'Professional pressing for crisp, wrinkle-free clothing', 'From ₹30', ARRAY['Professional Press','Starch Options','Hanger Service','Quick Turnaround'], 'regular', 'laundry', 3),
('Minor Repair', 'Expert minor repairs and tailoring for the perfect fit', 'From ₹150', ARRAY['Hemming','Taking In/Out','Zipper Repair','Custom Fitting'], 'regular', 'minor_repair', 4),
('Comforters & Bedding', 'Large item cleaning for comforters, blankets, and bedding', 'From ₹250', ARRAY['Comforters','Blankets','Pillows','Curtains'], 'regular', 'laundry', 5),
('Wedding Dress Care', 'Specialized cleaning and preservation for wedding dresses', 'From ₹1500', ARRAY['Cleaning','Preservation','Storage Box','Stain Treatment'], 'regular', 'dry_cleaning', 6);

INSERT INTO public.services (title, description, price, features, category, image_key, icon_emoji, sort_order) VALUES
('Shoe & Boot Cleaning', 'Professional cleaning for all types of footwear', 'From ₹100', ARRAY['Sports Shoes','Leather Boots','Branded Footwear','Deep Cleaning'], 'specialized', 'shoe_cleaning', '👟', 1),
('Carpet Cleaning', 'Deep cleaning and stain removal for all carpet types', 'From ₹200/sqm', ARRAY['Deep Steam Cleaning','Stain Removal','Odor Treatment','Quick Drying'], 'specialized', 'laundry', '🧽', 2),
('Curtain Cleaning', 'Gentle cleaning for all types of curtains and drapes', 'From ₹150/panel', ARRAY['Delicate Fabric Care','Colour Protection','Wrinkle-Free','UV Protection'], 'specialized', 'curtain_cleaning', '🪟', 3),
('Sofa Cleaning', 'Professional upholstery cleaning for sofas and furniture', 'From ₹800', ARRAY['Fabric & Leather','Deep Sanitization','Stain Removal','Odor Elimination'], 'specialized', 'sofa_cleaning', '🛋️', 4),
('Mat Cleaning', 'Thorough cleaning for doormats, bath mats, and floor mats', 'From ₹80', ARRAY['All Mat Types','Antibacterial Treatment','Quick Drying','Odor Removal'], 'specialized', 'laundry', '🏠', 5),
('Household Fabric Items', 'Cleaning service for various household fabric items', 'From ₹50', ARRAY['Table Covers','Cushion Covers','Blankets','Custom Items'], 'specialized', 'laundry', '🏡', 6);