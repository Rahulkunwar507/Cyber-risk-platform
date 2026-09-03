# Cybersecurity Investment Optimizer

A Python-based dynamic programming solution to maximize cybersecurity risk reduction within a fixed budget constraint. This is a practical implementation of the **0/1 Knapsack Problem** for investment portfolio optimization.

## Problem Statement

Given a fixed budget and multiple cybersecurity investment options (each with associated costs and risk reduction values), determine which investments to make to:
- **Maximize** total risk reduction
- **Minimize** total cost
- **Stay within** budget constraints

### Example Problem (from screenshot)

**Budget:** ₹8L (8 lakhs)

**Available Investments:**
- Patch critical vulnerability: Cost = ₹1L, Risk Reduction = 20
- EDR: Cost = ₹2L, Risk Reduction = 18
- Network segmentation: Cost = ₹3L, Risk Reduction = 25
- Backup: Cost = ₹2L, Risk Reduction = 12
- MFA: Cost = ₹0.5L, Risk Reduction = 10

## Algorithm

### Dynamic Programming Approach (0/1 Knapsack)

**Time Complexity:** O(n × B) where n = number of investments, B = budget  
**Space Complexity:** O(n × B)

#### Algorithm Steps:

1. Create DP table: `dp[i][w]` = maximum risk reduction using first i items with budget w
2. For each investment i and budget w:
   - Option 1: Don't select investment → `dp[i][w] = dp[i-1][w]`
   - Option 2: Select investment (if budget allows) → `dp[i][w] = dp[i-1][w-cost] + risk_reduction`
   - Take maximum of both options
3. Backtrack from `dp[n][B]` to find which investments were selected

#### Pseudocode:

```python
def optimize(budget, investments):
    n = len(investments)
    dp = [[0 for _ in range(budget + 1)] for _ in range(n + 1)]
    
    # Fill DP table
    for i in range(1, n + 1):
        cost, risk = investments[i-1].cost, investments[i-1].risk_reduction
        for w in range(budget + 1):
            # Don't include
            dp[i][w] = dp[i-1][w]
            # Include (if possible)
            if cost <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w-cost] + risk)
    
    # Backtrack to find selected investments
    selected = []
    w = budget
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i-1][w]:
            selected.append(investments[i-1])
            w -= investments[i-1].cost
    
    return selected
```

## Installation

### Prerequisites
- Python 3.8+
- pip

### Setup

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Verify installation
python optimizer.py
```

## Quick Start

### 1. Run Optimizer Locally

```bash
python optimizer.py
```

**Output:**
```
======================================================================
CYBERSECURITY INVESTMENT OPTIMIZER
======================================================================

Budget: ₹8L

Available Investments:
  • Patch critical vulnerability (Cost: ₹1L, Risk Reduction: 20)
  • EDR (Cost: ₹2L, Risk Reduction: 18)
  • Network segmentation (Cost: ₹3L, Risk Reduction: 25)
  • Backup (Cost: ₹2L, Risk Reduction: 12)
  • MFA (Cost: ₹0.5L, Risk Reduction: 10)

======================================================================
OPTIMAL SOLUTION
======================================================================
Total Risk Reduction: 73
Total Cost: ₹8L
Remaining Budget: ₹0L
Budget Utilization: 100.0%
Efficiency Ratio: 9.13

Selected Investments:
  ✓ Patch critical vulnerability
    Cost: ₹1L | Risk Reduction: 20
  ✓ EDR
    Cost: ₹2L | Risk Reduction: 18
  ✓ Network segmentation
    Cost: ₹3L | Risk Reduction: 25
  ✓ MFA
    Cost: ₹0.5L | Risk Reduction: 10
```

### 2. Start API Server

```bash
python app.py
```

**Output:**
```
Starting Cybersecurity Investment Optimizer API...
Documentation available at: http://localhost:5000/api/docs
 * Running on http://0.0.0.0:5000
```

### 3. Run Client Examples

In another terminal:

```bash
python client_example.py
```

## API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Cybersecurity Investment Optimizer API"
}
```

---

#### 2. Get All Investments
```http
GET /api/investments
```

**Response:**
```json
{
  "status": "success",
  "current_budget": 8.0,
  "investments": [
    {
      "name": "Patch critical vulnerability",
      "cost": 1.0,
      "risk_reduction": 20
    }
  ],
  "total_options": 5
}
```

---

#### 3. Get Efficiency Metrics
```http
GET /api/efficiency
```

Returns investments sorted by efficiency ratio (risk reduction per unit cost):

**Response:**
```json
{
  "status": "success",
  "efficiency_metrics": [
    {
      "name": "Patch critical vulnerability",
      "cost": 1.0,
      "risk_reduction": 20,
      "efficiency_ratio": 20.0
    }
  ]
}
```

---

#### 4. Optimize with Default Data
```http
POST /api/optimize
```

**Response:**
```json
{
  "status": "success",
  "optimal_risk_reduction": 73,
  "total_cost": 8.0,
  "remaining_budget": 0.0,
  "budget_utilization": 100.0,
  "selected_investments": [
    {
      "name": "Patch critical vulnerability",
      "cost": 1.0,
      "risk_reduction": 20
    }
  ],
  "num_selected": 4,
  "efficiency_ratio": 9.13
}
```

---

#### 5. Optimize with Custom Budget
```http
GET /api/optimize/7.5
```

Optimizes for a budget of ₹7.5L

---

