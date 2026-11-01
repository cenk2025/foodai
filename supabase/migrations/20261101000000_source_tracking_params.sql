-- FoodAi — Partner tracking parameters
-- Query parameters appended to every outbound /go redirect for a source, so the
-- partner can attribute visits and orders to FoodAi. "{click_id}" in a value is
-- replaced with the click_events id. Example:
--   UPDATE sources SET tracking_params = '{"ref": "foodai", "subid": "{click_id}"}'
--   WHERE name = 'PartnerName';

ALTER TABLE sources
    ADD COLUMN IF NOT EXISTS tracking_params JSONB NOT NULL DEFAULT '{}'::jsonb;
