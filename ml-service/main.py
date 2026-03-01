from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="FraudEye ML Service")

class InferRequest(BaseModel):
    transaction: dict

@app.get("/health")
def health():
    return {"ok": True, "service": "ml-service"}

@app.post("/infer")
def infer(req: InferRequest):
    # Phase 0 placeholder: return dummy prediction
    return {
        "risk_score": 42,
        "risk_label": "Medium",
        "model": "XGBoost (placeholder)",
        "explanations": {
            "shap": [],
            "lime": []
        }
    }