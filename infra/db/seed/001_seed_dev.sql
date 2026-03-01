BEGIN;

INSERT INTO users (email, password_hash, role)
VALUES
  ('admin@fraudeye.local', 'CHANGE_ME_HASH', 'ADMIN'),
  ('analyst@fraudeye.local', 'CHANGE_ME_HASH', 'ANALYST')
ON CONFLICT (email) DO NOTHING;

INSERT INTO merchants (name, merchant_code, category, risk_score, risk_label)
VALUES
  ('Test Merchant A', 'MRC_A', 'E-COMMERCE', 10, 'LOW'),
  ('Test Merchant B', 'MRC_B', 'GAMING', 70, 'HIGH')
ON CONFLICT (merchant_code) DO NOTHING;

INSERT INTO devices (device_fingerprint, trust_score)
VALUES
  ('device_fp_001', 80),
  ('device_fp_002', 30)
ON CONFLICT (device_fingerprint) DO NOTHING;

COMMIT;