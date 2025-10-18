-- Add DELETE policy for admins on orders table
CREATE POLICY "Admins can delete any order"
ON public.orders
FOR DELETE
USING (is_admin(auth.uid()));