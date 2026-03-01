-- FraudEye Phase 1 - Initial Schema
-- Locked stack: PostgreSQL + Docker
-- Tables: users, transactions, predictions, explanations, devices, merchants, feedback, audit_logs

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;    -- case-insensitive email

-- Updated-at trigger helper
CREATE OR REPLACE FUNCTION fraudeye_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- 1) users
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,

  role TEXT NOT NULL DEFAULT 'ANALYST'
    CHECK (role IN ('ADMIN', 'ANALYST')),

  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION fraudeye_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- =========================
-- 2) merchants
-- =========================
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  merchant_code TEXT UNIQUE, -- optional external identifier
  category TEXT,

  risk_score SMALLINT NOT NULL DEFAULT 0
    CHECK (risk_score BETWEEN 0 AND 100),

  risk_label TEXT NOT NULL DEFAULT 'LOW'
    CHECK (risk_label IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),

  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_merchants_updated_at
BEFORE UPDATE ON merchants
FOR EACH ROW
EXECUTE FUNCTION fraudeye_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_merchants_risk_score ON merchants(risk_score);
CREATE INDEX IF NOT EXISTS idx_merchants_risk_label ON merchants(risk_label);

-- =========================
-- 3) devices
-- =========================
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  device_fingerprint TEXT NOT NULL UNIQUE, -- stable ID (hash) from backend preprocessing

  trust_score SMALLINT NOT NULL DEFAULT 50
    CHECK (trust_score BETWEEN 0 AND 100),

  last_seen_at TIMESTAMPTZ,

  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_devices_updated_at
BEFORE UPDATE ON devices
FOR EACH ROW
EXECUTE FUNCTION fraudeye_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_devices_trust_score ON devices(trust_score);
CREATE INDEX IF NOT EXISTS idx_devices_last_seen ON devices(last_seen_at);

-- =========================
-- 4) transactions
-- =========================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- External transaction ID coming from ingestion API
  transaction_id TEXT NOT NULL UNIQUE,

  -- Optional: user who initiated the txn (if applicable in your ingestion model)
  user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,

  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
  device_id UUID NULL REFERENCES devices(id) ON DELETE SET NULL,

  amount NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
  currency CHAR(3) NOT NULL, -- e.g., INR, USD

  status TEXT NOT NULL DEFAULT 'RECEIVED'
    CHECK (status IN ('RECEIVED', 'QUEUED', 'INFERRED', 'FAILED')),

  occurred_at TIMESTAMPTZ NULL,             -- when the txn happened (if provided)
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- when backend received it

  ip_address INET NULL,
  user_agent TEXT NULL,

  -- Geo fields for geo-impossibility checks
  geo_lat NUMERIC(9,6) NULL,
  geo_lon NUMERIC(9,6) NULL,
  country_code CHAR(2) NULL,
  city TEXT NULL,

  -- Raw ingestion + derived behavioral features (JSONB allowed)
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  behavioral_features JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION fraudeye_set_updated_at();

-- Common query indexes (dashboard + pipeline lookups)
CREATE INDEX IF NOT EXISTS idx_txn_received_at ON transactions(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_txn_occurred_at ON transactions(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_txn_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_txn_merchant ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_txn_device ON transactions(device_id);
CREATE INDEX IF NOT EXISTS idx_txn_user ON transactions(user_id);

-- =========================
-- 5) predictions
-- =========================
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  transaction_pk UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,

  -- From BullMQ/worker pipeline
  job_id TEXT NULL,

  model_version TEXT NOT NULL DEFAULT 'xgb_v1',

  risk_score SMALLINT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
  risk_label TEXT NOT NULL
    CHECK (risk_label IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),

  -- optional probability
  fraud_probability NUMERIC(5,4) NULL CHECK (fraud_probability BETWEEN 0 AND 1),

  inferred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  latency_ms INTEGER NULL CHECK (latency_ms IS NULL OR latency_ms >= 0),

  -- store any extra model outputs/metadata
  meta JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- One txn can have multiple predictions (re-run / new model version)
CREATE INDEX IF NOT EXISTS idx_pred_txn_time ON predictions(transaction_pk, inferred_at DESC);
CREATE INDEX IF NOT EXISTS idx_pred_label ON predictions(risk_label);
CREATE INDEX IF NOT EXISTS idx_pred_score ON predictions(risk_score);
CREATE INDEX IF NOT EXISTS idx_pred_model_version ON predictions(model_version);

-- Fast "latest prediction per txn" pattern
-- (not unique: helps query planner)
CREATE INDEX IF NOT EXISTS idx_pred_txn_latest ON predictions(transaction_pk, inferred_at DESC, id);

-- =========================
-- 6) explanations
-- =========================
CREATE TABLE IF NOT EXISTS explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  prediction_id UUID NOT NULL UNIQUE REFERENCES predictions(id) ON DELETE CASCADE,

  -- SHAP + LIME payloads (JSONB allowed as per requirement)
  shap_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  lime_json JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- quick access for top features used in UI
  top_features JSONB NOT NULL DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expl_created_at ON explanations(created_at DESC);

-- =========================
-- 7) feedback (analyst feedback loop)
-- =========================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  transaction_pk UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  prediction_id UUID NULL REFERENCES predictions(id) ON DELETE SET NULL,

  analyst_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,

  -- what kind of feedback was provided
  feedback_type TEXT NOT NULL
    CHECK (feedback_type IN ('CONFIRM', 'OVERRIDE', 'NOTE')),

  -- final decision by analyst (for retraining labels)
  is_fraud BOOLEAN NULL,

  -- optional: severity for triage
  severity SMALLINT NULL CHECK (severity IS NULL OR severity BETWEEN 0 AND 3),

  notes TEXT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_txn ON feedback(transaction_pk, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_analyst ON feedback(analyst_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(feedback_type);

-- =========================
-- 8) audit_logs (who did what, when)
-- =========================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  actor_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,

  action TEXT NOT NULL, -- e.g., TXN_INGESTED, JOB_QUEUED, PRED_STORED, FEEDBACK_ADDED
  entity_type TEXT NOT NULL, -- e.g., transaction, prediction, feedback, user
  entity_id UUID NULL,       -- generic reference

  transaction_pk UUID NULL REFERENCES transactions(id) ON DELETE SET NULL,
  prediction_id UUID NULL REFERENCES predictions(id) ON DELETE SET NULL,
  feedback_id UUID NULL REFERENCES feedback(id) ON DELETE SET NULL,

  ip_address INET NULL,
  user_agent TEXT NULL,

  before_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  after_state JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_txn ON audit_logs(transaction_pk);
CREATE INDEX IF NOT EXISTS idx_audit_pred ON audit_logs(prediction_id);

COMMIT;