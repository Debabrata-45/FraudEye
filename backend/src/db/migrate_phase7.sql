-- Feedback table (analyst verdicts for retraining)
CREATE TABLE IF NOT EXISTS feedback (
  id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  actor_user_id INT NOT NULL REFERENCES users(id),
  verdict TEXT NOT NULL CHECK (verdict IN ('FRAUD', 'SAFE')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(transaction_id)
);

-- Flagged users
CREATE TABLE IF NOT EXISTS flagged_users (
  id BIGSERIAL PRIMARY KEY,
  flagged_user_id INT NOT NULL REFERENCES users(id),
  actor_user_id INT NOT NULL REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(flagged_user_id)
);

-- Flagged merchants
CREATE TABLE IF NOT EXISTS flagged_merchants (
  id BIGSERIAL PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  actor_user_id INT NOT NULL REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(merchant_id)
);

CREATE INDEX IF NOT EXISTS idx_feedback_transaction ON feedback(transaction_id);
CREATE INDEX IF NOT EXISTS idx_flagged_merchants_mid ON flagged_merchants(merchant_id);