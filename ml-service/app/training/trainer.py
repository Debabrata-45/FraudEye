import os
import json
import numpy as np
from datetime import datetime, timezone
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report, precision_recall_fscore_support
import xgboost as xgb
from app.features.schema import FEATURES


def train_model(X: np.ndarray, y: np.ndarray, version: str, models_dir: str):
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    neg = (y_train == 0).sum()
    pos = (y_train == 1).sum()
    scale_pos_weight = max(1.0, neg / max(1, pos))

    print(f"   Train: {len(X_train)} | Val: {len(X_val)} | scale_pos_weight: {scale_pos_weight:.2f}")

    dtrain = xgb.DMatrix(X_train, label=y_train, feature_names=FEATURES)
    dval = xgb.DMatrix(X_val, label=y_val, feature_names=FEATURES)

    params = {
        "objective": "binary:logistic",
        "eval_metric": "auc",
        "max_depth": 5,
        "eta": 0.1,
        "subsample": 0.9,
        "colsample_bytree": 0.9,
        "min_child_weight": 1,
        "scale_pos_weight": scale_pos_weight,
        "tree_method": "hist",
        "seed": 42,
    }

    booster = xgb.train(
        params, dtrain,
        num_boost_round=300,
        evals=[(dtrain, "train"), (dval, "val")],
        early_stopping_rounds=30,
        verbose_eval=50,
    )

    probs = booster.predict(dval)
    preds = (probs >= 0.5).astype(int)
    auc = roc_auc_score(y_val, probs) if len(np.unique(y_val)) > 1 else 0.0
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_val, preds, average="binary", zero_division=0
    )

    metrics = {
        "auc": round(float(auc), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1": round(float(f1), 4),
        "train_rows": int(len(X_train)),
        "val_rows": int(len(X_val)),
    }

    print(f"\n📊 AUC: {metrics['auc']} | Precision: {metrics['precision']} | Recall: {metrics['recall']} | F1: {metrics['f1']}")
    print(classification_report(y_val, preds, digits=4))

    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, f"{version}.json")
    booster.save_model(model_path)

    metadata = {
        "modelVersion": version,
        "trainedAt": datetime.now(timezone.utc).isoformat(),
        "features": FEATURES,
        "metrics": metrics,
    }
    meta_path = os.path.join(models_dir, f"{version}_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"✅ Model saved: {model_path}")
    print(f"✅ Metadata saved: {meta_path}")
    return model_path, metadata