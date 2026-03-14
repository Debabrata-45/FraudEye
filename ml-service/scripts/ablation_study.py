"""
Phase 13D — Ablation Study
Tests model performance with different feature groups removed.
Proves which feature groups add the most value.
"""
import pandas as pd
import numpy as np
import json
import os
import warnings
warnings.filterwarnings("ignore")
from datetime import datetime
from sklearn.metrics import f1_score, roc_auc_score, average_precision_score, precision_score, recall_score
import xgboost as xgb

DATA_DIR = os.environ.get("DATA_DIR", "../data/research")
OUT_DIR  = os.environ.get("OUT_DIR", "../results")
os.makedirs(OUT_DIR, exist_ok=True)

ALL_FEATURES = [
    "amount", "txn_velocity_5m", "txn_velocity_1h", "unusual_hour",
    "geo_anomaly_km", "geo_impossible", "new_device", "device_inconsistency",
    "merchant_risk_level", "spending_deviation_from_user_avg",
]

FEATURE_GROUPS = {
    "behavioral":        ["txn_velocity_5m", "txn_velocity_1h", "spending_deviation_from_user_avg"],
    "device":            ["new_device", "device_inconsistency"],
    "geo":               ["geo_anomaly_km", "geo_impossible"],
    "merchant":          ["merchant_risk_level"],
    "temporal":          ["unusual_hour"],
    "transaction_amount":["amount"],
}

ABLATION_CONFIGS = {
    "all_features":              ALL_FEATURES,
    "no_behavioral":             [f for f in ALL_FEATURES if f not in FEATURE_GROUPS["behavioral"]],
    "no_device":                 [f for f in ALL_FEATURES if f not in FEATURE_GROUPS["device"]],
    "no_geo":                    [f for f in ALL_FEATURES if f not in FEATURE_GROUPS["geo"]],
    "no_merchant":               [f for f in ALL_FEATURES if f not in FEATURE_GROUPS["merchant"]],
    "no_temporal":               [f for f in ALL_FEATURES if f not in FEATURE_GROUPS["temporal"]],
    "transaction_amount_only":   FEATURE_GROUPS["transaction_amount"],
}

def train_and_eval(X_train, y_train, X_val, y_val, X_test, y_test, features, name):
    scale_pos_weight = int((y_train == 0).sum() / max(y_train.sum(), 1))
    model = xgb.XGBClassifier(
        n_estimators=200, max_depth=6, learning_rate=0.05,
        subsample=0.8, colsample_bytree=0.8,
        scale_pos_weight=scale_pos_weight,
        eval_metric="aucpr", early_stopping_rounds=15,
        random_state=42, verbosity=0
    )
    model.fit(
        X_train[features], y_train,
        eval_set=[(X_val[features], y_val)],
        verbose=False
    )
    prob = model.predict_proba(X_test[features])[:, 1]
    pred = (prob >= 0.5).astype(int)

    return {
        "config":    name,
        "features":  features,
        "n_features": len(features),
        "precision": round(precision_score(y_test, pred, zero_division=0), 4),
        "recall":    round(recall_score(y_test, pred, zero_division=0), 4),
        "f1":        round(f1_score(y_test, pred, zero_division=0), 4),
        "roc_auc":   round(roc_auc_score(y_test, prob), 4),
        "pr_auc":    round(average_precision_score(y_test, prob), 4),
    }

def main():
    print("📥 Loading splits...")
    train = pd.read_csv(f"{DATA_DIR}/train.csv")
    val   = pd.read_csv(f"{DATA_DIR}/val.csv")
    test  = pd.read_csv(f"{DATA_DIR}/test.csv")

    X_train, y_train = train[ALL_FEATURES], train["fraud_label"]
    X_val,   y_val   = val[ALL_FEATURES],   val["fraud_label"]
    X_test,  y_test  = test[ALL_FEATURES],  test["fraud_label"]

    results = []
    baseline_f1 = None

    for config_name, features in ABLATION_CONFIGS.items():
        print(f"\n🔄 Running: {config_name} ({len(features)} features)...")
        result = train_and_eval(X_train, y_train, X_val, y_val, X_test, y_test, features, config_name)
        if config_name == "all_features":
            baseline_f1 = result["f1"]
            baseline_auc = result["roc_auc"]
        result["f1_drop"]  = round(baseline_f1 - result["f1"], 4) if baseline_f1 else 0
        result["auc_drop"] = round(baseline_auc - result["roc_auc"], 4) if baseline_f1 else 0
        results.append(result)
        print(f"   F1={result['f1']:.4f}  AUC={result['roc_auc']:.4f}  drop={result['f1_drop']:+.4f}")

    # Save
    output = {
        "experiment": "ablation_study",
        "evaluated_at": datetime.utcnow().isoformat(),
        "feature_groups": FEATURE_GROUPS,
        "results": results
    }
    with open(f"{OUT_DIR}/ablation_study.json", "w") as f:
        json.dump(output, f, indent=2)

    # Print table
    print(f"\n\n{'='*75}")
    print(f"  ABLATION STUDY RESULTS")
    print(f"{'='*75}")
    print(f"  {'Config':<30} {'Feats':>5} {'F1':>7} {'AUC':>7} {'F1 Drop':>9} {'AUC Drop':>10}")
    print(f"  {'-'*70}")
    for r in results:
        marker = " ◀ baseline" if r["config"] == "all_features" else ""
        print(f"  {r['config']:<30} {r['n_features']:>5} {r['f1']:>7.4f} {r['roc_auc']:>7.4f} {r['f1_drop']:>+9.4f} {r['auc_drop']:>+10.4f}{marker}")
    print(f"{'='*75}")
    print(f"\n✅ Saved to {OUT_DIR}/ablation_study.json")

if __name__ == "__main__":
    main()