-- Update the service_type enum to replace 'alterations' with 'minor_repair'
ALTER TYPE service_type RENAME TO service_type_old;

CREATE TYPE service_type AS ENUM (
  'dry_cleaning',
  'laundry', 
  'minor_repair',
  'shoe_cleaning',
  'curtain_cleaning',
  'sofa_cleaning'
);

-- Update existing orders that have 'alterations' to 'minor_repair'
UPDATE orders SET service_type = 'minor_repair'::service_type WHERE service_type::text = 'alterations';

-- Update the orders table to use the new enum
ALTER TABLE orders ALTER COLUMN service_type TYPE service_type USING service_type::text::service_type;

-- Update the order_tracking table to use the new enum  
ALTER TABLE order_tracking ALTER COLUMN status TYPE order_status USING status::text::order_status;

-- Drop the old enum
DROP TYPE service_type_old;