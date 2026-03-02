from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class TxnLocation(BaseModel):
    lat: float
    lon: float


class TransactionIn(BaseModel):
    transactionId: str = Field(..., min_length=3, max_length=128)
    userId: str = Field(..., min_length=1, max_length=128)
    merchantId: str = Field(..., min_length=1, max_length=128)

    amount: float = Field(..., gt=0)
    currency: str = Field(default="INR", min_length=3, max_length=3)

    timestamp: datetime

    channel: str = Field(default="CARD")  # CARD/UPI/NETBANKING/etc (backend decides)
    deviceId: Optional[str] = Field(default=None, max_length=128)
    location: Optional[TxnLocation] = None

    # any extra raw fields you might pass (safe forward-compat)
    metadata: Optional[Dict[str, Any]] = None


class UserStatsContext(BaseModel):
    # computed by backend/DB/worker OR can be blank if not available
    avg_spend_30d: Optional[float] = None
    std_spend_30d: Optional[float] = None
    home_lat: Optional[float] = None
    home_lon: Optional[float] = None


class PrevTxnContext(BaseModel):
    timestamp: Optional[datetime] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    deviceId: Optional[str] = None
    merchantId: Optional[str] = None


class BehaviorContext(BaseModel):
    # velocity counts should ideally come from DB in worker
    txn_count_5m: Optional[int] = 0
    txn_count_1h: Optional[int] = 0

    prev_txn: Optional[PrevTxnContext] = None

    # dynamic merchant risk from DB/analytics
    merchant_risk_level: Optional[int] = Field(default=1, ge=1, le=5)  # 1..5

    # known devices list can be sent if available
    known_device_ids: Optional[List[str]] = None

    user_stats: Optional[UserStatsContext] = None


class InferRequest(BaseModel):
    transaction: TransactionIn
    context: Optional[BehaviorContext] = None


class XAIBlock(BaseModel):
    # Phase 5 will populate these. Keep stable now.
    topFactors: Optional[List[Dict[str, Any]]] = None
    shap: Optional[Dict[str, Any]] = None
    lime: Optional[Dict[str, Any]] = None


class InferResponse(BaseModel):
    ok: bool = True
    transactionId: str
    userId: str
    merchantId: str

    modelVersion: str

    fraudProbability: float = Field(..., ge=0.0, le=1.0)
    riskScore: int = Field(..., ge=0, le=100)
    riskLabel: str = Field(..., pattern="^(LOW|MEDIUM|HIGH)$")

    features: Dict[str, Any]  # debug/traceable behavioral features

    xai: XAIBlock = XAIBlock()