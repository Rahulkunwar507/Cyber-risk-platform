import csv
import random
from pathlib import Path

random.seed(42)

OUT = Path("data/cyber_risk_data.csv")
OUT.parent.mkdir(parents=True, exist_ok=True)

rows = []
for _ in range(1000):
    cvss = round(random.uniform(2.0, 10.0), 1)
    asset_criticality = random.randint(1, 10)
    internet_exposed = random.randint(0, 1)
    exploit_available = random.choices([0, 1], weights=[0.72, 0.28])[0]
    data_sensitivity = random.randint(1, 10)
    security_control_strength = random.randint(1, 10)
    patch_age_days = random.randint(0, 120)

    # Synthetic label for prototype/demo purposes only.
    # Higher severity/exposure/sensitivity/age and weaker controls increase likelihood.
    score = (
        0.34 * (cvss / 10)
        + 0.18 * (asset_criticality / 10)
        + 0.14 * internet_exposed
        + 0.16 * exploit_available
        + 0.10 * (data_sensitivity / 10)
        + 0.10 * (patch_age_days / 120)
        - 0.16 * (security_control_strength / 10)
        + random.gauss(0, 0.07)
    )
    incident = int(score >= 0.50)

    rows.append([
        cvss, asset_criticality, internet_exposed, exploit_available,
        data_sensitivity, security_control_strength, patch_age_days, incident
    ])

with OUT.open("w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "cvss", "asset_criticality", "internet_exposed",
        "exploit_available", "data_sensitivity",
        "security_control_strength", "patch_age_days", "incident"
    ])
    writer.writerows(rows)

print(f"Created {len(rows)} synthetic records at {OUT}")
