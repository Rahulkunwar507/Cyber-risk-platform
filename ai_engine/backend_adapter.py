from .main import run_ai_engine

def analyze_for_backend(payload):
    """
    Expected payload:
    {
      "asset": "Customer Database",
      "risk_score": 87,
      "financial_exposure": 5000000,
      "features": {
        "cvss": 9.8,
        "asset_criticality": 10,
        "internet_exposed": 1,
        "exploit_available": 1,
        "data_sensitivity": 10,
        "security_control_strength": 3,
        "patch_age_days": 60
      }
    }
    """
    return run_ai_engine(
        payload["features"],
        asset_name=payload.get("asset", "Unknown Asset"),
        risk_score=payload.get("risk_score"),
        financial_exposure=payload.get("financial_exposure")
    )
