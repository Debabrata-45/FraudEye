"""
Rollback to previous model version.
Usage: python scripts/rollback_model.py --version xgb_v1
"""
import os
import json
import argparse

MODELS_DIR = "models"
CURRENT_MODEL_FILE = os.path.join(MODELS_DIR, "current_model.json")
ARTIFACTS_DIR = "artifacts"


def rollback(version: str):
    # Check if it's xgb_v1 (original artifacts folder)
    if version == "xgb_v1":
        model_file = os.path.join(ARTIFACTS_DIR, "xgb_model.json")
    else:
        model_file = os.path.join(MODELS_DIR, f"{version}.json")

    if not os.path.exists(model_file):
        print(f"❌ Model file not found: {model_file}")
        return

    current = {
        "activeVersion": version,
        "modelFile": model_file,
    }
    with open(CURRENT_MODEL_FILE, "w") as f:
        json.dump(current, f, indent=2)

    print(f"✅ Rolled back to: {version}")
    print(f"   Model file: {model_file}")
    print(f"\n⚠️  Restart ML service to apply: uvicorn app.main:app --port 8000")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", required=True, help="Version to rollback to e.g. xgb_v1")
    args = parser.parse_args()
    rollback(args.version)