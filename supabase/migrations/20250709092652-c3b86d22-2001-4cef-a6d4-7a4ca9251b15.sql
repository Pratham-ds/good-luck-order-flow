-- Step 1: Add the new service type to the existing enum
ALTER TYPE service_type ADD VALUE 'minor_repair';

-- Commit this change first (this is automatically committed)

-- Step 2: Update existing orders - this will be done in a separate migration