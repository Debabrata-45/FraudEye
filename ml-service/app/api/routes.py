from __future__ import annotations
import logging

from fastapi import APIRouter, HTTPException

from app.schemas.infer import InferRequest, InferResponse
from app.ml.predict import predict

logger = logging.getLogger("routes")

router = APIRouter()


@router.get("/health")
def health():
    return {"ok": True, "service": "ml-service"}


@router.post("/infer", response_model=InferResponse)
def infer(req: InferRequest):
    try:
        return predict(req)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.exception("Unhandled error in /infer")
        raise HTTPException(status_code=500, detail="Inference failed")