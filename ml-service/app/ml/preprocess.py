from __future__ import annotations
import math
from datetime import datetime, timezone
from typing import Dict, Any

from app.schemas.infer import InferRequest


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def parse_utc(ts: str) -> datetime:
    dt = datetime.fromisoformat(ts)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def compute_features(req: InferRequest) -> Dict[str, Any]:
    txn = req.transaction
    ctx = req.context

    # 1) velocity
    txn_velocity_5m = int(ctx.txn_count_5m)
    txn_velocity_1h = int(ctx.txn_count_1h)

    # 2) unusual hour (00:00 - 05:00 local, using UTC as proxy)
    try:
        dt = parse_utc(txn.timestamp)
        unusual_hour = 1 if 0 <= dt.hour <= 5 else 0
    except Exception:
        unusual_hour = 0

    # 3) geo features
    geo_anomaly_km = 0.0
    geo_impossible = 0

    if ctx.prev_txn is not None:
        try:
            dist = haversine_km(
                ctx.prev_txn.lat, ctx.prev_txn.lon,
                txn.location.lat, txn.location.lon,
            )
            geo_anomaly_km = round(dist, 4)

            prev_dt = parse_utc(ctx.prev_txn.timestamp)
            curr_dt = parse_utc(txn.timestamp)
            dt_hours = (curr_dt - prev_dt).total_seconds() / 3600.0

            if dt_hours > 0:
                speed_kmh = dist / dt_hours
                geo_impossible = 1 if speed_kmh > 900 else 0
            else:
                geo_impossible = 1 if dist > 0 else 0

        except Exception:
            geo_anomaly_km = 0.0
            geo_impossible = 0

    # 4) device features
    known = [d.strip() for d in ctx.known_device_ids]
    new_device = 0 if txn.deviceId in known else 1

    device_inconsistency = 0
    if ctx.prev_txn is not None:
        device_inconsistency = 1 if txn.deviceId != ctx.prev_txn.deviceId else 0

    # 5) merchant risk
    merchant_risk_level = int(ctx.merchant_risk_level)

    # 6) spending deviation
    avg = ctx.user_stats.avg_spend_30d
    std = ctx.user_stats.std_spend_30d
    if std > 0:
        spending_deviation_from_user_avg = round((txn.amount - avg) / std, 6)
    else:
        spending_deviation_from_user_avg = 0.0

    return {
        "amount": float(txn.amount),
        "txn_velocity_5m": txn_velocity_5m,
        "txn_velocity_1h": txn_velocity_1h,
        "unusual_hour": unusual_hour,
        "geo_anomaly_km": geo_anomaly_km,
        "geo_impossible": geo_impossible,
        "new_device": new_device,
        "device_inconsistency": device_inconsistency,
        "merchant_risk_level": merchant_risk_level,
        "spending_deviation_from_user_avg": spending_deviation_from_user_avg,
    }