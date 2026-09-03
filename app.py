"""
Flask REST API for Cybersecurity Investment Optimization
Endpoints for optimization, analysis, and configuration
"""

from flask import Flask, request, jsonify
from optimizer import InvestmentOptimizer, Investment, create_sample_dataset
from typing import List, Dict, Any
import json

app = Flask(__name__)

# Global optimizer instance (will be initialized with sample data)
current_optimizer = None
current_budget = None
current_investments = None


def initialize_optimizer(budget: float = None, investments: List[Dict] = None):
    """Initialize optimizer with custom or sample data"""
    global current_optimizer, current_budget, current_investments
    
    if budget is None or investments is None:
        budget, inv_list = create_sample_dataset()
    else:
        inv_list = [
            Investment(
                name=inv['name'],
                cost=inv['cost'],
                risk_reduction=inv['risk_reduction']
            )
            for inv in investments
        ]
    
    current_budget = budget
    current_investments = inv_list
    current_optimizer = InvestmentOptimizer(budget, inv_list)


# Initialize with sample data
initialize_optimizer()


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Cybersecurity Investment Optimizer API"
    }), 200


@app.route('/api/optimize', methods=['POST'])
def optimize():
    """
    POST endpoint to optimize investments
    
    Request body (optional):
    {
        "budget": 8.0,
        "investments": [
            {
                "name": "Patch critical vulnerability",
                "cost": 1.0,
                "risk_reduction": 20
            },
            ...
        ]
    }
    
    Returns:
        Optimal solution with selected investments
    """
    try:
        data = request.get_json() or {}
        
        # Use provided budget/investments or defaults
        budget = data.get('budget', current_budget)
        investments_data = data.get('investments', None)
        
        if investments_data:
            initialize_optimizer(budget, investments_data)
        elif budget != current_budget:
            initialize_optimizer(budget, [
                {
                    "name": inv.name,
                    "cost": inv.cost,
                    "risk_reduction": inv.risk_reduction
                }
                for inv in current_investments
            ])
        
        result = current_optimizer.optimize()
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


@app.route('/api/optimize/<float:budget>', methods=['GET'])
def optimize_with_budget(budget):
    """
    GET endpoint to optimize with a specific budget
    
    URL: /api/optimize/8.0
    
    Returns:
        Optimal solution for the given budget
    """
    try:
        initialize_optimizer(
            budget,
            [
                {
                    "name": inv.name,
                    "cost": inv.cost,
                    "risk_reduction": inv.risk_reduction
                }
                for inv in current_investments
            ]
        )
        result = current_optimizer.optimize()
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


@app.route('/api/investments', methods=['GET'])
def get_investments():
    """Get all available investment options"""
    try:
        options = current_optimizer.get_all_options()
        return jsonify({
            "status": "success",
            "current_budget": current_budget,
            "investments": options,
            "total_options": len(options)
        }), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


@app.route('/api/efficiency', methods=['GET'])
def get_efficiency():
    """Get efficiency metrics for all investments"""
    try:
        metrics = current_optimizer.get_efficiency_metrics()
        return jsonify({
            "status": "success",
            "efficiency_metrics": metrics,
            "note": "Sorted by efficiency ratio (risk reduction per unit cost, descending)"
        }), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


@app.route('/api/config', methods=['GET', 'POST'])
def config():
    """
    GET: Get current configuration
    POST: Set new configuration
    """
    if request.method == 'GET':
        return jsonify({
            "status": "success",
            "current_budget": current_budget,
            "investments": [
                {
                    "name": inv.name,
                    "cost": inv.cost,
                    "risk_reduction": inv.risk_reduction
                }
                for inv in current_investments
            ]
        }), 200
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            budget = data.get('budget')
            investments = data.get('investments')
            
            if budget is None or investments is None:
                return jsonify({
                    "status": "error",
                    "message": "budget and investments are required"
                }), 400
            
            initialize_optimizer(budget, investments)
            
            return jsonify({
                "status": "success",
                "message": "Configuration updated",
                "current_budget": current_budget,
                "num_investments": len(current_investments)
            }), 200
        
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 400


@app.route('/api/compare', methods=['POST'])
def compare_budgets():
    """
    Compare optimal solutions for multiple budgets
    
    Request body:
    {
        "budgets": [5.0, 7.0, 10.0],
        "investments": [...]  # optional
    }
    """
    try:
        data = request.get_json()
        budgets = data.get('budgets', [])
        investments_data = data.get('investments', None)
        
        if not budgets:
            return jsonify({
                "status": "error",
                "message": "budgets array is required"
            }), 400
        
        results = []
        for budget in budgets:
            initialize_optimizer(budget, investments_data)
            solution = current_optimizer.optimize()
            results.append({
                "budget": budget,
                **solution
            })
        
        return jsonify({
            "status": "success",
            "comparisons": results
        }), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


@app.route('/api/docs', methods=['GET'])
def docs():
    """API documentation"""
    return jsonify({
        "service": "Cybersecurity Investment Optimizer API",
        "version": "1.0.0",
        "endpoints": {
            "GET /api/health": "Health check",
            "GET /api/investments": "Get all available investments",
            "GET /api/efficiency": "Get efficiency metrics sorted by ROI",
            "POST /api/optimize": "Optimize with custom budget and investments",
            "GET /api/optimize/<budget>": "Optimize with specific budget",
            "GET /api/config": "Get current configuration",
            "POST /api/config": "Set new configuration",
            "POST /api/compare": "Compare solutions across multiple budgets",
            "GET /api/docs": "API documentation"
        },
        "sample_request": {
            "endpoint": "POST /api/optimize",
            "body": {
                "budget": 8.0,
                "investments": [
                    {
                        "name": "Patch critical vulnerability",
                        "cost": 1.0,
                        "risk_reduction": 20
                    }
                ]
            }
        }
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "status": "error",
        "message": "Endpoint not found",
        "available_endpoints": "/api/docs"
    }), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500


if __name__ == '__main__':
    print("Starting Cybersecurity Investment Optimizer API...")
    print("Documentation available at: http://localhost:5000/api/docs")
    app.run(debug=True, host='0.0.0.0', port=5000)
