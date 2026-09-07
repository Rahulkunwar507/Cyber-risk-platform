import json
import os

SYSTEM_PROMPT = """
You are a cybersecurity risk advisor.

Use ONLY the structured facts supplied by the application.
Do not invent vulnerabilities, incidents, financial values, or numerical risk values.
Do not change the risk score or incident probability.
Return concise dashboard-ready JSON with:
summary: string
actions: array of objects with action, priority, reason
"""

def build_prompt(analysis):
    return SYSTEM_PROMPT + "\n\nSTRUCTURED RISK ASSESSMENT:\n" + json.dumps(
        analysis, indent=2
    )

def build_openai_request(analysis):
    """
    Returns a payload suitable for an OpenAI-compatible chat/completions client.
    This function does not make a network call.
    """
    return {
        "model": os.getenv("LLM_MODEL", "gpt-5"),
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": json.dumps(analysis, indent=2)
            }
        ],
        "temperature": 0.2,
    }

if __name__ == "__main__":
    sample = {
        "asset": "Customer Database",
        "risk_score": 87,
        "incident_probability": 0.82,
        "recommendations": [
            {"action": "Patch critical vulnerability", "priority": "Critical"},
            {"action": "Apply emergency mitigation", "priority": "Critical"},
            {"action": "Restrict internet exposure", "priority": "High"}
        ]
    }
    print(build_prompt(sample))
