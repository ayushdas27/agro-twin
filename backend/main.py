"""
AGRO-TWIN Backend API (FastAPI)
AI-Powered Sustainable Farm Digital Twin & Decision Platform
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List

from services.simulation import run_simulation
from services.recommendations import generate_recommendations
from services.sustainability import calculate_sustainability_score
from services.weather import get_weather_forecast

app = FastAPI(
    title="AGRO-TWIN API",
    description="Predict. Simulate. Optimize. Sustain. — Agronomic Decision Engine",
    version="2.4.0"
)

# Enable CORS for frontend web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory prototype datastore for hackathon MVP
FARMS_DB = {
    "farm_default": {
        "id": "farm_default",
        "user_id": "usr_default",
        "name": "Green Valley Farm",
        "location": "Coimbatore, Tamil Nadu",
        "area": 2.5,
        "primary_crop": "Tomato (Solanum lycopersicum)",
        "crop_variety": "Arka Rakshak (F1 Hybrid)",
        "planting_date": "2026-08-12",
        "soil_type": "Red Sandy Loam",
        "irrigation_method": "In-line PC Drip (1.6 L/h)",
        "sustainability_score": 78,
        "crop_health_percent": 87,
        "water_efficiency_percent": 82,
        "weather_risk": "Low (18% rain prob)",
        "history": [
            {"date": "Sep 23, 2026", "action": "Drip recalibration", "impact": "Water use -8%", "score": 78},
            {"date": "Sep 12, 2026", "action": "Mulch applied", "impact": "Soil retention +14%", "score": 75}
        ]
    }
}

class FarmCreateRequest(BaseModel):
    user_id: str
    name: str
    location: str
    area: float
    primary_crop: str
    crop_variety: str
    planting_date: str
    soil_type: str
    irrigation_method: str

class SimulationRequest(BaseModel):
    irrigation_liters: float = Field(default=10.0, ge=6.0, le=20.0)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "AGRO-TWIN Agronomics Engine",
        "version": "v2.4.0"
    }

@app.get("/farms")
def list_farms():
    return list(FARMS_DB.values())

@app.post("/farms")
def create_farm(payload: FarmCreateRequest):
    farm_id = f"farm_{payload.user_id}"
    farm_data = payload.dict()
    farm_data["id"] = farm_id
    farm_data["sustainability_score"] = 78
    farm_data["crop_health_percent"] = 88
    farm_data["water_efficiency_percent"] = 82
    farm_data["weather_risk"] = "Low"
    farm_data["history"] = []
    FARMS_DB[farm_id] = farm_data
    return farm_data

@app.get("/farms/{farm_id}")
def get_farm(farm_id: str):
    if farm_id not in FARMS_DB:
        raise HTTPException(status_code=404, detail="Farm record not found")
    return FARMS_DB[farm_id]

@app.post("/farms/{farm_id}/analyze")
def analyze_farm(farm_id: str):
    if farm_id not in FARMS_DB:
        farm = FARMS_DB["farm_default"]
    else:
        farm = FARMS_DB[farm_id]

    weather = get_weather_forecast(farm.get("location", "Coimbatore"))
    sustainability = calculate_sustainability_score()
    recs = generate_recommendations(farm)

    return {
        "farm_id": farm["id"],
        "analyzed_at": "Live Telemetry Pass",
        "weather": weather,
        "sustainability": sustainability,
        "recommendations": recs
    }

@app.post("/farms/{farm_id}/simulate")
def simulate_action(farm_id: str, payload: SimulationRequest):
    return run_simulation(payload.irrigation_liters)

@app.get("/farms/{farm_id}/recommendations")
def get_recommendations_endpoint(farm_id: str):
    farm = FARMS_DB.get(farm_id, FARMS_DB["farm_default"])
    return generate_recommendations(farm)

@app.get("/farms/{farm_id}/history")
def get_farm_history(farm_id: str):
    farm = FARMS_DB.get(farm_id, FARMS_DB["farm_default"])
    return farm.get("history", [])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
