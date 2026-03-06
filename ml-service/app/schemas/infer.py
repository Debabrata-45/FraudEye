from __future__ import annotations
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


# ── Request ──────────────────────────────────────────────────────────────────

class GeoLocation(BaseModel):
    lat: float
    lon: float


class TransactionInput(BaseModel):
    transactionId: str
    userId: str
    merchantId: str
    amount: float
    currency: str = "INR"
    timestamp: str
    channel: str = "CARD"
    deviceId: str
    location: GeoLocation
    metadata: Dict[str, Any] = {}


class PrevTxn(BaseModel):
    timestamp: str
    lat: float
    lon: float
    deviceId: str
    merchantId: str


class UserStats(BaseModel):
    avg_spend_30d: float = 0.0
    std_spend_30d: float = 0.0


class ContextInput(BaseModel):
    txn_count_5m: int = 0
    txn_count_1h: int = 0
    merchant_risk_level: int = 1
    known_device_ids: List[str] = []
    user_stats: UserStats = UserStats()
    prev_txn: Optional[PrevTxn] = None


class InferRequest(BaseModel):
    transaction: TransactionInput
    context: ContextInput


# ── Response ─────────────────────────────────────────────────────────────────

class TopFactor(BaseModel):
    feature: str
    impact: float
    direction: str   # "increases_risk" | "decreases_risk"
    value: Any


class SHAPEntry(BaseModel):
    feature: str
    shapValue: float
    featureValue: Any


class SHAPBlock(BaseModel):
    baseValue: float
    values: List[SHAPEntry]


class LIMERule(BaseModel):
    feature: str
    weight: float


class LIMEBlock(BaseModel):
    rules: List[LIMERule]


class InferResponse(BaseModel):
    transactionId: str
    fraudProbability: float
    riskScore: int
    riskLabel: str
    topFactors: List[TopFactor]
    shap: SHAPBlock
    lime: LIMEBlock
    modelVersion: str
    warning: Optional[str] = None