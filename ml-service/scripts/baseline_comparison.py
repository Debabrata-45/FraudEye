"""
Phase 13B+C — Baseline Model Comparison + Evaluation Metrics
Trains XGBoost, Logistic Regression, Random Forest on the same splits.
Generates Precision, Recall, F1, ROC-AUC, PR-AUC, Confusion Matrix for all.
"""
import pandas as pd
import numpy as np
import json
import os
import warnings
warnings.filterwarnings("ignore")
from datetime import datetime

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score,
    confusion_matrix, classification_report
)
import xgboost as xgb

DATA_DIR   = os.environ.get("DATA_DIR", "../data/research")
MODELS_DIR = os.environ.get("MODELS_DIR", "../models")
OUT_DIR    = os.environ.get("OUT_DIR", "../results")
os.makedirs(OUT_DIR, exist_ok=True)

FEATURES = [
    "amount", "txn_velocity_5m", "txn_velocity_1h", "unusual_hour",
    "geo_anomaly_km", "geo_impossible", "new_device", "device_inconsistency",
    "merchant_risk_level", "spending_deviation_from_user_avg",
]

def load_splits():
    train = pd.read_csv(f"{DATA_DIR}/train.csv")
    val   = pd.read_csv(f"{DATA_DIR}/val.csv")
    test  = pd.read_csv(f"{DATA_DIR}/test.csv")
    X_train = train[FEATURES]; y_train = train["fraud_label"]
    X_val   = val[FEATURES];   y_val   = val["fraud_label"]
    X_test  = test[FEATURES];  y_test  = test["fraud_label"]
    return X_train, y_train, X_val, y_val, X_test, y_test

def evaluate(name, y_true, y_pred, y_prob):
    cm = confusion_matrix(y_true, y_pred)
    tn, fp, fn, tp = cm.ravel()
    metrics = {
        "model": name,
        "precision":  round(precision_score(y_true, y_pred, zero_division=0), 4),
        "recall":     round(recall_score(y_true, y_pred, zero_division=0), 4),
        "f1":         round(f1_score(y_true, y_pred, zero_division=0), 4),
        "roc_auc":    round(roc_auc_score(y_true, y_prob), 4),
        "pr_auc":     round(average_precision_score(y_true, y_prob), 4),
        "confusion_matrix": {
            "tn": int(tn), "fp": int(fp),
            "fn": int(fn), "tp": int(tp)
        },
        "support": {
            "total": int(len(y_true)),
            "fraud": int(y_true.sum()),
            "safe":  int((y_true == 0).sum())
        }
    }
    print(f"\n{'='*50}")
    print(f"  {name}")
    print(f"{'='*50}")
    print(f"  Precision : {metrics['precision']:.4f}")
    print(f"  Recall    : {metrics['recall']:.4f}")
    print(f"  F1-Score  : {metrics['f1']:.4f}")
    print(f"  ROC-AUC   : {metrics['roc_auc']:.4f}")
    print(f"  PR-AUC    : {metrics['pr_auc']:.4f}")
    print(f"  Confusion Matrix:")
    print(f"    TN={tn}  FP={fp}")
    print(f"    FN={fn}  TP={tp}")
    return metrics

def train_logistic_regression(X_train, y_train):
    print("\n🔄 Training Logistic Regression...")
    model = LogisticRegression(
        max_iter=1000, class_weight="balanced",
        C=1.0, solver="lbfgs", random_state=42
    )
    model.fit(X_train, y_train)
    return model

def train_random_forest(X_train, y_train):
    print("\n🔄 Training Random Forest...")
    model = RandomForestClassifier(
        n_estimators=200, max_depth=10,
        class_weight="balanced", random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    return model

def train_xgboost(X_train, y_train, X_val, y_val):
    print("\n🔄 Training XGBoost...")
    scale_pos_weight = int((y_train == 0).sum() / y_train.sum())
    model = xgb.XGBClassifier(
        n_estimators=300, max_depth=6,
        learning_rate=0.05, subsample=0.8,
        colsample_bytree=0.8, scale_pos_weight=scale_pos_weight,
        eval_metric="aucpr", early_stopping_rounds=20,
        random_state=42, verbosity=0
    )
    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        verbose=False
    )
    return model

def main():
    print("📥 Loading splits...")
    X_train, y_train, X_val, y_val, X_test, y_test = load_splits()
    print(f"   Train: {len(X_train):,} | Val: {len(X_val):,} | Test: {len(X_test):,}")

    results = []

    # 1. Logistic Regression
    lr = train_logistic_regression(X_train, y_train)
    lr_prob = lr.predict_proba(X_test)[:, 1]
    lr_pred = (lr_prob >= 0.5).astype(int)
    results.append(evaluate("Logistic Regression", y_test, lr_pred, lr_prob))

    # 2. Random Forest
    rf = train_random_forest(X_train, y_train)
    rf_prob = rf.predict_proba(X_test)[:, 1]
    rf_pred = (rf_prob >= 0.5).astype(int)
    results.append(evaluate("Random Forest", y_test, rf_pred, rf_prob))

    # 3. XGBoost (retrained on research splits)
    xgb_model = train_xgboost(X_train, y_train, X_val, y_val)
    xgb_prob = xgb_model.predict_proba(X_test)[:, 1]
    xgb_pred = (xgb_prob >= 0.5).astype(int)
    results.append(evaluate("XGBoost (FraudEye)", y_test, xgb_pred, xgb_prob))

    # Save results
    output = {
        "experiment": "baseline_comparison",
        "evaluated_at": datetime.utcnow().isoformat(),
        "test_set_size": len(y_test),
        "fraud_ratio": round(float(y_test.mean()), 4),
        "models": results
    }
    with open(f"{OUT_DIR}/baseline_comparison.json", "w") as f:
        json.dump(output, f, indent=2)

    # Print comparison table
    print(f"\n\n{'='*70}")
    print(f"  BASELINE COMPARISON TABLE")
    print(f"{'='*70}")
    print(f"  {'Model':<28} {'Prec':>6} {'Rec':>6} {'F1':>6} {'AUC':>7} {'PR-AUC':>8}")
    print(f"  {'-'*65}")
    for r in results:
        print(f"  {r['model']:<28} {r['precision']:>6.4f} {r['recall']:>6.4f} {r['f1']:>6.4f} {r['roc_auc']:>7.4f} {r['pr_auc']:>8.4f}")
    print(f"{'='*70}")
    print(f"\n✅ Saved to {OUT_DIR}/baseline_comparison.json")

if __name__ == "__main__":
    main()