"""
Switch the active model version.
Usage: python scripts/switch_model.py --version xgb_v2
"""
import os
import json
import argparse

MODELS_DIR = "models"
CURRENT_MODEL_FILE = os.path.join(MODELS_DIR, "current_model.json")


def switch(version: str):
    model_file = os.path.join(MODELS_DIR, f"{version}.json")
    meta_file = os.path.join(MODELS_DIR, f"{version}_metadata.json")

    if not os.path.exists(model_file):
        print(f"❌ Model file not found: {model_file}")
        return

    # Read metadata
    metrics = {}
    if os.path.exists(meta_file):
        with open(meta_file) as f:
            meta = json.load(f)
            metrics = meta.get("metrics", {})

    # Update current_model.json
    current = {
        "activeVersion": version,
        "modelFile": model_file,
        "metrics": metrics,
    }
    with open(CURRENT_MODEL_FILE, "w") as f:
        json.dump(current, f, indent=2)

    print(f"✅ Switched active model to: {version}")
    print(f"   Model file: {model_file}")
    print(f"   Metrics: {metrics}")
    print(f"\n⚠️  Restart ML service to apply: uvicorn app.main:app --port 8000")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", required=True)
    args = parser.parse_args()
    switch(args.version)