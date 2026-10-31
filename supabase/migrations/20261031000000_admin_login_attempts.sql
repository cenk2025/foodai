-- FoodAi — Admin login rate limiting
-- Failed admin login / password-change attempts are recorded here so the
-- limit holds across all serverless instances. Only a keyed hash of the client
-- IP is stored (never the raw IP or the submitted email/password).
--
-- The table is written and read exclusively by the server with the service
-- role; RLS is enabled with no policies so anon/authenticated clients have no
-- access at all.

CREATE TABLE IF NOT EXISTS admin_login_attempts (
    id BIGSERIAL PRIMARY KEY,
    scope TEXT NOT NULL,              -- 'login' | 'change-password'
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_scope_ip_time
    ON admin_login_attempts(scope, ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_scope_time
    ON admin_login_attempts(scope, created_at DESC);

ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;
