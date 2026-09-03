"""Unit tests for the original calculation engine (no HTTP)."""

import unittest

from models import RiskInput
from risk_engine import calculate_risk


class TestRiskEngine(unittest.TestCase):

    def test_critical_example_output(self):
        data = RiskInput(
            cvss=9.8,
            asset_criticality=10,
            exposure=1,
            exploitability=1,
            data_sensitivity=10,
            business_impact=10,
            potential_loss=4000000,
        )
        result = calculate_risk(data)

        self.assertEqual(result["risk_score"], 99.4)
        self.assertEqual(result["risk_level"], "Critical")
        self.assertEqual(result["priority"], "Immediate")
        self.assertEqual(result["risk_breakdown"]["cvss"], 29.4)
        self.assertEqual(result["risk_breakdown"]["asset_criticality"], 20.0)
        self.assertEqual(result["risk_breakdown"]["exposure"], 15.0)
        self.assertEqual(result["risk_breakdown"]["exploitability"], 15.0)
        self.assertEqual(result["risk_breakdown"]["data_sensitivity"], 10.0)
        self.assertEqual(result["risk_breakdown"]["business_impact"], 10.0)
        self.assertEqual(result["probability"], 0.95)
        self.assertEqual(result["potential_loss"], 4000000)
        self.assertEqual(result["expected_loss"], 3800000.0)

    def test_low_risk_threshold(self):
        data = RiskInput(
            cvss=0,
            asset_criticality=0,
            exposure=0,
            exploitability=0,
            data_sensitivity=0,
            business_impact=0,
            potential_loss=1000,
        )
        result = calculate_risk(data)
        self.assertEqual(result["risk_level"], "Low")
        self.assertEqual(result["priority"], "Monitor")
        self.assertEqual(result["risk_score"], 0.0)

    def test_invalid_cvss_raises(self):
        data = RiskInput(
            cvss=11,
            asset_criticality=1,
            exposure=0.5,
            exploitability=0.5,
            data_sensitivity=1,
            business_impact=1,
            potential_loss=100,
        )
        with self.assertRaises(ValueError):
            calculate_risk(data)


if __name__ == "__main__":
    unittest.main()
