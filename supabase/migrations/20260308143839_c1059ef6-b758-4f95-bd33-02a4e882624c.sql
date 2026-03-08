
-- Loyalty rewards table to track redeemed milestones
CREATE TABLE public.loyalty_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone integer NOT NULL, -- e.g. 5, 10, 15
  reward_type text NOT NULL DEFAULT 'discount', -- discount, free_service
  reward_value numeric NOT NULL DEFAULT 10, -- e.g. 10% off
  redeemed boolean NOT NULL DEFAULT false,
  redeemed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;

-- Users can view their own rewards
CREATE POLICY "Users can view own rewards" ON public.loyalty_rewards
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all rewards
CREATE POLICY "Admins can view all rewards" ON public.loyalty_rewards
  FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));

-- System inserts via function (service role), users can't insert directly
CREATE POLICY "Admins can manage rewards" ON public.loyalty_rewards
  FOR ALL TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Function to get loyalty status for a user
CREATE OR REPLACE FUNCTION public.get_loyalty_status(user_uuid uuid)
RETURNS TABLE(
  total_delivered_orders bigint,
  current_milestone integer,
  next_milestone integer,
  orders_to_next integer,
  available_rewards bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  delivered_count bigint;
  milestones integer[] := ARRAY[5, 10, 15, 20, 25, 30, 40, 50];
  curr_milestone integer := 0;
  nxt_milestone integer := 5;
BEGIN
  -- Count delivered orders
  SELECT COUNT(*) INTO delivered_count
  FROM public.orders
  WHERE orders.user_id = user_uuid AND orders.status = 'delivered';

  -- Find current and next milestone
  FOR i IN 1..array_length(milestones, 1) LOOP
    IF delivered_count >= milestones[i] THEN
      curr_milestone := milestones[i];
      IF i < array_length(milestones, 1) THEN
        nxt_milestone := milestones[i + 1];
      ELSE
        nxt_milestone := curr_milestone + 10;
      END IF;
    ELSE
      nxt_milestone := milestones[i];
      EXIT;
    END IF;
  END LOOP;

  RETURN QUERY SELECT
    delivered_count,
    curr_milestone,
    nxt_milestone,
    (nxt_milestone - delivered_count::integer),
    (SELECT COUNT(*) FROM public.loyalty_rewards lr WHERE lr.user_id = user_uuid AND lr.redeemed = false);
END;
$$;

-- Function to auto-grant milestone rewards (called by trigger)
CREATE OR REPLACE FUNCTION public.check_and_grant_loyalty_reward()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  delivered_count bigint;
  milestones integer[] := ARRAY[5, 10, 15, 20, 25, 30, 40, 50];
  reward_pct numeric;
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS DISTINCT FROM 'delivered') THEN
    SELECT COUNT(*) INTO delivered_count
    FROM public.orders
    WHERE user_id = NEW.user_id AND status = 'delivered';

    FOR i IN 1..array_length(milestones, 1) LOOP
      IF delivered_count = milestones[i] THEN
        -- Calculate reward: 10% for 5, 15% for 10, 20% for 15+
        reward_pct := LEAST(10 + (i - 1) * 5, 30);
        
        -- Only grant if not already granted for this milestone
        IF NOT EXISTS (
          SELECT 1 FROM public.loyalty_rewards
          WHERE user_id = NEW.user_id AND milestone = milestones[i]
        ) THEN
          INSERT INTO public.loyalty_rewards (user_id, milestone, reward_type, reward_value)
          VALUES (NEW.user_id, milestones[i], 'discount', reward_pct);
        END IF;
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger on orders table
CREATE TRIGGER loyalty_reward_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_grant_loyalty_reward();
