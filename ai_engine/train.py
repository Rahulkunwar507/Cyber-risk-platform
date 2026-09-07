import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score

DATA = Path("data/cyber_risk_data.csv")
MODEL = Path("models/risk_model.pkl")

FEATURES = [
    "cvss",
    "asset_criticality",
    "internet_exposed",
    "exploit_available",
    "data_sensitivity",
    "security_control_strength",
    "patch_age_days",
]

df = pd.read_csv(DATA)
X = df[FEATURES]
y = df["incident"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y_train)

pred = model.predict(X_test)
prob = model.predict_proba(X_test)[:, 1]

print("Accuracy:", round(accuracy_score(y_test, pred), 4))
print("ROC-AUC:", round(roc_auc_score(y_test, prob), 4))
print(classification_report(y_test, pred))

print("\nFeature importance:")
for feature, value in sorted(
    zip(FEATURES, model.feature_importances_),
    key=lambda x: x[1],
    reverse=True
):
    print(f"{feature:30s} {value:.4f}")

MODEL.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(model, MODEL)
print(f"\nSaved model to {MODEL}")
