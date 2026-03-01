-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','analyst')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Raw transactions (ingested)
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  merchant_id TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  device_id TEXT,
  ip_address TEXT,
  geo_lat DOUBLE PRECISION,
  geo_lng DOUBLE PRECISION,
  occurred_at TIMESTAMPTZ NOT NULL,
  raw_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Predictions + explanations
CREATE TABLE IF NOT EXISTS transaction_predictions (
  id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT UNIQUE NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  risk_score INT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
  risk_label TEXT NOT NULL CHECK (risk_label IN ('low','medium','high','critical')),
  model_version TEXT,
  explanation_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analyst actions
CREATE TABLE IF NOT EXISTS analyst_actions (
  id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  actor_user_id INT NOT NULL REFERENCES users(id),
  action_type TEXT NOT NULL, -- e.g. "mark_fraud", "mark_legit", "needs_review"
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id INT REFERENCES users(id),
  event_type TEXT NOT NULL,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_occurred_at ON transactions(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_label ON transaction_predictions(risk_label);