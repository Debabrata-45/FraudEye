from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from math import radians, sin, cos, asin, sqrt
from typing import Optional, Dict, Any, List

from app.schemas.infer import TransactionIn, BehaviorContext


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Great-circle distance between points in km
    R = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * R * asin(sqrt(a))


def safe_zscore(x: float, mean: Optional[float], std: Optional[float]) -> float:
    if mean is None or std is None or std == 0:
        return 0.0
    return (x - mean) / std


@dataclass
class BehavioralFeatures:
    txn_velocity_5m: int
    txn_velocity_1h: int
    unusual_hour: int
    geo_anomaly_km: float
    geo_impossible: int
    new_device: int
    device_inconsistency: int
    merchant_risk_level: int
    spending_deviation_from_user_avg: float

    def to_dict(self) -> Dict[str, Any]:
        return {
            "txn_velocity_5m": self.txn_velocity_5m,
            "txn_velocity_1h": self.txn_velocity_1h,
            "unusual_hour": self.unusual_hour,
            "geo_anomaly_km": self.geo_anomaly_km,
            "geo_impossible": self.geo_impossible,
            "new_device": self.new_device,
            "device_inconsistency": self.device_inconsistency,
            "merchant_risk_level": self.merchant_risk_level,
            "spending_deviation_from_user_avg": self.spending_deviation_from_user_avg,
        }


def compute_unusual_hour(ts: datetime) -> int:
    # simple rule: 00:00–05:00 unusual
    h = ts.hour
    return 1 if (h >= 0 and h <= 5) else 0


def compute_geo_features(
    txn: TransactionIn,
    ctx: Optional[BehaviorContext],
) -> tuple[float, int]:
    """
    geo_anomaly_km:
      distance between current txn and previous txn if available, else 0
    geo_impossible:
      1 if speed required > 900 km/h (flight-ish) within time gap, else 0
    """
    if not txn.location or not ctx or not ctx.prev_txn:
        return 0.0, 0

    prev = ctx.prev_txn
    if prev.lat is None or prev.lon is None or prev.timestamp is None:
        return 0.0, 0

    curr_lat, curr_lon = txn.location.lat, txn.location.lon
    dist_km = haversine_km(prev.lat, prev.lon, curr_lat, curr_lon)

    dt_seconds = (txn.timestamp - prev.timestamp).total_seconds()
    if dt_seconds <= 0:
        return float(dist_km), 0

    hours = dt_seconds / 3600.0
    speed_kmh = dist_km / hours if hours > 0 else 0.0

    geo_impossible = 1 if speed_kmh > 900 else 0
    return float(dist_km), geo_impossible


def compute_device_features(
    txn: TransactionIn,
    ctx: Optional[BehaviorContext],
) -> tuple[int, int]:
    """
    new_device:
      1 if deviceId exists and not in known_device_ids
    device_inconsistency:
      1 if previous txn has a deviceId and current differs (basic flag)
    """
    device_id = txn.deviceId
    if not device_id:
        return 0, 0

    known: List[str] = (ctx.known_device_ids if (ctx and ctx.known_device_ids) else [])
    new_device = 1 if (known and device_id not in known) else 0

    device_inconsistency = 0
    if ctx and ctx.prev_txn and ctx.prev_txn.deviceId and ctx.prev_txn.deviceId != device_id:
        device_inconsistency = 1

    return new_device, device_inconsistency


def compute_spending_deviation(
    amount: float,
    ctx: Optional[BehaviorContext],
) -> float:
    if not ctx or not ctx.user_stats:
        return 0.0
    return float(safe_zscore(amount, ctx.user_stats.avg_spend_30d, ctx.user_stats.std_spend_30d))


def compute_behavioral_features(txn: TransactionIn, ctx: Optional[BehaviorContext]) -> BehavioralFeatures:
    v5 = int(ctx.txn_count_5m) if (ctx and ctx.txn_count_5m is not None) else 0
    v1h = int(ctx.txn_count_1h) if (ctx and ctx.txn_count_1h is not None) else 0

    unusual_hour = compute_unusual_hour(txn.timestamp)
    geo_km, geo_impossible = compute_geo_features(txn, ctx)
    new_device, device_inconsistency = compute_device_features(txn, ctx)

    merchant_risk = int(ctx.merchant_risk_level) if (ctx and ctx.merchant_risk_level is not None) else 1
    spending_dev = compute_spending_deviation(txn.amount, ctx)

    return BehavioralFeatures(
        txn_velocity_5m=v5,
        txn_velocity_1h=v1h,
        unusual_hour=unusual_hour,
        geo_anomaly_km=geo_km,
        geo_impossible=geo_impossible,
        new_device=new_device,
        device_inconsistency=device_inconsistency,
        merchant_risk_level=merchant_risk,
        spending_deviation_from_user_avg=spending_dev,
    )