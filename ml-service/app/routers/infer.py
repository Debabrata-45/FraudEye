import logging
from fastapi import APIRouter, HTTPException
from app.schemas.infer import InferRequest, InferResponse
from app.services.prediction_service import predict
from app.services.model_loader import ModelNotLoadedError

router = APIRouter(tags=["infer"])

logger = logging.getLogger("infer_router")


@router.post("/infer", response_model=InferResponse)
def infer(req: InferRequest):
    try:
        return predict(req)
    except ModelNotLoadedError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.exception("Unhandled error in /infer")
        raise HTTPException(status_code=500, detail="Inference failed")