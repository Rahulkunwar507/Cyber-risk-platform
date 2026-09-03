from models import RiskInput


def calculate_expected_loss(probability, potential_loss):
    return probability * potential_loss


def estimate_probability(data: RiskInput):
    """
    Estimates the probability of a successful security incident.

    This is a prototype heuristic and is not a statistically
    validated probability model.
    """

    cvss = data.cvss / 10
    exploitability = data.exploitability
    exposure = data.exposure

    probability = (
        0.40 * cvss +
        0.35 * exploitability +
        0.25 * exposure
    )

    probability = max(0.01, min(0.95, probability))

    return probability


def calculate_risk(data: RiskInput):

    data.validate()

    cvss = data.cvss / 10
    criticality = data.asset_criticality / 10
    data_sensitivity = data.data_sensitivity / 10
    business_impact = data.business_impact / 10

    exposure = data.exposure
    exploitability = data.exploitability

    cvss_contribution = 0.30 * cvss * 100
    criticality_contribution = 0.20 * criticality * 100
    exposure_contribution = 0.15 * exposure * 100
    exploitability_contribution = 0.15 * exploitability * 100
    data_sensitivity_contribution = 0.10 * data_sensitivity * 100
    business_impact_contribution = 0.10 * business_impact * 100

    risk_score = (
        cvss_contribution +
        criticality_contribution +
        exposure_contribution +
        exploitability_contribution +
        data_sensitivity_contribution +
        business_impact_contribution
    )

    if risk_score <= 30:
        risk_level = "Low"
        priority = "Monitor"

    elif risk_score <= 60:
        risk_level = "Medium"
        priority = "Plan Remediation"

    elif risk_score <= 80:
        risk_level = "High"
        priority = "High"

    else:
        risk_level = "Critical"
        priority = "Immediate"

    probability = estimate_probability(data)

    expected_loss = calculate_expected_loss(
        probability,
        data.potential_loss
    )

    return {
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "priority": priority,

        "risk_breakdown": {
            "cvss": round(cvss_contribution, 2),
            "asset_criticality": round(criticality_contribution, 2),
            "exposure": round(exposure_contribution, 2),
            "exploitability": round(exploitability_contribution, 2),
            "data_sensitivity": round(data_sensitivity_contribution, 2),
            "business_impact": round(business_impact_contribution, 2)
        },

        "probability": round(probability, 3),
        "potential_loss": data.potential_loss,
        "expected_loss": round(expected_loss, 2)
    }
