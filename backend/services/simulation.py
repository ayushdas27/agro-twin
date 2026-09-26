"""
AGRO-TWIN Simulation Service
Calculates agronomic outcomes for irrigation, fertilizer, and weather variations.
"""

def run_simulation(irrigation_liters: float = 10.0) -> dict:
    liters = max(6.0, min(20.0, float(irrigation_liters)))
    baseline = 10.0
    water_use_percent = round((liters / baseline) * 100)

    # Yield curve: peaks near 12 L/m², drops if under-irrigated (<8) or over-irrigated (>14)
    if liters <= 10.0:
        yield_percent = round(100 - (10.0 - liters) * 3.5)
    elif liters <= 12.0:
        yield_percent = round(100 + (liters - 10.0) * 1.5)
    else:
        yield_percent = round(103 - (liters - 12.0) * 1.8)

    # Cost calculation: ₹5,000 baseline + ₹57.5 per liter delta
    cost = round(5000 + (liters - baseline) * 57.5)
    cost_delta = cost - 5000

    # Sustainability score (0-100)
    if liters == 10.0:
        score = 78
    elif liters == 12.0:
        score = 81
    elif liters == 11.0:
        score = 80
    elif liters == 13.0:
        score = 77
    elif liters == 14.0:
        score = 74
    elif liters == 16.0:
        score = 66
    elif liters < 10.0:
        score = max(50, 78 - round((10.0 - liters) * 2.5))
    else:
        score = max(45, 78 - round((liters - 10.0) * 3.2))

    score = min(100, max(0, score))

    # Moisture & risk forecast
    anticipated_moisture = round(48 + liters * 1.85)
    if anticipated_moisture > 72:
        risk_label = "Slight Waterlogging Risk"
        risk_color = "#D97706"
        risk_bg = "#FEF3C7"
    elif anticipated_moisture < 55:
        risk_label = "Moisture Deficit Warning"
        risk_color = "#DC2626"
        risk_bg = "#FEE2E2"
    else:
        risk_label = "Low Stress"
        risk_color = "#16A34A"
        risk_bg = "#DCFCE7"

    return {
        "irrigation_liters": liters,
        "water_use_percent": water_use_percent,
        "yield_percent": yield_percent,
        "operational_cost": cost,
        "cost_delta": cost_delta,
        "sustainability_score": score,
        "score_delta": score - 78,
        "anticipated_moisture": anticipated_moisture,
        "risk_label": risk_label,
        "risk_color": risk_color,
        "risk_bg": risk_bg
    }
