"""HTTP tests for the FastAPI wrapper using TestClient."""

import unittest

from fastapi.testclient import TestClient

from api import app

client = TestClient(app, raise_server_exceptions=False)

EXAMPLE_PAYLOAD = {
    "cvss": 9.8,
    "asset_criticality": 10,
    "exposure": 1,
    "exploitability": 1,
    "data_sensitivity": 10,
    "business_impact": 10,
    "potential_loss": 4000000,
}


class TestAPI(unittest.TestCase):

    def test_health(self):
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_calculate_risk_success(self):
        response = client.post("/calculate-risk", json=EXAMPLE_PAYLOAD)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            "risk_score": 99.4,
            "risk_level": "Critical",
            "priority": "Immediate",
            "risk_breakdown": {
                "cvss": 29.4,
                "asset_criticality": 20.0,
                "exposure": 15.0,
                "exploitability": 15.0,
                "data_sensitivity": 10.0,
                "business_impact": 10.0,
            },
            "probability": 0.95,
            "potential_loss": 4000000,
            "expected_loss": 3800000.0,
        })

    def test_invalid_cvss_over_10_returns_422(self):
        payload = dict(EXAMPLE_PAYLOAD)
        payload["cvss"] = 11
        response = client.post("/calculate-risk", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_invalid_cvss_negative_returns_422(self):
        payload = dict(EXAMPLE_PAYLOAD)
        payload["cvss"] = -1
        response = client.post("/calculate-risk", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_invalid_asset_criticality_returns_422(self):
        payload = dict(EXAMPLE_PAYLOAD)
        payload["asset_criticality"] = 11
        response = client.post("/calculate-risk", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_invalid_exposure_returns_422(self):
        payload = dict(EXAMPLE_PAYLOAD)
        payload["exposure"] = 1.5
        response = client.post("/calculate-risk", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_invalid_exploitability_returns_422(self):
        payload = dict(EXAMPLE_PAYLOAD)
        payload["exploitability"] = 2
        response = client.post("/calculate-risk", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_negative_potential_loss_returns_422(self):
        payload = dict(EXAMPLE_PAYLOAD)
        payload["potential_loss"] = -100
        response = client.post("/calculate-risk", json=payload)
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
