# AGRO-TWIN
> **Predict. Simulate. Optimize. Sustain.**

AI-Powered Sustainable Farm Digital Twin & Agronomic Decision-Support Platform.

---

## 1. Project Overview

**AGRO-TWIN** is an enterprise-grade agricultural decision platform that creates a computational digital twin of agricultural fields. Unlike conventional platforms that only provide historical diagnostics or pest detection, AGRO-TWIN answers the fundamental question facing farmers and agronomists:

> **"What happens if I take this agricultural action?"**

Before committing expensive water, diesel, and fertilizer to the physical soil, a farm manager can run predictive "What-If" simulations to balance yield, water consumption, operational cost, and overall sustainability.

---

## 2. Core Innovation & Philosophy

```
Farm Telemetry & Soil Diagnostics
              ↓
      Digital Farm Twin
              ↓
     What-If Simulation (Hydrology + Crop Physics)
              ↓
  Multi-Objective Sustainability Optimization
              ↓
   Explainable Action Recommendations
              ↓
   Physical Field Execution & Audit Trail
```

- **Not an AI Demo**: Built strictly using the human-centered, minimal Stitch agronomy design system. No neon lights, no 3D robots, no pseudo-scientific claims.
- **Explainable Decisions**: Every recommendation provides **WHAT** action to take, **WHY** it is recommended, the **EXPECTED IMPACT** (cost, yield, water delta), and the computational **CONFIDENCE** score.
- **Privacy & User Isolation**: Each authenticated session isolates farm plots, telemetry, and action logs strictly to the user's profile.

---

## 3. Technology Stack

- **Frontend**: Stitch Agricultural Design System, Semantic HTML5, Tailwind CSS, Geist Typography, Material Symbols Outlined, Vanilla JS.
- **State & Logic**: Modular `AgroTwinState` engine with strict input validation, session persistence, and real-time agronomic formulas.
- **Backend API**: Python FastAPI (`backend/main.py`), Pydantic models, Uvicorn server, modular services for simulation, recommendations, weather, and sustainability.
- **Testing**: Automated test suite (`tests/test_agro_twin.js`) covering validation, dynamic profiles, session persistence, user data isolation, and simulation calculations.
- **Cloud Readiness**: Vercel (Frontend), Render (FastAPI Backend), Supabase PostgreSQL (Database & Row Level Security).

---

## 4. Key Features

1. **Clean User Onboarding & Dynamic Profile**:
   - Zero-friction onboarding requiring only **Full Name** and **Phone Number** (Indian 10-digit mobile with optional `+91`).
   - Human-readable input validation (`"Please enter your name."`, `"Please enter a valid 10-digit phone number."`).
   - Dynamic avatar with user initials (e.g., `RS` for Rahul Sharma, `PD` for Priya Das).
   - Dynamic greetings (`"Good morning, Rahul"`, `"Welcome back, Priya"`).
   - Profile dropdown displaying Full Name, Phone Number, Profile, Settings, and Sign out.
   - Clean session clearing on sign-out ensuring no data leakage between users.

2. **Interactive What-If Simulator (Core)**:
   - Dynamic irrigation volume slider (6 to 20 L/m²).
   - One-click presets: Standard Forecast (10 L/m²), Dry Spell Scenario (16 L/m²), Rainfall Delay (8 L/m²).
   - Real-time computation of:
     - Water Consumption (% vs baseline)
     - Expected Yield (% gain or deficit)
     - Operational Cost (pumping and energy delta in ₹)
     - Sustainability Score (0–100 index)
     - 24h Root-zone Soil Moisture saturation and risk classification (e.g. *Slight Waterlogging Risk*, *Moisture Deficit Warning*).
   - Multi-scenario comparison: compare simulated alternatives against baseline.

3. **Multi-Objective Sustainability Scoring**:
   - Configurable weighted agronomic equation:
     - **30%** Water Efficiency
     - **25%** Soil Health
     - **20%** Yield Efficiency
     - **15%** Resource / Carbon Impact
     - **10%** Crop Resilience

4. **Action Planner & Explainable Recommendations**:
   - Timeframes: **Today**, **This Week**, **This Season**.
   - Transparent rule justification linking weather forecasts (e.g., IMD 4mm rain forecast) with soil moisture levels.

5. **Farm Action History**:
   - Audit trail capturing user decisions, applied irrigation rates, variance impact, and sustainability score.

---

## 5. Directory Structure

