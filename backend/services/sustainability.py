"""
AGRO-TWIN Sustainability Calculation Service
Configurable multi-objective weighting:
- 30% Water Efficiency
- 25% Soil Health
- 20% Yield Efficiency
- 15% Resource/Carbon Efficiency
- 10% Crop Resilience
"""

def calculate_sustainability_score(metrics: dict = None) -> dict:
    weights = {
        "water_efficiency": 0.30,
        "soil_health": 0.25,
        "yield_efficiency": 0.20,
        "resource_carbon": 0.15,
        "crop_resilience": 0.10
    }

    sub_scores = {
        "water_efficiency": 82,
        "soil_health": 80,
        "yield_efficiency": 78,
        "resource_carbon": 75,
        "crop_resilience": 84
    }

    overall = round(sum(sub_scores[k] * weights[k] for k in weights))

    return {
        "overall_score": overall,
        "sub_scores": sub_scores,
        "weights": weights
    }
