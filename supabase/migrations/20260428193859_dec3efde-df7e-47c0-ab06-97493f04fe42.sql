-- Fix services updates failing because the existing trigger references an order-only status field
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;

CREATE OR REPLACE FUNCTION public.update_services_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_services_updated_at();