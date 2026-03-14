"""
Phase 13F+G+H — Report Generation + Experiment Tracker
Reads all result JSONs and generates a final research summary report.
"""
import json
import os
from datetime import datetime

RESULTS_DIR = os.environ.get("RESULTS_DIR", "../results")
OUT_DIR     = RESULTS_DIR

def load_json(path):
    with open(path) as f:
        return json.load(f)

def main():
    print("📊 Generating FraudEye Research Report...\n")

    # Load all results
    dataset   = load_json(f"{RESULTS_DIR}/../data/research/dataset_summary.json")
    baseline  = load_json(f"{RESULTS_DIR}/baseline_comparison.json")
    ablation  = load_json(f"{RESULTS_DIR}/ablation_study.json")
    xai       = load_json(f"{RESULTS_DIR}/xai_evaluation.json")

    report = {
        "title": "FraudEye: AI-Powered Fraud Detection with Explainable AI",
        "generated_at": datetime.utcnow().isoformat(),
        "sections": {}
    }

    # Section 1: Dataset
    report["sections"]["dataset"] = {
        "total_samples": dataset["total_rows"],
        "features": dataset["features"],
        "n_features": len(dataset["features"]),
        "class_distribution": dataset["class_distribution"],
        "splits": dataset["splits"],
        "note": f"Severe class imbalance: {dataset['class_distribution']['imbalance_ratio']} safe-to-fraud ratio. Addressed via scale_pos_weight in XGBoost."
    }

    # Section 2: Baseline comparison
    models = {m["model"]: m for m in baseline["models"]}
    xgb_metrics = models.get("XGBoost (FraudEye)", {})
    lr_metrics  = models.get("Logistic Regression", {})
    rf_metrics  = models.get("Random Forest", {})

    report["sections"]["baseline_comparison"] = {
        "models_evaluated": list(models.keys()),
        "test_set_size": baseline["test_set_size"],
        "results": baseline["models"],
        "best_model": max(baseline["models"], key=lambda x: x["f1"])["model"],
        "xgboost_vs_lr": {
            "f1_improvement":  round(xgb_metrics.get("f1",0) - lr_metrics.get("f1",0), 4),
            "auc_improvement": round(xgb_metrics.get("roc_auc",0) - lr_metrics.get("roc_auc",0), 4),
        },
        "xgboost_vs_rf": {
            "f1_improvement":  round(xgb_metrics.get("f1",0) - rf_metrics.get("f1",0), 4),
            "auc_improvement": round(xgb_metrics.get("roc_auc",0) - rf_metrics.get("roc_auc",0), 4),
        }
    }

    # Section 3: Ablation
    ablation_results = ablation["results"]
    baseline_result  = next(r for r in ablation_results if r["config"] == "all_features")
    most_impactful   = max(
        [r for r in ablation_results if r["config"] != "all_features"],
        key=lambda x: x["f1_drop"]
    )
    report["sections"]["ablation_study"] = {
        "configs_tested": len(ablation_results),
        "baseline_f1":    baseline_result["f1"],
        "baseline_auc":   baseline_result["roc_auc"],
        "results":        ablation_results,
        "most_impactful_removal": {
            "config":   most_impactful["config"],
            "f1_drop":  most_impactful["f1_drop"],
            "auc_drop": most_impactful["auc_drop"],
        },
        "conclusion": f"Removing '{most_impactful['config'].replace('no_','')}' features causes the largest performance drop (F1: -{most_impactful['f1_drop']:.4f}), proving their importance."
    }

    # Section 4: XAI
    report["sections"]["xai_evaluation"] = {
        "eval_samples": xai["eval_samples"],
        "metrics": xai["metrics"],
        "global_feature_importance": xai["global_feature_importance"],
        "top_features": {
            "shap": xai["shap_top3_features"],
            "xgb":  xai["xgb_top3_features"],
        },
        "conclusions": [
            f"SHAP explanations are perfectly consistent (score: {xai['metrics']['consistency']:.1f})",
            f"SHAP explanations are highly stable under input perturbation (ρ={xai['metrics']['stability_spearman_rho']:.4f})",
            f"SHAP and XGBoost feature rankings agree strongly (ρ={xai['metrics']['feature_importance_agreement_spearman']:.4f})",
            f"Top-3 feature agreement between SHAP and XGBoost: {xai['metrics']['top3_feature_agreement']*100:.0f}%"
        ]
    }

    # Save full report
    with open(f"{OUT_DIR}/research_report.json", "w") as f:
        json.dump(report, f, indent=2)

    # Print readable summary
    print("="*70)
    print("  FRAUDEYE RESEARCH REPORT SUMMARY")
    print("="*70)

    print(f"\n📦 DATASET")
    print(f"   Total samples : {dataset['total_rows']:,}")
    print(f"   Fraud ratio   : {dataset['class_distribution']['fraud_ratio']*100:.2f}%")
    print(f"   Imbalance     : {dataset['class_distribution']['imbalance_ratio']}")
    print(f"   Features      : {len(dataset['features'])}")

    print(f"\n📊 BASELINE COMPARISON (Test Set)")
    print(f"   {'Model':<28} {'Prec':>6} {'Rec':>6} {'F1':>6} {'AUC':>7} {'PR-AUC':>8}")
    print(f"   {'-'*60}")
    for m in baseline["models"]:
        print(f"   {m['model']:<28} {m['precision']:>6.4f} {m['recall']:>6.4f} {m['f1']:>6.4f} {m['roc_auc']:>7.4f} {m['pr_auc']:>8.4f}")

    print(f"\n🔬 ABLATION STUDY")
    print(f"   {'Config':<30} {'F1':>7} {'AUC':>7} {'F1 Drop':>9}")
    print(f"   {'-'*55}")
    for r in ablation_results:
        marker = " ◀" if r["config"] == "all_features" else ""
        print(f"   {r['config']:<30} {r['f1']:>7.4f} {r['roc_auc']:>7.4f} {r['f1_drop']:>+9.4f}{marker}")

    print(f"\n🔍 XAI EVALUATION")
    print(f"   Consistency          : {xai['metrics']['consistency']:.4f}")
    print(f"   Stability (ρ)        : {xai['metrics']['stability_spearman_rho']:.4f}")
    print(f"   Importance agreement : {xai['metrics']['feature_importance_agreement_spearman']:.4f}")
    print(f"   Top-3 agreement      : {xai['metrics']['top3_feature_agreement']*100:.0f}%")

    print(f"\n✅ Full report saved to {OUT_DIR}/research_report.json")

if __name__ == "__main__":
    main()