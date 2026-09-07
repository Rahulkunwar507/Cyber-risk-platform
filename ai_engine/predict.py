import joblib
from pathlib import Path

FEATURES = [
    "cvss",
    "asset_criticality",
    "internet_exposed",
    "exploit_available",
    "data_sensitivity",
    "security_control_strength",
    "patch_age_days",
]

MODEL_PATH = Path(__file__).resolve().parent / "models" / "risk_model.pkl"

def predict_risk(data):
    model = joblib.load(MODEL_PATH)
    X = [[data[f] for f in FEATURES]]
    probability = float(model.predict_proba(X)[0][1])

    importance = dict(zip(FEATURES, model.feature_importances_))
    importance = {
        k: round(float(v), 4)
        for k, v in sorted(importance.items(), key=lambda x: x[1], reverse=True)
    }

    return {
        "incident_probability": round(probability, 3),
        "feature_importance": importance
    }

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
    print(predict_risk(demo))
