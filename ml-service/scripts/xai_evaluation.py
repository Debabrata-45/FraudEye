"""
Phase 13E — XAI Evaluation
Evaluates SHAP explanation quality:
- Consistency (same input → same explanation)
- Stability (slightly perturbed input → similar explanation)
- Feature importance agreement (SHAP global vs XGBoost built-in)
- Top-3 feature agreement rate
"""
import pandas as pd
import numpy as np
import json
import os
import warnings
warnings.filterwarnings("ignore")
from datetime import datetime
from scipy.stats import spearmanr
import xgboost as xgb
import shap

DATA_DIR = os.environ.get("DATA_DIR", "../data/research")
OUT_DIR  = os.environ.get("OUT_DIR", "../results")
os.makedirs(OUT_DIR, exist_ok=True)

FEATURES = [
    "amount", "txn_velocity_5m", "txn_velocity_1h", "unusual_hour",
    "geo_anomaly_km", "geo_impossible", "new_device", "device_inconsistency",
    "merchant_risk_level", "spending_deviation_from_user_avg",
]

def main():
    print("📥 Loading test set...")
    test  = pd.read_csv(f"{DATA_DIR}/test.csv")
    train = pd.read_csv(f"{DATA_DIR}/train.csv")
    val   = pd.read_csv(f"{DATA_DIR}/val.csv")

    X_train, y_train = train[FEATURES], train["fraud_label"]
    X_val,   y_val   = val[FEATURES],   val["fraud_label"]
    X_test,  y_test  = test[FEATURES],  test["fraud_label"]

    # Use fraud samples for XAI evaluation (more interesting)
    fraud_test = X_test[y_test == 1].head(200)
    safe_test  = X_test[y_test == 0].head(200)
    eval_set   = pd.concat([fraud_test, safe_test]).reset_index(drop=True)

    print("🔄 Training XGBoost for XAI evaluation...")
    scale_pos_weight = int((y_train == 0).sum() / y_train.sum())
    model = xgb.XGBClassifier(
        n_estimators=200, max_depth=6, learning_rate=0.05,
        subsample=0.8, colsample_bytree=0.8,
        scale_pos_weight=scale_pos_weight,
        random_state=42, verbosity=0
    )
    model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)

    print("🔄 Computing SHAP values...")
    explainer   = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(eval_set)

    # 1. Consistency — same input produces same SHAP values
    shap_run1 = explainer.shap_values(eval_set.head(50))
    shap_run2 = explainer.shap_values(eval_set.head(50))
    consistency = float(np.allclose(shap_run1, shap_run2, atol=1e-6))
    print(f"✅ Consistency: {consistency:.4f} (1.0 = perfectly consistent)")

    # 2. Stability — perturb inputs slightly, measure explanation change
    noise = np.random.normal(0, 0.01, eval_set.shape)
    perturbed = eval_set + noise
    shap_orig  = explainer.shap_values(eval_set.head(100))
    shap_pert  = explainer.shap_values(perturbed.head(100))
    # Rank correlation per sample
    correlations = []
    for i in range(len(shap_orig)):
        if np.std(shap_orig[i]) > 0 and np.std(shap_pert[i]) > 0:
            corr, _ = spearmanr(shap_orig[i], shap_pert[i])
            correlations.append(corr)
    stability = float(np.mean(correlations))
    print(f"✅ Stability (mean Spearman ρ): {stability:.4f} (1.0 = perfectly stable)")

    # 3. Feature importance agreement — SHAP global vs XGBoost built-in
    shap_importance = np.abs(shap_values).mean(axis=0)
    shap_rank = np.argsort(-shap_importance)
    xgb_importance = model.feature_importances_
    xgb_rank = np.argsort(-xgb_importance)
    corr_global, _ = spearmanr(shap_rank, xgb_rank)
    print(f"✅ Feature importance agreement (Spearman ρ): {corr_global:.4f}")

    # 4. Top-3 feature agreement
    shap_top3 = set(np.array(FEATURES)[shap_rank[:3]])
    xgb_top3  = set(np.array(FEATURES)[xgb_rank[:3]])
    top3_agreement = len(shap_top3 & xgb_top3) / 3
    print(f"✅ Top-3 feature agreement: {top3_agreement:.4f}")
    print(f"   SHAP top-3: {shap_top3}")
    print(f"   XGB  top-3: {xgb_top3}")

    # 5. Global feature importance table
    importance_table = []
    for i, feat in enumerate(FEATURES):
        importance_table.append({
            "feature": feat,
            "shap_mean_abs": round(float(shap_importance[i]), 6),
            "xgb_importance": round(float(xgb_importance[i]), 6),
            "shap_rank": int(np.where(shap_rank == i)[0][0]) + 1,
            "xgb_rank":  int(np.where(xgb_rank  == i)[0][0]) + 1,
        })
    importance_table.sort(key=lambda x: x["shap_rank"])

    print(f"\n{'='*65}")
    print(f"  GLOBAL FEATURE IMPORTANCE (SHAP)")
    print(f"{'='*65}")
    print(f"  {'Feature':<38} {'SHAP':>8} {'XGB':>8} {'S.Rank':>7} {'X.Rank':>7}")
    print(f"  {'-'*60}")
    for row in importance_table:
        print(f"  {row['feature']:<38} {row['shap_mean_abs']:>8.4f} {row['xgb_importance']:>8.4f} {row['shap_rank']:>7} {row['xgb_rank']:>7}")

    # Save
    output = {
        "experiment": "xai_evaluation",
        "evaluated_at": datetime.utcnow().isoformat(),
        "eval_samples": len(eval_set),
        "metrics": {
            "consistency": consistency,
            "stability_spearman_rho": round(stability, 4),
            "feature_importance_agreement_spearman": round(float(corr_global), 4),
            "top3_feature_agreement": round(top3_agreement, 4),
        },
        "global_feature_importance": importance_table,
        "shap_top3_features": list(shap_top3),
        "xgb_top3_features":  list(xgb_top3),
    }
    with open(f"{OUT_DIR}/xai_evaluation.json", "w") as f:
        json.dump(output, f, indent=2)

    print(f"\n✅ Saved to {OUT_DIR}/xai_evaluation.json")

if __name__ == "__main__":
    main()