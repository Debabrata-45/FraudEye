from fastapi import FastAPI
from app.core.logging import setup_logging
from app.api.routes import router
from app.models.artifacts import artifact_store

setup_logging()

app = FastAPI(title="FraudEye ML Service", version="1.0.0")


@app.on_event("startup")
def on_startup():
    artifact_store.load()


app.include_router(router)