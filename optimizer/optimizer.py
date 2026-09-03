"""
Cybersecurity Investment Optimizer
Maximizes risk reduction within budget constraints using dynamic programming
"""

from typing import List, Dict, Tuple, Any
from dataclasses import dataclass


@dataclass
class Investment:
    """Represents a cybersecurity investment option"""
    name: str
    cost: float  # Cost in lakhs (L) or rupees
    risk_reduction: float  # Risk reduction value (0-100 scale)
    
    def __repr__(self):
        return f"{self.name} (Cost: ₹{self.cost}, Risk Reduction: {self.risk_reduction})"


class InvestmentOptimizer:
    """
    Solves the investment optimization problem using Dynamic Programming
    This is a variant of the 0/1 Knapsack Problem
    """
    
    def __init__(self, budget: float, investments: List[Investment]):
        """
        Initialize optimizer
        
        Args:
            budget: Total budget available (in same units as investment costs)
            investments: List of Investment objects
        """
        self.budget = budget
        self.investments = investments
        self.n = len(investments)
    
    def optimize(self) -> Dict[str, Any]:
        """
        Solves the investment optimization problem
        
        Returns:
            Dictionary containing optimal solution details
        """
        # Create DP table: dp[i][w] = max risk reduction using first i items with budget w
        # We'll convert budget to integer for simplicity (multiply by 100 to handle decimals)
        budget_int = int(self.budget * 100)
        
        # Initialize DP table
        dp = [[0 for _ in range(budget_int + 1)] for _ in range(self.n + 1)]
        
        # Fill DP table
        for i in range(1, self.n + 1):
            investment = self.investments[i - 1]
            cost_int = int(investment.cost * 100)
            
            for w in range(budget_int + 1):
                # Option 1: Don't include this investment
                dp[i][w] = dp[i - 1][w]
                
                # Option 2: Include this investment (if budget allows)
                if cost_int <= w:
                    include_value = dp[i - 1][w - cost_int] + investment.risk_reduction
                    dp[i][w] = max(dp[i][w], include_value)
        
        # Backtrack to find which investments were selected
        selected_investments = []
        w = budget_int
        
        for i in range(self.n, 0, -1):
            if dp[i][w] != dp[i - 1][w]:
                investment = self.investments[i - 1]
                selected_investments.append(investment)
                cost_int = int(investment.cost * 100)
                w -= cost_int
        
        selected_investments.reverse()
        
        # Calculate totals
        total_cost = sum(inv.cost for inv in selected_investments)
        total_risk_reduction = sum(inv.risk_reduction for inv in selected_investments)
        remaining_budget = self.budget - total_cost
        
        return {
            "status": "success",
            "optimal_risk_reduction": total_risk_reduction,
            "total_cost": total_cost,
            "remaining_budget": remaining_budget,
            "budget_utilization": (total_cost / self.budget) * 100,
            "selected_investments": [
                {
                    "name": inv.name,
                    "cost": inv.cost,
                    "risk_reduction": inv.risk_reduction
                }
                for inv in selected_investments
            ],
            "num_selected": len(selected_investments),
            "efficiency_ratio": total_risk_reduction / total_cost if total_cost > 0 else 0
        }
    
    def get_efficiency_metrics(self) -> List[Dict[str, Any]]:
        """
        Calculate efficiency metrics for all investments
        
        Returns:
            List of investments sorted by efficiency (risk reduction per unit cost)
        """
        metrics = []
        for inv in self.investments:
            efficiency = inv.risk_reduction / inv.cost
            metrics.append({
                "name": inv.name,
                "cost": inv.cost,
                "risk_reduction": inv.risk_reduction,
                "efficiency_ratio": efficiency
            })
        
        return sorted(metrics, key=lambda x: x["efficiency_ratio"], reverse=True)
    
    def get_all_options(self) -> List[Dict[str, Any]]:
        """Get all investment options with their details"""
        return [
            {
                "name": inv.name,
                "cost": inv.cost,
                "risk_reduction": inv.risk_reduction
            }
            for inv in self.investments
        ]


def create_sample_dataset() -> Tuple[float, List[Investment]]:
    """
    Create sample dataset from the screenshot
    
    Returns:
        Tuple of (budget, list of investments)
    """
    # Budget: not specified, let's assume 8 lakhs for demonstration
    budget = 8.0  # ₹8 lakhs
    
    investments = [
        Investment("Patch critical vulnerability", cost=1.0, risk_reduction=20),
        Investment("EDR", cost=2.0, risk_reduction=18),
        Investment("Network segmentation", cost=3.0, risk_reduction=25),
        Investment("Backup", cost=2.0, risk_reduction=12),
        Investment("MFA", cost=0.5, risk_reduction=10),  # ₹50K = 0.5L
    ]
    
    return budget, investments


if __name__ == "__main__":
    # Example usage
    budget, investments = create_sample_dataset()
    
    print("=" * 70)
    print("CYBERSECURITY INVESTMENT OPTIMIZER")
    print("=" * 70)
    print(f"\nBudget: ₹{budget}L")
    print("\nAvailable Investments:")
    for inv in investments:
        print(f"  • {inv}")
    
    # Run optimizer
    optimizer = InvestmentOptimizer(budget, investments)
    result = optimizer.optimize()
    
    print("\n" + "=" * 70)
    print("OPTIMAL SOLUTION")
    print("=" * 70)
    print(f"Total Risk Reduction: {result['optimal_risk_reduction']}")
    print(f"Total Cost: ₹{result['total_cost']}L")
    print(f"Remaining Budget: ₹{result['remaining_budget']}L")
    print(f"Budget Utilization: {result['budget_utilization']:.1f}%")
    print(f"Efficiency Ratio: {result['efficiency_ratio']:.2f}")
    
    print("\nSelected Investments:")
    for inv in result['selected_investments']:
        print(f"  ✓ {inv['name']}")
        print(f"    Cost: ₹{inv['cost']}L | Risk Reduction: {inv['risk_reduction']}")
    
    print("\n" + "=" * 70)
    print("EFFICIENCY ANALYSIS")
    print("=" * 70)
    efficiency_metrics = optimizer.get_efficiency_metrics()
    for metric in efficiency_metrics:
        print(f"{metric['name']}: {metric['efficiency_ratio']:.2f} units/cost")
