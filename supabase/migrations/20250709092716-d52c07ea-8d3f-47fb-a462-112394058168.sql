-- Update existing orders that have 'alterations' to 'minor_repair'
UPDATE orders SET service_type = 'minor_repair' WHERE service_type = 'alterations';