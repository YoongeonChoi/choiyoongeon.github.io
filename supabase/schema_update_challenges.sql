-- Add table for ephemeral authentication challenges (serverless support)
CREATE TABLE IF NOT EXISTS auth_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Can be 'admin' or UUID
    challenge TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + interval '5 minutes')
);

-- Index for fast lookup and expiry cleanup
CREATE INDEX idx_challenges_user_id ON auth_challenges(user_id);
-- In production, enabling pg_cron would automate cleanup, or use TTL if supported
