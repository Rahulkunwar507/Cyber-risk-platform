import json
from .predict import predict_risk
from .recommender import generate_recommendations

def run_ai_engine(data, asset_name="Demo Asset", risk_score=None, financial_exposure=None):
    prediction = predict_risk(data)
    recommendations = generate_recommendations(data)

    result = {
        "asset": asset_name,
        "risk_score": risk_score,
        "incident_probability": prediction["incident_probability"],
        "feature_importance": prediction["feature_importance"],
        "recommendations": recommendations,
        "financial_exposure": financial_exposure,
        "explanation": (
            "Risk is primarily influenced by the strongest modeled factors: "
            + ", ".join(list(prediction["feature_importance"].keys())[:3])
            + "."
        )
    }
    return result

if __name__ == "__main__":
    demo = {
        "cvss": 9.8,
        "asset_criticality": 10,
        "internet_exposed": 1,
        "exploit_available": 1,
        "data_sensitivity": 10,
        "security_control_strength": 3,
        "patch_age_days": 60
    }

    print(json.dumps(
        run_ai_engine(
            demo,
            asset_name="Customer Database",
            risk_score=87,
            financial_exposure=5000000
        ),
        indent=2
    ))
