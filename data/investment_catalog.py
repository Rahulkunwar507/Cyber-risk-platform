INVESTMENT_CATALOG = [
    {
        "id": "patch-critical-vulnerability",
        "name": "Patch Critical Vulnerability",
        "cost": 100000,
        "riskReduction": 18,
        "priority": "Critical",
        "assetCriticality": "Critical",
        "assetExposure": "Internet Exposed",
        "description": (
            "Apply the vendor patch for CVE-2026-1001 and related critical "
            "issues on the customer database tier and internet-exposed services."
        ),
    },
    {
        "id": "deploy-edr",
        "name": "Deploy EDR",
        "cost": 200000,
        "riskReduction": 12,
        "priority": "High",
        "assetCriticality": "High",
        "assetExposure": "Internet Exposed",
        "description": (
            "Endpoint detection and response coverage across internet-facing "
            "servers and the employee endpoint fleet."
        ),
    },
    {
        "id": "network-segmentation",
        "name": "Network Segmentation",
        "cost": 300000,
        "riskReduction": 15,
        "priority": "High",
        "assetCriticality": "Critical",
        "assetExposure": "Internet Exposed",
        "description": (
            "Isolate the customer database and payment tier from the general "
            "corporate network to contain lateral movement."
        ),
    },
    {
        "id": "improve-backup-recovery",
        "name": "Improve Backup & Recovery",
        "cost": 200000,
        "riskReduction": 8,
        "priority": "Medium",
        "assetCriticality": "High",
        "assetExposure": "Restricted",
        "description": (
            "Hardened, tested backups and validated recovery runbooks for "
            "critical production systems."
        ),
    },
    {
        "id": "enable-mfa",
        "name": "Enable MFA",
        "cost": 100000,
        "riskReduction": 10,
        "priority": "High",
        "assetCriticality": "Medium",
        "assetExposure": "Internal",
        "description": (
            "Multi-factor authentication for all administrative and "
            "privileged accounts across the organization."
        ),
    },
    {
        "id": "security-awareness-training",
        "name": "Security Awareness Training",
        "cost": 100000,
        "riskReduction": 5,
        "priority": "Medium",
        "assetCriticality": "Medium",
        "assetExposure": "Internal",
        "description": (
            "Role-based phishing and security hygiene training for all employees."
        ),
    },
]

PORTFOLIO_BASE_RISK = 87
OVERLAP_FACTOR = 0.84
