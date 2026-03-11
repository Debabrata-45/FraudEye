"""
Phase 9 — ML Service tests
Run: pytest tests/ -v
"""
import pytest
import numpy as np
import pandas as pd
from fastapi.testclient import TestClient
from app.models.artifacts import artifact_store
from app.main import app
from app.features.engineer import build_features
from app.features.schema import FEATURES

# Load model before tests run
artifact_store.load()
client = TestClient(app)

# ── Health ──────────────────────────────────────────────────────────────────

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["ok"] is True

# ── /infer contract ──────────────────────────────────────────────────────────

VALID_PAYLOAD = {
    "transaction": {
        "transactionId": "test_001",
        "userId": "user_01",
        "merchantId": "merch_001",
        "amount": 5000.0,
        "currency": "INR",
        "deviceId": "device_01",
        "ipAddress": "192.168.1.1",
        "location": {"lat": 28.6139, "lon": 77.2090},
        "timestamp": "2026-03-09T10:00:00Z",
        "channel": "web",
    },
    "context": {
        "merchantRiskLevel": 1,
        "userAvgSpend30d": 3000.0,
        "userStdSpend30d": 1000.0,
        "txnVelocity5m": 1,
        "txnVelocity1h": 2,
        "prevLocation": None,
        "prevTimestamp": None,
        "prevDeviceId": None,
        "isNewDevice": True,
        "deviceInconsistency": False,
        "geoAnomalyKm": 0.0,
        "geoImpossible": False,
    },
}

def test_infer_valid_payload():
    res = client.post("/infer", json=VALID_PAYLOAD)
    assert res.status_code == 200
    data = res.json()
    assert "riskScore" in data
    assert "riskLabel" in data
    assert "fraudProbability" in data
    assert "modelVersion" in data
    assert 0 <= data["riskScore"] <= 100
    assert data["riskLabel"] in ["low", "medium", "high", "critical", "LOW", "MEDIUM", "HIGH", "CRITICAL"]

def test_infer_risk_score_range():
    res = client.post("/infer", json=VALID_PAYLOAD)
    assert res.status_code == 200
    score = res.json()["riskScore"]
    assert isinstance(score, (int, float))
    assert 0 <= score <= 100

def test_infer_missing_transaction_field():
    bad_payload = {"context": VALID_PAYLOAD["context"]}
    res = client.post("/infer", json=bad_payload)
    assert res.status_code == 422

def test_infer_shap_returned():
    res = client.post("/infer", json=VALID_PAYLOAD)
    assert res.status_code == 200
    data = res.json()
    assert "shap" in data
    assert "values" in data["shap"]

# ── Feature engineering ───────────────────────────────────────────────────────

def test_feature_engineering_output_shape():
    df = pd.DataFrame([{
        "transaction_id": "t1",
        "user_id": "u1",
        "merchant_id": "m1",
        "amount": 5000.0,
        "currency": "INR",
        "timestamp": "2026-03-09T10:00:00Z",
        "device_id": "d1",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "merchant_risk_level": 1,
        "user_avg_spend_30d": 3000.0,
        "user_std_spend_30d": 1000.0,
        "fraud_label": 0,
    }])
    result = build_features(df)
    assert all(f in result.columns for f in FEATURES)

def test_feature_engineering_no_nan():
    df = pd.DataFrame([{
        "transaction_id": "t1",
        "user_id": "u1",
        "merchant_id": "m1",
        "amount": 5000.0,
        "currency": "INR",
        "timestamp": "2026-03-09T10:00:00Z",
        "device_id": "d1",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "merchant_risk_level": 1,
        "user_avg_spend_30d": 3000.0,
        "user_std_spend_30d": 1000.0,
        "fraud_label": 0,
    }])
    result = build_features(df)
    assert not result[FEATURES].isnull().any().any()

def test_feature_list_matches_model():
    assert len(FEATURES) == 10
    assert "amount" in FEATURES
    assert "unusual_hour" in FEATURES
    assert "new_device" in FEATURES