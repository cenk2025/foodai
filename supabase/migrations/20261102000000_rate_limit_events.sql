-- FoodAi — Rate limiting for public AI endpoints
-- One row per request; only a keyed hash of the client IP is stored. Written
-- and read exclusively by the server with the service role: RLS is enabled
-- with no policies, so anon/authenticated clients have no access.

CREATE TABLE IF NOT EXISTS rate_limit_events (
    id BIGSERIAL PRIMARY KEY,
    scope TEXT NOT NULL,              -- e.g. 'ai-search', 'ai-chat'
    key_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_scope_key_time
    ON rate_limit_events(scope, key_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_events_time
    ON rate_limit_events(created_at);

ALTER TABLE rate_limit_events ENABLE ROW LEVEL SECURITY;
