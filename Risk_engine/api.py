"""
FastAPI wrapper for the existing Risk Quantification Engine.

This file only handles HTTP input/output. All scoring still happens in
risk_engine.calculate_risk() so weights, thresholds, and probability
logic stay unchanged.
"""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from starlette.exceptions import HTTPException as StarletteHTTPException

from models import RiskInput
from risk_engine import calculate_risk

app = FastAPI(
    title="Risk Quantification Engine API",
    description=(
        "SIH 2026 prototype. POST JSON inputs to /calculate-risk. "
        "Interactive docs are at /docs."
    ),
    version="1.0.0",
)

# Allow a local React frontend to call this API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RiskRequest(BaseModel):
    """JSON body for POST /calculate-risk. Ranges match models.RiskInput.validate()."""

    cvss: float = Field(..., ge=0, le=10, description="CVSS score from 0 to 10")
    asset_criticality: float = Field(..., ge=0, le=10, description="Asset criticality from 0 to 10")
    exposure: float = Field(..., ge=0, le=1, description="Exposure from 0 to 1")
    exploitability: float = Field(..., ge=0, le=1, description="Exploitability from 0 to 1")
    data_sensitivity: float = Field(..., ge=0, le=10, description="Data sensitivity from 0 to 10")
    business_impact: float = Field(..., ge=0, le=10, description="Business impact from 0 to 10")
    potential_loss: float = Field(..., ge=0, description="Potential loss in currency units (must be >= 0)")


class RiskBreakdown(BaseModel):
    cvss: float
    asset_criticality: float
    exposure: float
    exploitability: float
    data_sensitivity: float
    business_impact: float


class RiskResponse(BaseModel):
    risk_score: float
    risk_level: str
    priority: str
    risk_breakdown: RiskBreakdown
    probability: float
    potential_loss: float
    expected_loss: float


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """Engine validate() errors become HTTP 422, not 500."""
    return JSONResponse(status_code=422, content={"detail": str(exc)})


@app.exception_handler(Exception)
async def unhandled_error_handler(request: Request, exc: Exception):
    """Return a generic 500 instead of leaking Python stack traces."""
    if isinstance(exc, (RequestValidationError, StarletteHTTPException)):
        raise exc
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/calculate-risk", response_model=RiskResponse)
def calculate_risk_endpoint(payload: RiskRequest):
    """
    Validate JSON, convert it to RiskInput, then call the existing engine.

    Invalid numbers (for example cvss > 10) are rejected by Pydantic with HTTP 422.
    """
    risk_input = RiskInput(
        cvss=payload.cvss,
        asset_criticality=payload.asset_criticality,
        exposure=payload.exposure,
        exploitability=payload.exploitability,
        data_sensitivity=payload.data_sensitivity,
        business_impact=payload.business_impact,
        potential_loss=payload.potential_loss,
    )
    return calculate_risk(risk_input)
