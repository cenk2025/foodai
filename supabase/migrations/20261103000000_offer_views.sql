-- FoodAi — Offer view counters and admin partner statistics
-- Views are plain daily counters per offer: no IP, cookie or visitor id is stored.
-- Demo sources are never counted. Everything here is reachable only with the
-- service role: RLS is enabled with no policies and the functions are not
-- executable by anon/authenticated clients.

CREATE TABLE IF NOT EXISTS offer_view_daily (
    day DATE NOT NULL,
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    views BIGINT NOT NULL DEFAULT 0 CHECK (views >= 0),
    PRIMARY KEY (day, offer_id)
);

ALTER TABLE offer_view_daily ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION record_offer_views(p_offer_ids UUID[])
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    INSERT INTO offer_view_daily (day, offer_id, views)
    SELECT (NOW() AT TIME ZONE 'Europe/Helsinki')::DATE, o.id, 1
    FROM offers o
    JOIN sources s ON s.id = o.source_id
    WHERE o.id = ANY(p_offer_ids)
      AND o.active
      AND s.type <> 'demo'
    ON CONFLICT (day, offer_id)
    DO UPDATE SET views = offer_view_daily.views + 1;
$$;

-- Clicks and views per offer and day (Helsinki time) from p_from onwards.
CREATE OR REPLACE FUNCTION admin_offer_daily_stats(p_from DATE)
RETURNS TABLE (day DATE, offer_id UUID, clicks BIGINT, views BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT t.day, t.offer_id, SUM(t.clicks)::BIGINT, SUM(t.views)::BIGINT
    FROM (
        SELECT (c.clicked_at AT TIME ZONE 'Europe/Helsinki')::DATE AS day,
               c.offer_id,
               COUNT(*) AS clicks,
               0 AS views
        FROM click_events c
        WHERE c.clicked_at >= (p_from::TIMESTAMP AT TIME ZONE 'Europe/Helsinki')
        GROUP BY 1, 2
        UNION ALL
        SELECT v.day, v.offer_id, 0, v.views
        FROM offer_view_daily v
        WHERE v.day >= p_from
    ) t
    GROUP BY t.day, t.offer_id
    ORDER BY t.day, t.offer_id;
$$;

REVOKE ALL ON FUNCTION record_offer_views(UUID[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION admin_offer_daily_stats(DATE) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION record_offer_views(UUID[]) TO service_role;
GRANT EXECUTE ON FUNCTION admin_offer_daily_stats(DATE) TO service_role;