```
stitch_agro_twin_farm_decision_platform/
├── index.html                    # Unified production SPA entry point
├── js/
│   ├── agroTwinState.js          # Core state, validation, storage, and simulation engine
│   └── agroTwinUI.js             # Dynamic profile, header avatar, dropdown & navigation
├── backend/
│   ├── main.py                   # FastAPI application entry point
│   ├── requirements.txt          # Python dependencies
│   └── services/
│       ├── simulation.py         # Agronomic hydrology & yield calculations
│       ├── recommendations.py    # Explainable recommendation engine
│       ├── sustainability.py     # 5-factor sustainability index formula
│       └── weather.py            # Meteorological station telemetry abstraction
├── tests/
│   └── test_agro_twin.js         # Automated test suite (6/6 tests passing)
├── stitch_agro_twin_farm_decision_platform/ # Source Stitch prototypes (preserved)
│   ├── agro_twin_sign_in_with_google/code.html
│   ├── agro_twin_farm_setup_first_time_user_experience/code.html
│   ├── farm_overview/code.html
│   ├── what_if_simulator/code.html
│   ├── farm_health/code.html
│   ├── my_farm/code.html
│   └── agro_twin_platform/DESIGN.md
├── .env.example
├── .gitignore
└── README.md
```

---

## 6. Local Setup & Commands to Run

### Option A: Run the Frontend Directly
The frontend requires no build steps or heavy node modules. Simply open `index.html` in any modern web browser or start a static server:

```powershell
# Using Python built-in HTTP server:
cd "D:\GEOIMPATON 1.0\stitch_agro_twin_farm_decision_platform"
python -m http.server 3000
```
Then navigate to: `http://localhost:3000`

### Option B: Run the Backend API (FastAPI)
```powershell
cd "D:\GEOIMPATON 1.0\stitch_agro_twin_farm_decision_platform\backend"
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Interactive API documentation: `http://localhost:8000/docs`

### Option C: Run Automated Tests
```powershell
cd "D:\GEOIMPATON 1.0\stitch_agro_twin_farm_decision_platform"
node tests/test_agro_twin.js
```

---

## 7. Database Schema (Supabase PostgreSQL Specification)

When provisioning production PostgreSQL on Supabase:

```sql
-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  first_name text not null,
  phone text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Farms table
create table farms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  location text not null,
  area numeric not null,
  primary_crop text not null,
  crop_variety text not null,
  planting_date date not null,
  soil_type text not null,
  irrigation_method text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table farms enable row level security;

create policy "Users can only access their own profile"
  on profiles for all
  using (auth.uid() = id);

create policy "Users can only access their own farms"
  on farms for all
  using (auth.uid() = user_id);
```

---

## 8. Verification & Demonstration Steps

To test the application end-to-end:

1. **Step 1 — New User Onboarding**:
   - Open `index.html`.
   - The minimal login screen displays:
     - Title: *Welcome to AGRO-TWIN*
     - Subtitle: *Your intelligent agricultural sustainability companion.*
   - Enter `Rahul Sharma` and `9876543210`. Click **Continue**.

2. **Step 2 — Dynamic Personalized Dashboard**:
   - Dashboard renders immediately.
   - Header shows initial badge `RS` and `Rahul`.
   - Greeting reads: `"Good morning, Rahul"`.
   - Click top-right avatar: dropdown opens showing `Rahul Sharma` and `9876543210`.

3. **Step 3 — Interactive What-If Simulator**:
   - Click **What-If Simulator** in sidebar.
   - Adjust irrigation slider from `10 L/m²` to `14 L/m²`.
   - Observe real-time matrix update:
     - Water Use: `140%` (`+40% Excessive`)
     - Operational Cost: `₹5,230` (`+₹230 Pumping`)
     - Sustainability Score: `74 / 100` (`-4 pts Runoff`)
     - Soil Moisture: `74%` (`Slight Waterlogging Risk`)
   - Click **Adopt Recommendation (12 L/m²)**: notice the action is appended to your Farm Action History.

4. **Step 4 — Refresh Persistence**:
   - Refresh the browser (F5).
   - User session remains intact; dashboard opens with `"Welcome back, Rahul"`.

5. **Step 5 — Complete Sign Out**:
   - Click top-right profile -> click **Sign out**.
   - Session terminates and returns to clean login screen.

6. **Step 6 — Multi-User Data Isolation**:
   - Enter `Priya Das` and `9123456780`. Click **Continue**.
   - Dashboard now greets: `"Good morning, Priya"`.
   - Top-right shows `PD` and `Priya`.
   - Profile displays `Priya Das` and `9123456780`.
   - Notice previous user Rahul's data is completely absent.
