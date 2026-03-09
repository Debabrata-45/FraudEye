"""
Phase 8 — Retrain XGBoost using synthetic dataset + analyst feedback.
Usage: python scripts/train_model.py --version xgb_v2
"""
import os
import sys
import json
import argparse
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report, precision_recall_fscore_support
import xgboost as xgb

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from training.train_xgb import build_features, FEATURES

def load_combined_data(feedback_path: str, synthetic_path: str) -> tuple:
    frames = []

    # 1) Load synthetic dataset — already has all feature columns
    if os.path.exists(synthetic_path):
        df_syn = pd.read_csv(synthetic_path)
        df_syn_feat = build_features(df_syn)
        X_syn = df_syn_feat[FEATURES].astype(np.float32).values
        y_syn = df_syn_feat["fraud_label"].astype(int).values
        print(f"   Synthetic rows after feature engineering: {len(X_syn)}")
        print(f"   FRAUD: {(y_syn==1).sum()} | SAFE: {(y_syn==0).sum()}")
        frames.append((X_syn, y_syn))

    # 2) Load analyst feedback
    if os.path.exists(feedback_path):
        df_fb = pd.read_csv(feedback_path)
        if len(df_fb) >= 2:
            df_fb_feat = build_features(df_fb)
            X_fb = df_fb_feat[FEATURES].astype(np.float32).values
            y_fb = df_fb_feat["fraud_label"].astype(int).values
            print(f"   Feedback rows after feature engineering: {len(X_fb)}")
            print(f"   FRAUD: {(y_fb==1).sum()} | SAFE: {(y_fb==0).sum()}")
            frames.append((X_fb, y_fb))

    X = np.concatenate([f[0] for f in frames], axis=0)
    y = np.concatenate([f[1] for f in frames], axis=0)
    print(f"   Total combined rows: {len(X)}")
    return X, y


def train(version: str, feedback_path: str, synthetic_path: str, models_dir: str):
    print(f"\n🚀 Starting retraining — version: {version}")

    X, y = load_combined_data(feedback_path, synthetic_path)

    if len(X) < 10:
        print("❌ Not enough data")
        sys.exit(1)

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    neg = (y_train == 0).sum()
    pos = (y_train == 1).sum()
    scale_pos_weight = max(1.0, neg / max(1, pos))

    print(f"\n   Train rows: {len(X_train)} | Val rows: {len(X_val)}")
    print(f"   scale_pos_weight: {scale_pos_weight:.2f}")

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
        "lambda": 1.0,
        "alpha": 0.0,
        "scale_pos_weight": scale_pos_weight,
        "tree_method": "hist",
        "seed": 42,
    }

    print("\n📈 Training...")
    booster = xgb.train(
        params, dtrain,
        num_boost_round=300,
        evals=[(dtrain, "train"), (dval, "val")],
        early_stopping_rounds=30,
        verbose_eval=50,
    )

    # Metrics
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
        "fraud_count": int((y==1).sum()),
        "safe_count": int((y==0).sum()),
    }

    print(f"\n📊 Metrics:")
    print(f"   AUC:       {metrics['auc']}")
    print(f"   Precision: {metrics['precision']}")
    print(f"   Recall:    {metrics['recall']}")
    print(f"   F1:        {metrics['f1']}")
    print(classification_report(y_val, preds, digits=4))

    # Save model
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, f"{version}.json")
    booster.save_model(model_path)
    print(f"✅ Model saved to: {model_path}")

    # Save metadata
    metadata = {
        "modelVersion": version,
        "trainedAt": datetime.now(timezone.utc).isoformat(),
        "features": FEATURES,
        "metrics": metrics,
        "feedbackPath": feedback_path,
        "syntheticPath": synthetic_path,
    }
    meta_path = os.path.join(models_dir, f"{version}_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"✅ Metadata saved to: {meta_path}")

    return model_path, metadata


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", default="xgb_v2")
    parser.add_argument("--data", default="data/retrain_dataset.csv")
    parser.add_argument("--synthetic", default="fraudeye_synthetic_transactions.csv")
    parser.add_argument("--models-dir", default="models")
    args = parser.parse_args()

    train(args.version, args.data, args.synthetic, args.models_dir)