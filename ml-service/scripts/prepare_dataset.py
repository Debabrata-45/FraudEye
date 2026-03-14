"""
Phase 13A — Dataset Preparation
Prepares train/val/test splits, documents class imbalance,
and creates research-ready data snapshots.
"""
import pandas as pd
import numpy as np
import json
import os
from datetime import datetime
from sklearn.model_selection import train_test_split

DATA_PATH = os.environ.get("DATA_PATH", "../fraudeye_synthetic_transactions.csv")
OUT_DIR   = os.environ.get("OUT_DIR", "../data/research")
os.makedirs(OUT_DIR, exist_ok=True)

FEATURES = [
    "amount", "txn_velocity_5m", "txn_velocity_1h", "unusual_hour",
    "geo_anomaly_km", "geo_impossible", "new_device", "device_inconsistency",
    "merchant_risk_level", "spending_deviation_from_user_avg",
]

def engineer_features(df):
    df = df.copy()
    ts = pd.to_datetime(df["timestamp"], utc=True)
    df["unusual_hour"]   = ts.dt.hour.apply(lambda h: 1 if h < 6 or h >= 23 else 0).astype(int)
    df["geo_anomaly_km"] = 0.0
    df["geo_impossible"] = 0
    df["new_device"]     = df["device_id"].apply(lambda x: 1 if pd.isna(x) or str(x).startswith("new") else 0).astype(int)
    df["device_inconsistency"] = 0
    df["txn_velocity_5m"]  = 1
    df["txn_velocity_1h"]  = 1
    df["spending_deviation_from_user_avg"] = (
        (df["amount"] - df["user_avg_spend_30d"]) / (df["user_std_spend_30d"] + 1e-6)
    ).clip(-10, 10)
    return df

def main():
    print("📥 Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    print(f"   Total rows: {len(df):,}")
    df = engineer_features(df)
    missing = [f for f in FEATURES if f not in df.columns]
    if missing:
        for f in missing:
            df[f] = 0
    X = df[FEATURES]
    y = df["fraud_label"]
    fraud_count = int(y.sum())
    safe_count  = int((y == 0).sum())
    fraud_ratio = fraud_count / len(y)
    print(f"\n📊 Class Distribution:")
    print(f"   Total:  {len(y):,}")
    print(f"   Fraud:  {fraud_count:,} ({fraud_ratio:.2%})")
    print(f"   Safe:   {safe_count:,} ({1-fraud_ratio:.2%})")
    print(f"   Imbalance ratio: 1:{safe_count//fraud_count}")
    X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)
    X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.1765, random_state=42, stratify=y_temp)
    print(f"\n✂️  Splits:")
    print(f"   Train: {len(X_train):,} ({len(X_train)/len(X):.1%}) | fraud: {y_train.sum():,}")
    print(f"   Val:   {len(X_val):,}  ({len(X_val)/len(X):.1%})  | fraud: {y_val.sum():,}")
    print(f"   Test:  {len(X_test):,} ({len(X_test)/len(X):.1%}) | fraud: {y_test.sum():,}")
    train_df = X_train.copy(); train_df["fraud_label"] = y_train.values
    val_df   = X_val.copy();   val_df["fraud_label"]   = y_val.values
    test_df  = X_test.copy();  test_df["fraud_label"]  = y_test.values
    train_df.to_csv(f"{OUT_DIR}/train.csv", index=False)
    val_df.to_csv(f"{OUT_DIR}/val.csv",     index=False)
    test_df.to_csv(f"{OUT_DIR}/test.csv",   index=False)
    summary = {
        "prepared_at": datetime.utcnow().isoformat(),
        "source": DATA_PATH,
        "total_rows": len(df),
        "features": FEATURES,
        "class_distribution": {
            "fraud": fraud_count,
            "safe": safe_count,
            "fraud_ratio": round(fraud_ratio, 4),
            "imbalance_ratio": f"1:{safe_count//fraud_count}"
        },
        "splits": {
            "train": {"rows": len(X_train), "fraud": int(y_train.sum())},
            "val":   {"rows": len(X_val),   "fraud": int(y_val.sum())},
            "test":  {"rows": len(X_test),  "fraud": int(y_test.sum())},
        }
    }
    with open(f"{OUT_DIR}/dataset_summary.json", "w") as f:
        json.dump(summary, f, indent=2)
    print(f"\n✅ Saved to {OUT_DIR}/")

if __name__ == "__main__":
    main()