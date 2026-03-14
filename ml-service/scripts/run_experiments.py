"""
Phase 13 — Master Experiment Runner
Run all experiments in sequence:
  python run_experiments.py

Results saved to:
  ml-service/results/
    baseline_comparison.json
    ablation_study.json
    xai_evaluation.json
    research_report.json
  ml-service/data/research/
    train.csv, val.csv, test.csv
    dataset_summary.json
"""
import os
import sys
import subprocess
from datetime import datetime

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

def run(script, env_vars=None):
    env = os.environ.copy()
    if env_vars:
        env.update(env_vars)
    print(f"\n{'#'*60}")
    print(f"# Running: {script}")
    print(f"{'#'*60}")
    result = subprocess.run(
        [sys.executable, os.path.join(SCRIPTS_DIR, script)],
        env=env
    )
    if result.returncode != 0:
        print(f"❌ {script} failed with exit code {result.returncode}")
        sys.exit(1)
    print(f"✅ {script} completed")

def main():
    base = os.path.abspath(os.path.join(SCRIPTS_DIR, ".."))
    env = {
        "DATA_PATH":   f"{base}/fraudeye_synthetic_transactions.csv",
        "OUT_DIR":     f"{base}/data/research",
        "DATA_DIR":    f"{base}/data/research",
        "MODELS_DIR":  f"{base}/models",
        "RESULTS_DIR": f"{base}/results",
    }

    # Override OUT_DIR for baseline/ablation/xai to results/
    results_env = {**env, "OUT_DIR": f"{base}/results"}

    os.makedirs(f"{base}/data/research", exist_ok=True)
    os.makedirs(f"{base}/results", exist_ok=True)

    start = datetime.utcnow()
    print(f"\n🚀 FraudEye Phase 13 — Experiments starting at {start.isoformat()}")

    run("prepare_dataset.py",    {**env})
    run("baseline_comparison.py", {**env, "OUT_DIR": f"{base}/results"})
    run("ablation_study.py",      {**env, "OUT_DIR": f"{base}/results"})
    run("xai_evaluation.py",      {**env, "OUT_DIR": f"{base}/results"})
    run("generate_report.py",     {**env, "RESULTS_DIR": f"{base}/results"})

    end = datetime.utcnow()
    elapsed = (end - start).seconds
    print(f"\n{'='*60}")
    print(f"✅ All Phase 13 experiments complete!")
    print(f"   Total time: {elapsed}s")
    print(f"   Results in: {base}/results/")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()