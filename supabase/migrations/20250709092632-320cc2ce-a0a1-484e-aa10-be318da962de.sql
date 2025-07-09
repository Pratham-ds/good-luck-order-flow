-- First, add the new service type to the existing enum
ALTER TYPE service_type ADD VALUE 'minor_repair';

-- Update existing orders that have 'alterations' to 'minor_repair'
UPDATE orders SET service_type = 'minor_repair' WHERE service_type = 'alterations';

-- Now we need to recreate the enum without 'alterations'
-- First create a temporary enum
CREATE TYPE service_type_new AS ENUM (
  'dry_cleaning',
  'laundry', 
  'minor_repair',
  'shoe_cleaning',
  'curtain_cleaning',
  'sofa_cleaning'
);

-- Update the orders table to use the new enum
ALTER TABLE orders ALTER COLUMN service_type TYPE service_type_new USING service_type::text::service_type_new;

-- Drop the old enum and rename the new one
DROP TYPE service_type;
ALTER TYPE service_type_new RENAME TO service_type;