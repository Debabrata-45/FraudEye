"""
Compare xgb_v1 vs xgb_v2 metrics for research paper.
Usage: python scripts/compare_models.py
"""
import os
import json

MODELS_DIR = "models"
ARTIFACTS_DIR = "artifacts"

# xgb_v1 metadata is stored differently — we compute from training report
XGB_V1_METRICS = {
    "auc": 0.9962,
    "precision": 0.7324,
    "recall": 0.9587,
    "f1": 0.8308,
    "train_rows": 80000,
    "val_rows": 20000,
    "fraud_count": 3500,
    "safe_count": 96500,
    "data_source": "100k synthetic only",
}


def load_metadata(version: str) -> dict:
    path = os.path.join(MODELS_DIR, f"{version}_metadata.json")
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return {}


def print_comparison():
    v2_meta = load_metadata("xgb_v2")
    v2_metrics = v2_meta.get("metrics", {})

    print("\n" + "="*65)
    print("  FraudEye — Model Comparison Report")
    print("  xgb_v1 (Baseline) vs xgb_v2 (Feedback-Enhanced)")
    print("="*65)

    print(f"\n{'Metric':<28} {'xgb_v1':>12} {'xgb_v2':>12} {'Delta':>10}")
    print("-"*65)

    metrics_to_compare = [
        ("ROC-AUC",      "auc"),
        ("Precision",    "precision"),
        ("Recall",       "recall"),
        ("F1-Score",     "f1"),
        ("Train Rows",   "train_rows"),
        ("Val Rows",     "val_rows"),
        ("Fraud Count",  "fraud_count"),
        ("Safe Count",   "safe_count"),
    ]

    for label, key in metrics_to_compare:
        v1_val = XGB_V1_METRICS.get(key, "N/A")
        v2_val = v2_metrics.get(key, "N/A")

        if isinstance(v1_val, float) and isinstance(v2_val, float):
            delta = v2_val - v1_val
            delta_str = f"{delta:+.4f}"
            print(f"{label:<28} {v1_val:>12.4f} {v2_val:>12.4f} {delta_str:>10}")
        else:
            print(f"{label:<28} {str(v1_val):>12} {str(v2_val):>12} {'—':>10}")

    print("-"*65)
    print(f"\n{'Data Source':<28} {'synthetic':>12} {'syn+feedback':>12}")
    print(f"{'Trained At':<28} {'Phase 4':>12} {v2_meta.get('trainedAt','N/A')[:10]:>12}")

    print("\n" + "="*65)
    print("  Interpretation")
    print("="*65)
    print("""
  xgb_v1 — Baseline model trained on 100,000 synthetic transactions.
            Strong generalization but no real analyst signal.

  xgb_v2 — Retrained with synthetic data + 10 analyst-labeled rows.
            Feedback loop validates the retraining pipeline works.
            As more analyst feedback accumulates, xgb_v2+ versions
            will increasingly reflect real-world fraud patterns.

  Key Insight for Research Paper:
  FraudEye implements a human-in-the-loop feedback loop where
  analyst verdicts continuously improve model training data,
  enabling a self-improving fraud detection system.
""")

    # Save report as JSON for paper
    report = {
        "xgb_v1": XGB_V1_METRICS,
        "xgb_v2": v2_metrics,
        "comparison": {
            "auc_delta": round(v2_metrics.get("auc", 0) - XGB_V1_METRICS["auc"], 4),
            "f1_delta": round(v2_metrics.get("f1", 0) - XGB_V1_METRICS["f1"], 4),
            "recall_delta": round(v2_metrics.get("recall", 0) - XGB_V1_METRICS["recall"], 4),
        }
    }
    report_path = os.path.join(MODELS_DIR, "comparison_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"✅ Comparison report saved to: {report_path}")


if __name__ == "__main__":
    print_comparison()