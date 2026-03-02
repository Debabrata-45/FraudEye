from fastapi import FastAPI
from app.core.logging import setup_logging
from app.routers.health import router as health_router
from app.routers.infer import router as infer_router
from app.services.model_loader import model_registry

setup_logging()

app = FastAPI(title="FraudEye ML Service", version="1.0.0")

@app.on_event("startup")
def on_startup():
    # load model at startup (graceful if missing)
    model_registry.load()

app.include_router(health_router)
app.include_router(infer_router)