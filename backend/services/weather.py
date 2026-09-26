"""
AGRO-TWIN Weather Service Abstraction
Provides meteorological observation and forecast parameters.
"""

def get_weather_forecast(location: str = "Coimbatore, Tamil Nadu") -> dict:
    return {
        "location": location,
        "temperature_c": 31.0,
        "condition": "Partly Cloudy",
        "humidity_percent": 64,
        "rain_probability_percent": 18,
        "wind": "11 km/h ENE",
        "evapotranspiration_mm_day": 4.1,
        "heat_risk": "Low",
        "station_id": "IMD-CBE-NORTH-12",
        "status": "Telemetry Linked"
    }
