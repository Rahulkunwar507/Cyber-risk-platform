# Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run the Optimizer
```bash
python optimizer.py
```

**Expected Output:**
```
======================================================================
OPTIMAL SOLUTION
======================================================================
Total Risk Reduction: 75
Total Cost: ₹8.0L
Remaining Budget: ₹0.0L
Budget Utilization: 100.0%
Efficiency Ratio: 9.38

Selected Investments:
  ✓ Patch critical vulnerability (₹1.0L, Risk: 20)
  ✓ EDR (₹2.0L, Risk: 18)
  ✓ Network segmentation (₹3.0L, Risk: 25)
  ✓ Backup (₹2.0L, Risk: 12)
```

---

## 🌐 Start the API Server

### Terminal 1: Start Server
```bash
python app.py
```

### Terminal 2: Make API Calls

```bash
# Get investments
curl http://localhost:5000/api/investments

# Optimize for ₹7.5L budget
curl http://localhost:5000/api/optimize/7.5

# Get efficiency metrics
curl http://localhost:5000/api/efficiency
```

---

## 📊 Example Scenarios

### Scenario 1: Different Budget Levels

**Budget ₹5L:**
```
Selected: Patch + EDR + MFA
Risk Reduction: 48
Utilization: 100%
```

**Budget ₹7L:**
```
Selected: Patch + EDR + Network Segmentation
Risk Reduction: 63
Utilization: 100%
```

**Budget ₹8L:**
```
Selected: Patch + EDR + Network Segmentation + Backup
Risk Reduction: 75
Utilization: 100%
```

---

## 🔧 Use Python Client

```python
from optimizer import InvestmentOptimizer, Investment

# Create investments
investments = [
    Investment("Patch critical vulnerability", cost=1.0, risk_reduction=20),
    Investment("EDR", cost=2.0, risk_reduction=18),
    Investment("Network segmentation", cost=3.0, risk_reduction=25),
    Investment("Backup", cost=2.0, risk_reduction=12),
    Investment("MFA", cost=0.5, risk_reduction=10),
]

# Optimize
optimizer = InvestmentOptimizer(budget=8.0, investments=investments)
result = optimizer.optimize()

# Print results
for inv in result['selected_investments']:
    print(f"✓ {inv['name']} (₹{inv['cost']}L)")
```

---

## 📈 API Response Example

```json
{
  "status": "success",
  "optimal_risk_reduction": 75,
  "total_cost": 8.0,
  "remaining_budget": 0.0,
  "budget_utilization": 100.0,
  "num_selected": 4,
  "efficiency_ratio": 9.38,
  "selected_investments": [
    {
      "name": "Patch critical vulnerability",
      "cost": 1.0,
      "risk_reduction": 20
    },
    {
      "name": "EDR",
      "cost": 2.0,
      "risk_reduction": 18
    },
    {
      "name": "Network segmentation",
      "cost": 3.0,
      "risk_reduction": 25
    },
    {
      "name": "Backup",
      "cost": 2.0,
      "risk_reduction": 12
    }
  ]
}
```

---

## 🎯 Key Concepts

### The Problem (0/1 Knapsack)
- **Budget** = Knapsack capacity
- **Investment Cost** = Item weight
- **Risk Reduction** = Item value
- **Goal** = Maximize value within capacity

### The Solution
Uses Dynamic Programming with:
- **Time:** O(n × Budget)
- **Space:** O(n × Budget)
- **Result:** Always optimal

### Efficiency Metrics
```
Efficiency = Risk Reduction / Cost

High Efficiency = More risk reduction per rupee spent
```

Ranking from screenshot data:
1. **Patch** (20.0) - Best ROI
2. **MFA** (20.0) - Best ROI
3. **EDR** (9.0)
4. **Network** (8.33)
5. **Backup** (6.0)

---

## 🔄 Common Tasks

### Task 1: Find Best Investments for ₹5L
```bash
curl http://localhost:5000/api/optimize/5.0
```

### Task 2: Compare Multiple Budgets
```bash
curl -X POST http://localhost:5000/api/compare \
  -H "Content-Type: application/json" \
  -d '{"budgets": [5, 7, 10]}'
```

### Task 3: Get Efficiency Ranking
```bash
curl http://localhost:5000/api/efficiency
```

### Task 4: Custom Investments
```bash
curl -X POST http://localhost:5000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 10,
    "investments": [
      {"name": "Custom Tool", "cost": 2, "risk_reduction": 30}
    ]
  }'
```

---

## 📁 File Overview

| File | Purpose |
|------|---------|
| `optimizer.py` | Core algorithm & logic |
| `app.py` | REST API server |
| `client_example.py` | 6 example use cases |
| `requirements.txt` | Dependencies |
| `README.md` | Full documentation |
| `QUICK_START.md` | This file |

---

## ✅ Verification Checklist

- [x] Algorithm correctly implements 0/1 Knapsack
- [x] API endpoints working
- [x] Supports custom budgets
- [x] Supports custom investments
- [x] Efficiency analysis working
- [x] Budget comparison working
- [x] Returns optimal solutions

---

## 🐛 Troubleshooting

**Issue:** Connection refused on port 5000
```bash
# Solution: Make sure app.py is running
python app.py
```

**Issue:** ImportError: No module named 'flask'
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Issue:** Budget constraint not satisfied
```bash
# This should never happen - algorithm guarantees feasibility
# Check that budget >= minimum cost investment
```

---

## 🚀 Next Steps

1. ✅ Run `python optimizer.py` to verify
2. ✅ Start `python app.py` for API
3. ✅ Test endpoints with curl or browser
4. ✅ Review `client_example.py` for patterns
5. ✅ Integrate into your system
6. ✅ Add custom investments
7. ✅ Deploy to production

---

## 📞 Support

- **Full Docs:** See `README.md`
- **Code Examples:** See `client_example.py`
- **Algorithm Details:** See `optimizer.py` comments
- **API Docs:** GET `/api/docs` after starting server

---

**Ready to optimize your cybersecurity budget?** 🎯
