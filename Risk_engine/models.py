from dataclasses import dataclass


@dataclass
class RiskInput:
    cvss: float
    asset_criticality: float
    exposure: float
    exploitability: float
    data_sensitivity: float
    business_impact: float
    potential_loss: float

    def validate(self):
        if not 0 <= self.cvss <= 10:
            raise ValueError("CVSS must be between 0 and 10")

        if not 0 <= self.asset_criticality <= 10:
            raise ValueError("Asset criticality must be between 0 and 10")

        if not 0 <= self.exposure <= 1:
            raise ValueError("Exposure must be between 0 and 1")

        if not 0 <= self.exploitability <= 1:
            raise ValueError("Exploitability must be between 0 and 1")

        if not 0 <= self.data_sensitivity <= 10:
            raise ValueError("Data sensitivity must be between 0 and 10")

        if not 0 <= self.business_impact <= 10:
            raise ValueError("Business impact must be between 0 and 10")

        if self.potential_loss < 0:
            raise ValueError("Potential loss cannot be negative")
