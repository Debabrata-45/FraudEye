import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report
import xgboost as xgb

# IMPORTANT: Must match inference feature order exactly
FEATURES = [
    "amount",
    "txn_velocity_5m",
    "txn_velocity_1h",
    "unusual_hour",
    "geo_anomaly_km",
    "geo_impossible",
    "new_device",
    "device_inconsistency",
    "merchant_risk_level",
    "spending_deviation_from_user_avg",
]

def haversine_km(lat1, lon1, lat2, lon2):
    # vectorized haversine
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1)*np.cos(lat2)*np.sin(dlon/2)**2
    return 2 * R * np.arcsin(np.sqrt(a))

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    # Ensure types
    df = df.copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce", utc=True)
    df = df.dropna(subset=["timestamp"])

    # Sort for behavioral features
    df = df.sort_values(["user_id", "timestamp"])

    # unusual_hour (00:00–05:00)
    local_hour = df["timestamp"].dt.hour
    df["unusual_hour"] = ((local_hour >= 0) & (local_hour <= 5)).astype(int)

    # Spending deviation: use provided stats if present
    # If std is 0/missing -> 0
    if "user_avg_spend_30d" in df.columns and "user_std_spend_30d" in df.columns:
        std = df["user_std_spend_30d"].replace(0, np.nan)
        df["spending_deviation_from_user_avg"] = ((df["amount"] - df["user_avg_spend_30d"]) / std).fillna(0.0)
    else:
        df["spending_deviation_from_user_avg"] = 0.0

    # Velocity features: rolling counts per user in time windows
    # We count previous txns including current row in window; fine for training
    df = df.set_index("timestamp")
    df["txn_velocity_5m"] = (
        df.groupby("user_id")["amount"]
          .rolling("5min")
          .count()
          .reset_index(level=0, drop=True)
          .astype(int)
    )
    df["txn_velocity_1h"] = (
        df.groupby("user_id")["amount"]
          .rolling("60min")
          .count()
          .reset_index(level=0, drop=True)
          .astype(int)
    )
    df = df.reset_index()

    # Prev txn info per user
    df["prev_timestamp"] = df.groupby("user_id")["timestamp"].shift(1)
    df["prev_latitude"] = df.groupby("user_id")["latitude"].shift(1)
    df["prev_longitude"] = df.groupby("user_id")["longitude"].shift(1)
    df["prev_device_id"] = df.groupby("user_id")["device_id"].shift(1)

    # geo_anomaly_km: distance from previous txn (0 if missing)
    mask_geo = df["prev_latitude"].notna() & df["prev_longitude"].notna()
    df["geo_anomaly_km"] = 0.0
    df.loc[mask_geo, "geo_anomaly_km"] = haversine_km(
        df.loc[mask_geo, "prev_latitude"].astype(float),
        df.loc[mask_geo, "prev_longitude"].astype(float),
        df.loc[mask_geo, "latitude"].astype(float),
        df.loc[mask_geo, "longitude"].astype(float),
    )

    # geo_impossible: speed > 900 km/h
    df["geo_impossible"] = 0
    mask_time = df["prev_timestamp"].notna()
    dt_hours = (df.loc[mask_time, "timestamp"] - df.loc[mask_time, "prev_timestamp"]).dt.total_seconds() / 3600.0
    # avoid divide by zero
    dt_hours = dt_hours.replace(0, np.nan)
    speed = df.loc[mask_time, "geo_anomaly_km"] / dt_hours
    df.loc[mask_time, "geo_impossible"] = (speed > 900).fillna(False).astype(int)

    # device flags
    df["device_inconsistency"] = (
        (df["prev_device_id"].notna()) &
        (df["device_id"].notna()) &
        (df["device_id"] != df["prev_device_id"])
    ).astype(int)

    # new_device: first time user uses this device
    # We mark as 1 if this (user_id, device_id) pair has not appeared earlier
    df["new_device"] = 0
    seen = set()
    nd = []
    for u, d in zip(df["user_id"].astype(str), df["device_id"].astype(str)):
        key = (u, d)
        if key in seen:
            nd.append(0)
        else:
            # first time this user-device seen
            nd.append(1)
            seen.add(key)
    df["new_device"] = nd

    # merchant risk
    if "merchant_risk_level" not in df.columns:
        df["merchant_risk_level"] = 1

    # Final cleanup
    for c in FEATURES:
        if c not in df.columns:
            df[c] = 0

    # Replace inf/nan
    df[FEATURES] = df[FEATURES].replace([np.inf, -np.inf], 0).fillna(0)

    return df

def main():
    # Update this path to your dataset file
    data_path = os.getenv("DATASET_PATH", "fraudeye_synthetic_transactions.csv")
    out_model_path = os.getenv("OUT_MODEL_PATH", os.path.join("models", "xgb_v1.json"))

    df = pd.read_csv(data_path)

    # Expect fraud_label column
    if "fraud_label" not in df.columns:
        raise ValueError("fraud_label column not found in dataset")

    df_feat = build_features(df)

    X = df_feat[FEATURES].astype(np.float32).values
    y = df_feat["fraud_label"].astype(int).values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    dtrain = xgb.DMatrix(X_train, label=y_train, feature_names=FEATURES)
    dtest = xgb.DMatrix(X_test, label=y_test, feature_names=FEATURES)

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
        # helps imbalance
        "scale_pos_weight": max(1.0, (y_train == 0).sum() / max(1, (y_train == 1).sum())),
        "tree_method": "hist",
        "seed": 42,
    }

    evals = [(dtrain, "train"), (dtest, "test")]
    booster = xgb.train(params, dtrain, num_boost_round=300, evals=evals, early_stopping_rounds=30)

    # Evaluate
    probs = booster.predict(dtest)
    auc = roc_auc_score(y_test, probs)
    print("\nAUC:", round(float(auc), 4))

    preds = (probs >= 0.5).astype(int)
    print("\nClassification report (threshold=0.5):")
    print(classification_report(y_test, preds, digits=4))

    # Save model
    os.makedirs(os.path.dirname(out_model_path), exist_ok=True)
    booster.save_model(out_model_path)
    print(f"\nSaved model to: {out_model_path}")

if __name__ == "__main__":
    main()