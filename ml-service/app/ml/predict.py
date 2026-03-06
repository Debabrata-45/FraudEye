from __future__ import annotations
import logging

import numpy as np
import xgboost as xgb

from app.schemas.infer import InferRequest, InferResponse
from app.models.artifacts import artifact_store
from app.ml.preprocess import compute_features
from app.ml.explain_shap import compute_shap
from app.ml.explain_lime import compute_lime
from app.ml.explain_unified import unify_explanations

logger = logging.getLogger("predict")


def risk_label(score: int) -> str:
    if score <= 30:
        return "LOW"
    if score <= 70:
        return "MEDIUM"
    return "HIGH"


def _lime_predict_fn(X: np.ndarray) -> np.ndarray:
    """
    Wrapper for LIME — takes 2D numpy array, returns (n, 2) probabilities.
    """
    booster = artifact_store.require_model()
    dmat = xgb.DMatrix(X)
    probs = booster.predict(dmat)
    return np.column_stack([1 - probs, probs])


def predict(req: InferRequest) -> InferResponse:
    # Step 1 — preprocess
    feat_dict = compute_features(req)

    # Step 2 — build feature vector in exact training order
    feature_names = artifact_store.require_features()
    values = [float(feat_dict.get(f, 0.0)) for f in feature_names]
    vec = np.array([values], dtype=np.float32)

    # Step 3 — XGBoost inference
    booster = artifact_store.require_model()
    dmat = xgb.DMatrix(vec, feature_names=feature_names)
    prob = float(booster.predict(dmat)[0])
    prob = max(0.0, min(1.0, prob))
    score = int(round(prob * 100))
    label = risk_label(score)

    # Step 4 — SHAP
    shap_block = compute_shap(
        feature_vector=vec,
        feature_names=feature_names,
        shap_explainer=artifact_store.shap_explainer,
    )

    # Step 5 — LIME
    lime_block = compute_lime(
        feature_vector=vec,
        feature_names=feature_names,
        lime_explainer=artifact_store.lime_explainer,
        predict_fn=_lime_predict_fn,
    )

    # Step 6 — Unified top factors
    top_factors = unify_explanations(shap_block, lime_block, top_n=5)

    return InferResponse(
        transactionId=req.transaction.transactionId,
        fraudProbability=round(prob, 6),
        riskScore=score,
        riskLabel=label,
        topFactors=top_factors,
        shap=shap_block,
        lime=lime_block,
        modelVersion="xgb_v1",
    )