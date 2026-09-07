from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from Risk_engine.models import RiskInput
from Risk_engine.risk_engine import calculate_risk
from ai_engine.main import run_ai_engine
from optimizer.optimizer import InvestmentOptimizer, create_sample_dataset


app = FastAPI(
    title="Cyber Risk Platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Cyber Risk Platform API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


# -------------------------
# Dashboard
# -------------------------

@app.get("/api/dashboard")
def dashboard():
    return {
        "overallRiskScore": 78,
        "overallRiskStatus": "HIGH",
        "criticalVulnerabilities": 8,
        "highVulnerabilities": 17,
        "estimatedFinancialExposureInr": 4250000,
        "totalVulnerabilities": 61,
        "updatedAt": "2026-09-03T08:30:00Z",
        "trend": [
            {"date": "2026-08-28", "day": 1, "label": "Day 1", "riskScore": 61},
            {"date": "2026-08-29", "day": 2, "label": "Day 2", "riskScore": 64},
            {"date": "2026-08-30", "day": 3, "label": "Day 3", "riskScore": 68},
            {"date": "2026-08-31", "day": 4, "label": "Day 4", "riskScore": 70},
            {"date": "2026-09-01", "day": 5, "label": "Day 5", "riskScore": 74},
            {"date": "2026-09-02", "day": 6, "label": "Day 6", "riskScore": 76},
            {"date": "2026-09-03", "day": 7, "label": "Day 7", "riskScore": 78}
        ],
        "topRiskyAssets": [],
        "riskFactors": [],
        "vulnerabilitySeverityBreakdown": {
            "critical": 8,
            "high": 17,
            "medium": 24,
            "low": 12
        },
        "aiRecommendation": {
            "id": "rec-1",
            "assetId": "asset-cust-db",
            "title": "Prioritize Customer Database remediation",
            "text": "Prioritize remediation of the Customer Database vulnerability because it combines high asset criticality, external exposure and a critical vulnerability.",
            "rationale": "This initiative delivers a strong risk reduction for the current portfolio."
        }
    }


# -------------------------
# Assets
# -------------------------

@app.get("/api/assets")
def get_assets():
    return [
        {
            "id": "asset-cust-db",
            "name": "Customer Database",
            "type": "Database",
            "owner": "Data Services",
            "environment": "Production",
            "criticality": 10,
            "riskScore": 92,
            "status": "Critical",
            "internetExposed": True
        },
        {
            "id": "asset-payment-api",
            "name": "Payment API",
            "type": "API",
            "owner": "Payments Team",
            "environment": "Production",
            "criticality": 10,
            "riskScore": 88,
            "status": "High",
            "internetExposed": True
        },
        {
            "id": "asset-web-portal",
            "name": "Internet Banking Portal",
            "type": "Web Application",
            "owner": "Digital Banking",
            "environment": "Production",
            "criticality": 9,
            "riskScore": 84,
            "status": "High",
            "internetExposed": True
        },
        {
            "id": "asset-core-banking",
            "name": "Core Banking System",
            "type": "Application",
            "owner": "Core Banking",
            "environment": "Production",
            "criticality": 10,
            "riskScore": 81,
            "status": "High",
            "internetExposed": False
        },
        {
            "id": "asset-email",
            "name": "Corporate Email",
            "type": "Service",
            "owner": "IT Operations",
            "environment": "Production",
            "criticality": 7,
            "riskScore": 72,
            "status": "High",
            "internetExposed": True
        }
    ]

# -------------------------
@app.get("/api/assets/{asset_id}")
def get_asset(asset_id: str):
    assets = get_assets()
    for asset in assets:
        if asset["id"] == asset_id:
            return asset
    raise HTTPException(status_code=404, detail="Asset not found")


# Vulnerabilities
# -------------------------

VULNERABILITIES = [
    {
        "id": "VULN-001",
        "cveId": "CVE-2026-1001",
        "title": "Unauthenticated SQL Injection in Customer Portal",
        "severity": "Critical",
        "cvss": 9.8,
        "assetId": "asset-cust-db",
        "assetName": "Customer Database",
        "exposure": "Internet Exposed",
        "exploitAvailable": True,
        "riskScore": 91,
        "priority": "Immediate",
        "status": "Open",
        "discoveredDate": "2026-08-24",
        "description": "An unauthenticated SQL injection flaw allows remote attackers to access customer database records.",
        "businessImpact": "Customer data exposure, regulatory penalties and severe reputational damage.",
        "recommendedAction": "Apply the security patch immediately and restrict direct database exposure.",
        "remediationSteps": [
            "Apply security patch",
            "Harden SQL queries",
            "Restrict database access",
            "Validate the fix"
        ]
    },
    {
        "id": "VULN-002",
        "cveId": "CVE-2026-0987",
        "title": "Remote Code Execution in Payment Gateway Library",
        "severity": "Critical",
        "cvss": 9.1,
        "assetId": "asset-payment-api",
        "assetName": "Payment API",
        "exposure": "Internet Exposed",
        "exploitAvailable": True,
        "riskScore": 87,
        "priority": "Immediate",
        "status": "Open",
        "discoveredDate": "2026-08-26",
        "description": "A deserialization vulnerability permits remote code execution on the payment API host.",
        "businessImpact": "Financial fraud, transaction manipulation and payment-data exposure.",
        "recommendedAction": "Patch the payment gateway library and place the API behind a WAF.",
        "remediationSteps": [
            "Deploy patched library",
            "Add WAF protection",
            "Enable payment traffic monitoring"
        ]
    },
    {
        "id": "VULN-003",
        "cveId": "CVE-2026-0543",
        "title": "Default Administrator Credentials on Web Admin Console",
        "severity": "Critical",
        "cvss": 9.4,
        "assetId": "asset-web-server",
        "assetName": "Internet Web Server",
        "exposure": "Internet Exposed",
        "exploitAvailable": True,
        "riskScore": 76,
        "priority": "Immediate",
        "status": "Open",
        "discoveredDate": "2026-08-28",
        "description": "Default administrator credentials provide unauthorized administrative access.",
        "businessImpact": "Full server takeover and potential access to the internal network.",
        "recommendedAction": "Rotate credentials, enforce MFA and restrict the admin console.",
        "remediationSteps": [
            "Rotate default credentials",
            "Restrict admin console",
            "Enforce MFA"
        ]
    },
    {
        "id": "VULN-004",
        "cveId": "CVE-2026-0873",
        "title": "Insecure Deserialization in API Gateway",
        "severity": "High",
        "cvss": 8.8,
        "assetId": "asset-payment-api",
        "assetName": "Payment API",
        "exposure": "Internet Exposed",
        "exploitAvailable": False,
        "riskScore": 84,
        "priority": "Immediate",
        "status": "In Progress",
        "discoveredDate": "2026-08-22",
        "description": "The API gateway accepts untrusted serialized objects.",
        "businessImpact": "Remote code execution could compromise transaction integrity.",
        "recommendedAction": "Disable untrusted deserialization and upgrade the API gateway.",
        "remediationSteps": [
            "Block untrusted deserialization",
            "Upgrade API gateway",
            "Add exploit detection"
        ]
    },
    {
        "id": "VULN-005",
        "cveId": "CVE-2025-7720",
        "title": "Outdated TLS Configuration on Web Server",
        "severity": "High",
        "cvss": 8.1,
        "assetId": "asset-web-server",
        "assetName": "Internet Web Server",
        "exposure": "Internet Exposed",
        "exploitAvailable": True,
        "riskScore": 72,
        "priority": "High",
        "status": "Open",
        "discoveredDate": "2026-08-19",
        "description": "The web server supports deprecated TLS versions and weak cipher suites.",
        "businessImpact": "Session hijacking and interception of customer traffic.",
        "recommendedAction": "Enforce TLS 1.3 and disable weak cipher suites.",
        "remediationSteps": [
            "Enable TLS 1.3",
            "Remove weak cipher suites",
            "Run TLS security scans"
        ]
    },
    {
        "id": "VULN-006",
        "cveId": "CVE-2025-8812",
        "title": "Unpatched Kernel on Cloud Hypervisor",
        "severity": "High",
        "cvss": 7.8,
        "assetId": "asset-cloud-server",
        "assetName": "Cloud Server",
        "exposure": "Restricted",
        "exploitAvailable": False,
        "riskScore": 68,
        "priority": "High",
        "status": "Open",
        "discoveredDate": "2026-08-17",
        "description": "The hypervisor kernel is several releases behind.",
        "businessImpact": "A guest-to-host escape could compromise hosted workloads.",
        "recommendedAction": "Patch the hypervisor kernel during a maintenance window.",
        "remediationSteps": [
            "Back up VMs",
            "Patch hypervisor",
            "Run integrity checks"
        ]
    },
    {
        "id": "VULN-007",
        "cveId": "CVE-2026-0220",
        "title": "Multi-Factor Authentication Bypass in Admin SSO",
        "severity": "Medium",
        "cvss": 6.5,
        "assetId": "asset-cloud-server",
        "assetName": "Cloud Server",
        "exposure": "Restricted",
        "exploitAvailable": False,
        "riskScore": 60,
        "priority": "Medium",
        "status": "In Progress",
        "discoveredDate": "2026-08-15",
        "description": "Legacy SSO sessions can bypass newly enforced MFA checks.",
        "businessImpact": "Stolen credentials could grant administrative cloud access.",
        "recommendedAction": "Invalidate legacy sessions and enforce step-up authentication.",
        "remediationSteps": [
            "Invalidate legacy sessions",
            "Enforce step-up authentication",
            "Rotate session keys"
        ]
    },
    {
        "id": "VULN-008",
        "cveId": "CVE-2025-9182",
        "title": "VLAN Segmentation Misconfiguration",
        "severity": "Medium",
        "cvss": 6.8,
        "assetId": "asset-internal-network",
        "assetName": "Internal Network",
        "exposure": "Internal",
        "exploitAvailable": False,
        "riskScore": 55,
        "priority": "Medium",
        "status": "Open",
        "discoveredDate": "2026-08-12",
        "description": "A switch configuration error allows traffic across VLAN boundaries.",
        "businessImpact": "Increased risk of lateral movement across network segments.",
        "recommendedAction": "Correct VLAN configuration and apply access controls.",
        "remediationSteps": [
            "Audit VLAN configuration",
            "Apply network ACLs",
            "Run segmentation tests"
        ]
    }
]


@app.get("/api/vulnerabilities")
def get_vulnerabilities():
    return VULNERABILITIES


@app.get("/api/vulnerabilities/summary")
def get_vulnerability_summary():
    total = len(VULNERABILITIES)
    critical = sum(v["severity"] == "Critical" for v in VULNERABILITIES)
    high = sum(v["severity"] == "High" for v in VULNERABILITIES)
    medium = sum(v["severity"] == "Medium" for v in VULNERABILITIES)
    remediated = sum(v["status"] == "Remediated" for v in VULNERABILITIES)

    return {
        "total": total,
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": total - critical - high - medium,
        "remediationProgress": round((remediated / total) * 100, 1) if total else 0
    }

# -------------------------
@app.get("/api/vulnerabilities/{vulnerability_id}")
def get_vulnerability(vulnerability_id: str):
    for vulnerability in VULNERABILITIES:
        if vulnerability["id"] == vulnerability_id:
            return vulnerability
    raise HTTPException(status_code=404, detail="Vulnerability not found")


# Notifications
# -------------------------

@app.get("/api/notifications")
def notifications():
    return []


# -------------------------
# Risk Engine
# -------------------------

class RiskRequest(BaseModel):
    cvss: float
    asset_criticality: float
    exposure: float
    exploitability: float
    data_sensitivity: float
    business_impact: float
    potential_loss: float


@app.post("/api/risk/calculate")
def calculate_risk_api(payload: RiskRequest):
    risk_input = RiskInput(
        cvss=payload.cvss,
        asset_criticality=payload.asset_criticality,
        exposure=payload.exposure,
        exploitability=payload.exploitability,
        data_sensitivity=payload.data_sensitivity,
        business_impact=payload.business_impact,
        potential_loss=payload.potential_loss
    )

    risk_input.validate()

    return calculate_risk(risk_input)


# -------------------------
# AI Recommendation
# -------------------------

class AIRequest(BaseModel):
    assetId: Optional[str] = None
    asset: Optional[str] = None
    risk_score: Optional[float] = None
    financial_exposure: Optional[float] = None
    features: dict = {}


@app.post("/api/ai/recommend")
def ai_recommend(payload: AIRequest):
    features = payload.features.copy()

    # Default AI model inputs when the frontend sends only an asset ID
    defaults = {
        "cvss": 9.0,
        "asset_criticality": 10,
        "internet_exposed": 1,
        "exploit_available": 1,
        "data_sensitivity": 10,
        "security_control_strength": 3,
        "patch_age_days": 60,
    }

    for key, value in defaults.items():
        features.setdefault(key, value)

    result = run_ai_engine(
        features,
        asset_name=payload.asset or payload.assetId or "Unknown Asset",
        risk_score=payload.risk_score or 92,
        financial_exposure=payload.financial_exposure
    )

    risk_score = result["risk_score"] or 92
    priority = "Critical" if risk_score >= 90 else "High" if risk_score >= 75 else "Medium" if risk_score >= 50 else "Low"

    why_risky = [
        {
            "label": "High vulnerability severity",
            "severity": "Critical",
            "icon": "bug",
            "detail": f"CVSS score of {features['cvss']} indicates a severe vulnerability."
        },
        {
            "label": "Internet exposure",
            "severity": "High",
            "icon": "globe",
            "detail": "The asset is directly exposed to the internet."
        },
        {
            "label": "Weak security controls",
            "severity": "High",
            "icon": "shield",
            "detail": "Current security control strength is below the recommended level."
        }
    ]

    action_map = {
        "Patch critical vulnerability": {"cost": 1.0, "riskReduction": 20, "icon": "wrench", "mappedOptionId": "Patch critical vulnerability"},
        "Apply emergency mitigation": {"cost": 0.5, "riskReduction": 10, "icon": "shield", "mappedOptionId": "MFA"},
        "Restrict unnecessary internet exposure": {"cost": 3.0, "riskReduction": 25, "icon": "network", "mappedOptionId": "Network segmentation"},
        "Strengthen security controls": {"cost": 2.0, "riskReduction": 18, "icon": "shield", "mappedOptionId": "EDR"},
        "Update and patch the system": {"cost": 1.0, "riskReduction": 20, "icon": "wrench", "mappedOptionId": "Patch critical vulnerability"},
        "Increase protection for sensitive data": {"cost": 2.0, "riskReduction": 12, "icon": "database", "mappedOptionId": "Backup"}
    }

    recommended_actions = []
    for item in result["recommendations"]:
        mapping = action_map.get(item["action"], {"cost": 0, "riskReduction": 0, "icon": "wrench", "mappedOptionId": None})
        recommended_actions.append({
            "title": item["action"],
            "cost": mapping["cost"],
            "riskReduction": "High" if mapping["riskReduction"] >= 20 else "Medium" if mapping["riskReduction"] >= 10 else "Low",
            "icon": mapping["icon"],
            "mappedOptionId": mapping["mappedOptionId"]
        })

    return {
        "asset": result["asset"],
        "riskScore": risk_score,
        "whyRisky": why_risky,
        "businessImpact": "A successful attack could expose sensitive customer data, disrupt critical services, and create significant financial and regulatory impact.",
        "analysis": {
            "recommendedPriority": priority,
            "recommendation": result["recommendations"][0]["action"] if result["recommendations"] else "Strengthen security controls",
            "rationale": result["explanation"]
        },
        "recommendedActions": recommended_actions,
        "financialExposure": result["financial_exposure"],
        "incidentProbability": result["incident_probability"],
        "featureImportance": result["feature_importance"]
    }


# -------------------------
# Investment Optimizer
# -------------------------

@app.get("/api/optimizer/options")
def optimizer_options():
    return [
        {
            "id": "patch-critical-vulnerability",
            "name": "Patch critical vulnerability",
            "cost": 100000,
            "riskReduction": 20,
            "priority": "Critical",
            "assetCriticality": "Critical",
            "assetExposure": "Internet Exposed",
            "description": "Apply critical security patches to internet-exposed systems and high-value assets."
        },
        {
            "id": "deploy-edr",
            "name": "EDR",
            "cost": 200000,
            "riskReduction": 18,
            "priority": "High",
            "assetCriticality": "High",
            "assetExposure": "Internet Exposed",
            "description": "Deploy endpoint detection and response coverage across critical systems."
        },
        {
            "id": "network-segmentation",
            "name": "Network segmentation",
            "cost": 300000,
            "riskReduction": 25,
            "priority": "High",
            "assetCriticality": "Critical",
            "assetExposure": "Internet Exposed",
            "description": "Isolate critical systems to reduce lateral movement and contain attacks."
        },
        {
            "id": "improve-backup-recovery",
            "name": "Backup",
            "cost": 200000,
            "riskReduction": 12,
            "priority": "Medium",
            "assetCriticality": "High",
            "assetExposure": "Restricted",
            "description": "Harden backups and improve recovery readiness for critical production systems."
        },
        {
            "id": "enable-mfa",
            "name": "MFA",
            "cost": 50000,
            "riskReduction": 10,
            "priority": "High",
            "assetCriticality": "Medium",
            "assetExposure": "Internal",
            "description": "Enable multi-factor authentication for administrative and privileged accounts."
        }
    ]


class OptimizeRequest(BaseModel):
    budget: float


@app.post("/api/optimizer/calculate")
def optimizer_calculate(payload: OptimizeRequest):
    _, investments = create_sample_dataset()

    optimizer = InvestmentOptimizer(
        payload.budget,
        investments
    )

    result = optimizer.optimize()

    budget_used = result["total_cost"]

    return {
        "beforeRisk": 100,
        "afterRisk": round(
            100 - result["optimal_risk_reduction"],
            2
        ),
        "reduction": result["optimal_risk_reduction"],
        "budgetUsed": budget_used,
        "budgetRemaining": round(
            payload.budget - budget_used,
            2
        ),
        "utilizationPct": round(
            (budget_used / payload.budget) * 100,
            2
        ) if payload.budget > 0 else 0,
        "selected": result["selected_investments"]
    }
