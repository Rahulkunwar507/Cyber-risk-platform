# Risk Quantification Engine API (SIH 2026)

Python prototype that scores cybersecurity risk and expected loss. The original engine (`risk_engine.py` + `models.py`) is unchanged. FastAPI in `api.py` exposes it as a REST API for a React frontend.

## How it works

```
Frontend
   |
   | POST /calculate-risk
   v
FastAPI (api.py)
   |
   v
RiskInput / validation
   |
   v
calculate_risk()
   |
   v
Risk Result JSON
```

## Requirements

- Python 3.10 or newer
- Windows PowerShell (commands below)

## Setup (Windows PowerShell)

Open PowerShell, then run these commands one block at a time.

### 1. Go to the project folder

```powershell
cd C:\Users\shaur\Risk_engine
```

### 2. Create a virtual environment

```powershell
python -m venv .venv
```

### 3. Activate the virtual environment

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks the script, run this once, then activate again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### 4. Install dependencies

```powershell
pip install -r requirements.txt
```

## Start the API

From `C:\Users\shaur\Risk_engine` with the venv activated:

```powershell
uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

Leave this window open. The API runs at `http://127.0.0.1:8000`.

## Test GET /health

In a **new** PowerShell window:

```powershell
curl.exe http://127.0.0.1:8000/health
```

Expected response:

```json
{"status":"ok"}
```

## Test POST /calculate-risk

PowerShell (recommended on Windows — quoting is simpler than `curl`):

```powershell
$body = '{"cvss": 9.8, "asset_criticality": 10, "exposure": 1, "exploitability": 1, "data_sensitivity": 10, "business_impact": 10, "potential_loss": 4000000}'
Invoke-RestMethod -Uri http://127.0.0.1:8000/calculate-risk -Method POST -ContentType "application/json" -Body $body
```

`curl.exe` (use `--data-raw` so PowerShell does not break the JSON):

```powershell
curl.exe -X POST http://127.0.0.1:8000/calculate-risk -H "Content-Type: application/json" --data-raw "{\"cvss\": 9.8, \"asset_criticality\": 10, \"exposure\": 1, \"exploitability\": 1, \"data_sensitivity\": 10, \"business_impact\": 10, \"potential_loss\": 4000000}"
```

Expected response:

```json
{
  "risk_score": 99.4,
  "risk_level": "Critical",
  "priority": "Immediate",
  "risk_breakdown": {
    "cvss": 29.4,
    "asset_criticality": 20.0,
    "exposure": 15.0,
    "exploitability": 15.0,
    "data_sensitivity": 10.0,
    "business_impact": 10.0
  },
  "probability": 0.95,
  "potential_loss": 4000000,
  "expected_loss": 3800000.0
}
```

## Swagger documentation

With the server running, open this URL in a browser:

http://127.0.0.1:8000/docs

You can try `/health` and `/calculate-risk` from that page.

## Run tests

With the venv activated, from the project folder:

```powershell
python -m unittest test_risk_engine.py test_api.py
```

## Input ranges

| Field | Allowed range |
| --- | --- |
| `cvss` | 0 to 10 |
| `asset_criticality` | 0 to 10 |
| `exposure` | 0 to 1 |
| `exploitability` | 0 to 1 |
| `data_sensitivity` | 0 to 10 |
| `business_impact` | 0 to 10 |
| `potential_loss` | 0 or greater |

Invalid values return HTTP **422**.

## Project files

| File | Role |
| --- | --- |
| `models.py` | `RiskInput` dataclass and range checks |
| `risk_engine.py` | Risk score, level, probability, expected loss |
| `api.py` | FastAPI app: `/health` and `/calculate-risk` |
| `test_risk_engine.py` | Engine unit tests |
| `test_api.py` | API tests |
| `requirements.txt` | Python packages |

## CORS

CORS is enabled for all origins so a local React app can call the API during development.
