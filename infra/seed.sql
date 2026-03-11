-- Seed script for FraudEye demo
-- Run: Get-Content infra/seed.sql | docker exec -i fraudeye-postgres psql -U fraudeye -d fraudeye_db

-- Users (admin + analyst)
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@fraudeye.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
  ('analyst@fraudeye.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'analyst')
ON CONFLICT (email) DO NOTHING;

-- Merchants
INSERT INTO merchants (id, name, category, risk_score) VALUES
  ('merch_001', 'QuickMart',      'retail',      1.0),
  ('merch_002', 'TechStore',      'electronics', 1.0),
  ('merch_003', 'FoodHub',        'food',        1.0),
  ('merch_004', 'TravelBookings', 'travel',      2.0),
  ('merch_005', 'CryptoExchange', 'crypto',      5.0)
ON CONFLICT (id) DO NOTHING;