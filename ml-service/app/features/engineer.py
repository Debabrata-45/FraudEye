import numpy as np
import pandas as pd
from .schema import FEATURES


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1)*np.cos(lat2)*np.sin(dlon/2)**2
    return 2 * R * np.arcsin(np.sqrt(a))


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce", utc=True)
    df = df.dropna(subset=["timestamp"])
    df = df.sort_values(["user_id", "timestamp"])

    local_hour = df["timestamp"].dt.hour
    df["unusual_hour"] = ((local_hour >= 0) & (local_hour <= 5)).astype(int)

    if "user_avg_spend_30d" in df.columns and "user_std_spend_30d" in df.columns:
        std = df["user_std_spend_30d"].replace(0, np.nan)
        df["spending_deviation_from_user_avg"] = (
            (df["amount"] - df["user_avg_spend_30d"]) / std
        ).fillna(0.0)
    else:
        df["spending_deviation_from_user_avg"] = 0.0

    df = df.set_index("timestamp")
    df["txn_velocity_5m"] = (
        df.groupby("user_id")["amount"]
        .rolling("5min").count()
        .reset_index(level=0, drop=True).astype(int)
    )
    df["txn_velocity_1h"] = (
        df.groupby("user_id")["amount"]
        .rolling("60min").count()
        .reset_index(level=0, drop=True).astype(int)
    )
    df = df.reset_index()

    df["prev_timestamp"] = df.groupby("user_id")["timestamp"].shift(1)
    df["prev_latitude"] = df.groupby("user_id")["latitude"].shift(1)
    df["prev_longitude"] = df.groupby("user_id")["longitude"].shift(1)
    df["prev_device_id"] = df.groupby("user_id")["device_id"].shift(1)

    mask_geo = df["prev_latitude"].notna() & df["prev_longitude"].notna()
    df["geo_anomaly_km"] = 0.0
    df.loc[mask_geo, "geo_anomaly_km"] = haversine_km(
        df.loc[mask_geo, "prev_latitude"].astype(float),
        df.loc[mask_geo, "prev_longitude"].astype(float),
        df.loc[mask_geo, "latitude"].astype(float),
        df.loc[mask_geo, "longitude"].astype(float),
    )

    df["geo_impossible"] = 0
    mask_time = df["prev_timestamp"].notna()
    dt_hours = (
        df.loc[mask_time, "timestamp"] - df.loc[mask_time, "prev_timestamp"]
    ).dt.total_seconds() / 3600.0
    dt_hours = dt_hours.replace(0, np.nan)
    speed = df.loc[mask_time, "geo_anomaly_km"] / dt_hours
    df.loc[mask_time, "geo_impossible"] = (speed > 900).fillna(False).astype(int)

    df["device_inconsistency"] = (
        (df["prev_device_id"].notna()) &
        (df["device_id"].notna()) &
        (df["device_id"] != df["prev_device_id"])
    ).astype(int)

    df["new_device"] = 0
    seen = set()
    nd = []
    for u, d in zip(df["user_id"].astype(str), df["device_id"].astype(str)):
        key = (u, d)
        nd.append(0 if key in seen else 1)
        seen.add(key)
    df["new_device"] = nd

    if "merchant_risk_level" not in df.columns:
        df["merchant_risk_level"] = 1

    for c in FEATURES:
        if c not in df.columns:
            df[c] = 0

    df[FEATURES] = df[FEATURES].replace([np.inf, -np.inf], 0).fillna(0)
    return df