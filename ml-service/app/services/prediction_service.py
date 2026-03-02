from __future__ import annotations
import logging
from typing import Dict, Any, Tuple

import numpy as np
import xgboost as xgb

from app.schemas.infer import InferRequest, InferResponse, XAIBlock
from app.core.settings import settings
from .feature_engineering import compute_behavioral_features
from .model_loader import model_registry

logger = logging.getLogger("prediction_service")


def risk_label(score: int) -> str:
    if 0 <= score <= 30:
        return "LOW"
    if 31 <= score <= 70:
        return "MEDIUM"
    return "HIGH"


def build_model_vector(req: InferRequest, feat: Dict[str, Any]) -> Tuple[np.ndarray, Dict[str, int]]:
    """
    Keep this deterministic and stable.
    IMPORTANT: The feature order must match the model training order.

    In Phase 4, we define a minimal baseline set. When you train XGB,
    train using EXACT same order and names.
    """
    # baseline numeric encoding
    # You can expand later, but keep training aligned.
    feature_names = [
        "amount",
        "txn_velocity_5m",
        "txn_velocity_1h",
        "unusual_hour",
        "geo_anomaly_km",
        "geo_impossible",
        "new_device",
        "device_inconsistency",
        "merchant_risk_level",
        "spending_deviation_from_user_avg",
    ]

    values = [
        float(req.transaction.amount),
        int(feat["txn_velocity_5m"]),
        int(feat["txn_velocity_1h"]),
        int(feat["unusual_hour"]),
        float(feat["geo_anomaly_km"]),
        int(feat["geo_impossible"]),
        int(feat["new_device"]),
        int(feat["device_inconsistency"]),
        int(feat["merchant_risk_level"]),
        float(feat["spending_deviation_from_user_avg"]),
    ]

    vec = np.array([values], dtype=np.float32)
    index_map = {name: i for i, name in enumerate(feature_names)}
    return vec, index_map


def predict(req: InferRequest) -> InferResponse:
    ctx = req.context
    behavioral = compute_behavioral_features(req.transaction, ctx)
    feat_dict = behavioral.to_dict()

    booster = model_registry.require()

    vec, _ = build_model_vector(req, feat_dict)
    dmat = xgb.DMatrix(vec)

    # Predict probability for binary classifier
    # returns shape (n,)
    prob = float(booster.predict(dmat)[0])

    # Clamp safety
    if prob < 0.0:
        prob = 0.0
    if prob > 1.0:
        prob = 1.0

    score = int(round(prob * 100))
    label = risk_label(score)

    return InferResponse(
        transactionId=req.transaction.transactionId,
        userId=req.transaction.userId,
        merchantId=req.transaction.merchantId,
        modelVersion=settings.model_version,
        fraudProbability=prob,
        riskScore=score,
        riskLabel=label,
        features=feat_dict,
        xai=XAIBlock(
            topFactors=None,  # Phase 5
            shap=None,        # Phase 5
            lime=None,        # Phase 5
        ),
    )