def generate_recommendations(data):
    recommendations = []

    if data["cvss"] >= 9:
        recommendations.append({
            "action": "Patch critical vulnerability",
            "priority": "Critical",
            "reason": "Very high vulnerability severity."
        })
    elif data["cvss"] >= 7:
        recommendations.append({
            "action": "Prioritize vulnerability remediation",
            "priority": "High",
            "reason": "High vulnerability severity."
        })

    if data["exploit_available"] == 1:
        recommendations.append({
            "action": "Apply emergency mitigation",
            "priority": "Critical",
            "reason": "A known exploit is available."
        })

    if data["internet_exposed"] == 1:
        recommendations.append({
            "action": "Restrict unnecessary internet exposure",
            "priority": "High",
            "reason": "The asset is externally accessible."
        })

    if data["security_control_strength"] < 5:
        recommendations.append({
            "action": "Strengthen security controls",
            "priority": "High",
            "reason": "Current control strength is low."
        })

    if data["patch_age_days"] > 30:
        recommendations.append({
            "action": "Update and patch the system",
            "priority": "High",
            "reason": "Patch age is significantly overdue."
        })

    if data["data_sensitivity"] >= 8 and data["asset_criticality"] >= 8:
        recommendations.append({
            "action": "Increase protection for sensitive data",
            "priority": "High",
            "reason": "The asset stores highly sensitive data and is business-critical."
        })

    # Keep output concise for a dashboard.
    priority_rank = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    recommendations.sort(key=lambda x: priority_rank[x["priority"]])
    return recommendations[:5]
