from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

from predict import predict_risk
from recommender import generate_recommendations

app = FastAPI(
    title="SIH 2026 Cyber Risk AI Engine",
    version="1.0.0"
)


class RiskFeatures(BaseModel):
    cvss: float
    asset_criticality: int
    internet_exposed: int
    exploit_available: int
    data_sensitivity: int
    security_control_strength: int
    patch_age_days: int


class AIRequest(BaseModel):
    asset: str
    risk_score: Optional[float] = None
    financial_exposure: Optional[float] = None
    features: RiskFeatures


@app.get("/")
def home():
    return {
        "service": "Cyber Risk AI Engine",
        "status": "running",
        "endpoint": "POST /ai/analyze"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/ai/analyze")
def analyze(request: AIRequest):
    data = request.features.model_dump()

    prediction = predict_risk(data)
    recommendations = generate_recommendations(data)

    return {
        "asset": request.asset,
        "risk_score": request.risk_score,
        "financial_exposure": request.financial_exposure,
        "incident_probability": prediction["incident_probability"],
        "feature_importance": prediction["feature_importance"],
        "recommendations": recommendations,
        "explanation": (
            "Risk is primarily influenced by the strongest modeled "
            "cybersecurity factors."
        )
    }