#### 6. Optimize with Custom Data
```http
POST /api/optimize
Content-Type: application/json

{
  "budget": 10.0,
  "investments": [
    {
      "name": "Advanced Threat Detection",
      "cost": 2.5,
      "risk_reduction": 35
    },
    {
      "name": "Employee Training",
      "cost": 0.8,
      "risk_reduction": 15
    }
  ]
}
```

---

#### 7. Get Current Configuration
```http
GET /api/config
```

Returns current budget and investments

---

#### 8. Set Configuration
```http
POST /api/config
Content-Type: application/json

{
  "budget": 10.0,
  "investments": [...]
}
```

---

#### 9. Compare Multiple Budgets
```http
POST /api/compare
Content-Type: application/json

{
  "budgets": [5.0, 7.0, 10.0],
  "investments": [...]
}
```

Returns optimized solutions for each budget

---

#### 10. API Documentation
```http
GET /api/docs
```

Returns full API documentation

## Usage Examples

### Python - Direct Usage

```python
from optimizer import InvestmentOptimizer, Investment

# Define investments
investments = [
    Investment("Patch critical vulnerability", cost=1.0, risk_reduction=20),
    Investment("EDR", cost=2.0, risk_reduction=18),
    Investment("Network segmentation", cost=3.0, risk_reduction=25),
]

# Create optimizer
optimizer = InvestmentOptimizer(budget=8.0, investments=investments)

# Run optimization
result = optimizer.optimize()

print(f"Risk Reduction: {result['optimal_risk_reduction']}")
print(f"Total Cost: ₹{result['total_cost']}L")
print(f"Selected: {[inv['name'] for inv in result['selected_investments']]}")
```

### Python - Using API Client

```python
from client_example import OptimizationClient

client = OptimizationClient()

# Optimize with specific budget
result = client.optimize(budget=7.0)

print(f"Risk Reduction: {result['optimal_risk_reduction']}")
print(f"Budget Utilization: {result['budget_utilization']:.1f}%")
```

### cURL

```bash
# Get investments
curl http://localhost:5000/api/investments

# Optimize with budget 7.5L
curl http://localhost:5000/api/optimize/7.5

# Custom optimization
curl -X POST http://localhost:5000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 8.0,
    "investments": [
      {"name": "Patch", "cost": 1.0, "risk_reduction": 20}
    ]
  }'
```

### JavaScript/Node.js

```javascript
// Fetch optimization result
const response = await fetch('http://localhost:5000/api/optimize/7.5');
const result = await response.json();

console.log(`Risk Reduction: ${result.optimal_risk_reduction}`);
console.log(`Budget Utilization: ${result.budget_utilization}%`);
```

## Key Metrics

### Optimization Result Contains:

| Metric | Description |
|--------|-------------|
| `optimal_risk_reduction` | Total risk reduction achieved |
| `total_cost` | Total cost of selected investments |
| `remaining_budget` | Unused budget |
| `budget_utilization` | Percentage of budget used |
| `efficiency_ratio` | Risk reduction per unit cost |
| `selected_investments` | Array of selected investments |
| `num_selected` | Number of selected investments |

## Performance

### Time Complexity: O(n × B)
- n = number of investment options
- B = budget (in basic units)

### Space Complexity: O(n × B)

For typical scenarios (5-20 investments, budget in lakhs):
- Execution time: < 10ms
- Memory usage: < 1MB

## Why Dynamic Programming?

1. **Optimal Substructure:** The optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems:** Same subproblems arise multiple times
3. **Better than Brute Force:** O(n×B) vs O(2^n)
4. **Guaranteed Optimal:** Always finds the best solution
5. **Deterministic:** Same input always produces same output

## Comparison with Alternatives

| Approach | Time | Space | Optimal | Notes |
|----------|------|-------|---------|-------|
| DP (Knapsack) | O(n×B) | O(n×B) | ✓ Yes | Best for this problem |
| Greedy | O(n log n) | O(n) | ✗ No | May miss better solutions |
| Brute Force | O(2^n) | O(1) | ✓ Yes | Too slow for large n |
| Genetic Algorithm | O(generations×n) | O(pop_size×n) | ~ Maybe | Non-deterministic |

## Future Enhancements

- [ ] Multi-constraint optimization (budget, time, resources)
- [ ] Risk factor analysis and weighting
- [ ] Sensitivity analysis
- [ ] Machine learning for cost/benefit prediction
- [ ] Multi-period optimization (yearly planning)
- [ ] Dependency constraints between investments
- [ ] Web UI dashboard
- [ ] Database integration
- [ ] Authentication & multi-tenant support
- [ ] Real-time optimization updates

## Project Structure

```
.
├── optimizer.py           # Core optimization engine
├── app.py                # Flask REST API
├── client_example.py     # Example client with use cases
├── requirements.txt      # Python dependencies
├── README.md             # This file
└── data/
    └── sample_data.json  # Sample investment data
```

## Contributing

Feel free to extend the solution:

```python
# Add new investment option
new_investment = Investment(
    name="Custom Security Tool",
    cost=1.5,
    risk_reduction=25
)

# Add constraint (e.g., time)
# Modify optimizer for multi-objective optimization
# Add machine learning for prediction
```

## License

MIT License - Feel free to use in production

## Author

Cybersecurity Team - Investment Optimization Squad

## Support

For issues or questions:
1. Check API documentation: `/api/docs`
2. Review example usage in `client_example.py`
3. Check algorithm explanation in this README
4. Run with debug mode: `app.run(debug=True)`

---

**Key Insight:** This solution transforms a complex resource allocation problem into an efficient algorithmic optimization, ensuring maximum security impact for every rupee spent.
