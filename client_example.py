"""
Example client for Cybersecurity Investment Optimizer API
Demonstrates various API endpoints and use cases
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:5000"


class OptimizationClient:
    """Client for interacting with the Investment Optimizer API"""
    
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
    
    def health_check(self) -> Dict[str, Any]:
        """Check API health"""
        response = requests.get(f"{self.base_url}/api/health")
        return response.json()
    
    def optimize(self, budget: float = None, investments: list = None) -> Dict[str, Any]:
        """
        Optimize investments (POST with custom data or GET with budget)
        
        Args:
            budget: Total budget available
            investments: List of investment dicts with name, cost, risk_reduction
        """
        if budget is not None and investments is not None:
            payload = {
                "budget": budget,
                "investments": investments
            }
            response = requests.post(
                f"{self.base_url}/api/optimize",
                json=payload
            )
        elif budget is not None:
            response = requests.get(f"{self.base_url}/api/optimize/{budget}")
        else:
            response = requests.post(f"{self.base_url}/api/optimize")
        
        return response.json()
    
    def get_investments(self) -> Dict[str, Any]:
        """Get all available investments"""
        response = requests.get(f"{self.base_url}/api/investments")
        return response.json()
    
    def get_efficiency(self) -> Dict[str, Any]:
        """Get efficiency metrics for all investments"""
        response = requests.get(f"{self.base_url}/api/efficiency")
        return response.json()
    
    def get_config(self) -> Dict[str, Any]:
        """Get current configuration"""
        response = requests.get(f"{self.base_url}/api/config")
        return response.json()
    
    def set_config(self, budget: float, investments: list) -> Dict[str, Any]:
        """Set new configuration"""
        payload = {
            "budget": budget,
            "investments": investments
        }
        response = requests.post(
            f"{self.base_url}/api/config",
            json=payload
        )
        return response.json()
    
    def compare_budgets(self, budgets: list, investments: list = None) -> Dict[str, Any]:
        """Compare optimization results across multiple budgets"""
        payload = {
            "budgets": budgets,
            "investments": investments
        }
        response = requests.post(
            f"{self.base_url}/api/compare",
            json=payload
        )
        return response.json()
    
    def get_docs(self) -> Dict[str, Any]:
        """Get API documentation"""
        response = requests.get(f"{self.base_url}/api/docs")
        return response.json()


def print_result(title: str, data: Dict[str, Any]):
    """Pretty print result"""
    print("\n" + "=" * 70)
    print(title)
    print("=" * 70)
    print(json.dumps(data, indent=2))


def example_1_basic_optimization():
    """Example 1: Basic optimization with default data"""
    print("\n\n█████ EXAMPLE 1: Basic Optimization (Default Data) █████")
    
    client = OptimizationClient()
    
    # Check API health
    print("\n1. Health Check...")
    health = client.health_check()
    print(f"   Status: {health['status']}")
    
    # Get available investments
    print("\n2. Available Investments...")
    investments = client.get_investments()
    print(f"   Total investments: {investments['total_options']}")
    print(f"   Current budget: ₹{investments['current_budget']}L")
    
    # Run optimization
    print("\n3. Running Optimization...")
    result = client.optimize()
    print_result("OPTIMAL SOLUTION", result)


def example_2_custom_budget():
    """Example 2: Optimize with different budgets"""
    print("\n\n█████ EXAMPLE 2: Optimize with Different Budgets █████")
    
    client = OptimizationClient()
    
    budgets = [5.0, 7.0, 10.0]
    
    for budget in budgets:
        print(f"\n--- Budget: ₹{budget}L ---")
        result = client.optimize(budget=budget)
        print(f"Risk Reduction: {result['optimal_risk_reduction']}")
        print(f"Cost: ₹{result['total_cost']}L")
        print(f"Budget Utilization: {result['budget_utilization']:.1f}%")
        print(f"Selected: {len(result['selected_investments'])} investments")


def example_3_custom_investments():
    """Example 3: Optimize with custom investment options"""
    print("\n\n█████ EXAMPLE 3: Custom Investment Options █████")
    
    client = OptimizationClient()
    
    # Define custom investments
    custom_investments = [
        {
            "name": "Advanced Threat Detection",
            "cost": 2.5,
            "risk_reduction": 35
        },
        {
            "name": "Employee Security Training",
            "cost": 0.8,
            "risk_reduction": 15
        },
        {
            "name": "Penetration Testing",
            "cost": 1.5,
            "risk_reduction": 22
        },
        {
            "name": "Security Incident Response",
            "cost": 3.0,
            "risk_reduction": 28
        }
    ]
    
    result = client.optimize(
        budget=7.0,
        investments=custom_investments
    )
    
    print_result("OPTIMIZATION WITH CUSTOM INVESTMENTS", result)


def example_4_efficiency_analysis():
    """Example 4: Efficiency analysis"""
    print("\n\n█████ EXAMPLE 4: Efficiency Analysis █████")
    
    client = OptimizationClient()
    
    result = client.get_efficiency()
    
    print("\n" + "=" * 70)
    print("EFFICIENCY METRICS (Risk Reduction per Unit Cost)")
    print("=" * 70)
    
    for i, metric in enumerate(result['efficiency_metrics'], 1):
        print(f"\n{i}. {metric['name']}")
        print(f"   Cost: ₹{metric['cost']}L")
        print(f"   Risk Reduction: {metric['risk_reduction']}")
        print(f"   Efficiency: {metric['efficiency_ratio']:.2f} units/cost")


def example_5_budget_comparison():
    """Example 5: Compare solutions across budgets"""
    print("\n\n█████ EXAMPLE 5: Budget Comparison █████")
    
    client = OptimizationClient()
    
    result = client.compare_budgets([4.0, 6.0, 8.0, 10.0])
    
    print("\n" + "=" * 70)
    print("BUDGET COMPARISON")
    print("=" * 70)
    
    for comparison in result['comparisons']:
        budget = comparison['budget']
        risk_reduction = comparison['optimal_risk_reduction']
        cost = comparison['total_cost']
        utilization = comparison['budget_utilization']
        
        print(f"\nBudget: ₹{budget}L")
        print(f"  Risk Reduction: {risk_reduction}")
        print(f"  Actual Cost: ₹{cost}L")
        print(f"  Utilization: {utilization:.1f}%")
        print(f"  Investments: {comparison['num_selected']}")


def example_6_configuration():
    """Example 6: Get and set configuration"""
    print("\n\n█████ EXAMPLE 6: Configuration Management █████")
    
    client = OptimizationClient()
    
    # Get current config
    print("\n1. Current Configuration:")
    config = client.get_config()
    print(f"   Budget: ₹{config['current_budget']}L")
    print(f"   Investments: {len(config['investments'])}")
    
    # Set new config
    print("\n2. Setting New Configuration...")
    new_investments = [
        {
            "name": "Cloud Security",
            "cost": 2.0,
            "risk_reduction": 30
        },
        {
            "name": "API Protection",
            "cost": 1.5,
            "risk_reduction": 22
        }
    ]
    
    new_config = client.set_config(5.0, new_investments)
    print_result("NEW CONFIG RESULT", new_config)


if __name__ == "__main__":
    print("╔" + "═" * 68 + "╗")
    print("║" + " CYBERSECURITY INVESTMENT OPTIMIZER - CLIENT EXAMPLES ".center(68) + "║")
    print("╚" + "═" * 68 + "╝")
    
    try:
        # Run all examples
        example_1_basic_optimization()
        example_2_custom_budget()
        example_3_custom_investments()
        example_4_efficiency_analysis()
        example_5_budget_comparison()
        example_6_configuration()
        
        print("\n\n" + "=" * 70)
        print("✓ All examples completed successfully!")
        print("=" * 70)
    
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to API server")
        print("   Make sure the Flask server is running on http://localhost:5000")
        print("\n   To start the server, run:")
        print("   $ python app.py")
    
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
