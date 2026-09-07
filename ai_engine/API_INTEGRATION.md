# API Integration Guide

## Start the AI service

From this `ai_engine` folder:

```bash
pip install -r requirements.txt
python generate_data.py
python train.py
uvicorn api:app --host 0.0.0.0 --port 8001
```

## Test in browser

Open:

`http://127.0.0.1:8001/docs`

Use `POST /ai/analyze`.

## Request

```json
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
```

## Response

```json
{
  "asset": "Customer Database",
  "risk_score": 87,
  "financial_exposure": 5000000,
  "incident_probability": 0.82,
  "feature_importance": {},
  "recommendations": [],
  "explanation": "..."
}
```

## Team integration

Backend calls:

`POST http://<AI-SERVER-IP>:8001/ai/analyze`

Do not change the JSON field names without informing the team.

For same-machine integration, use:

`http://127.0.0.1:8001/ai/analyze`

For LAN testing, start with:

```bash
uvicorn api:app --host 0.0.0.0 --port 8001
```

and use the AI machine's local IP.

## Architecture

Backend → `/ai/analyze` → Random Forest → Recommendations → JSON → Backend → Frontend/Optimizer
