from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Dict, List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "SolarSahayak"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "solarsahayak-secret-key-energy-tech-india-2026-prod-demo"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./solarsahayak.db")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]
    
    # Centralized Solar Engineering & Financial Defaults
    DEFAULT_PANEL_WATTAGE: int = 550  # Watts (High-efficiency Mono PERC Half-Cut)
    DEFAULT_GENERATION_FACTOR: float = 4.0  # Daily kWh per kWp installed
    ANNUAL_GENERATION_PER_KW: float = 1460.0  # kWh / kWp / year (4.0 * 365)
    DEFAULT_PERFORMANCE_RATIO: float = 0.80  # 80% system performance ratio
    DEFAULT_ROOF_AREA_PER_KW_SQFT: float = 80.0  # sq. ft. per kWp
    
    # Base Costing (₹/kWp installed turnkey rooftop)
    BASE_COST_PER_KW_1TO2: float = 65000.0   # ₹65,000 / kW for 1-2 kW systems
    BASE_COST_PER_KW_3TO5: float = 55000.0   # ₹55,000 / kW for 3-5 kW systems
    BASE_COST_PER_KW_6PLUS: float = 50000.0  # ₹50,000 / kW for >5 kW systems
    
    # BOM breakdown percentages
    COST_SPLIT_PANELS: float = 0.45      # 45% Solar Panels
    COST_SPLIT_INVERTER: float = 0.20    # 20% Inverter & Smart Monitoring
    COST_SPLIT_STRUCTURE: float = 0.15   # 15% HDG / Aluminium Mounting Structure
    COST_SPLIT_ELECTRICAL: float = 0.10  # 10% Cables, AC/DC DB, Earthing & Lightning
    COST_SPLIT_LABOUR_NETMETER: float = 0.10 # 10% Installation, DISCOM approvals, Net Metering
    
    # Electricity Tariffs & Financials (₹/kWh)
    DEFAULT_TARIFF_RATE: float = 7.50   # ₹7.50/unit baseline residential average in India
    ANNUAL_TARIFF_ESCALATION: float = 0.04 # 4% expected yearly tariff inflation
    ANNUAL_PANEL_DEGRADATION: float = 0.007 # 0.7% degradation per year (Tier 1 warranty standard)
    FINANCIAL_SYSTEM_LIFETIME_YEARS: int = 25 # Standard solar module warranty lifecycle
    
    # Environmental Metrics
    GRID_EMISSION_FACTOR: float = 0.82  # kg CO2 / kWh generated (CEA India grid average benchmark)
    TREES_EQUIVALENT_FACTOR: float = 45.0 # ~45 mature trees equivalent per 1000 kg CO2 absorbed annually
    COAL_SAVED_PER_KWH: float = 0.45    # kg of thermal coal saved per kWh solar
    PETROL_CAR_KM_PER_KG_CO2: float = 6.0 # ~6 km driven in average petrol car per kg CO2
    
    # PM Surya Ghar: Muft Bijli Yojana Central Financial Assistance (CFA) Rules
    # Standard States:
    # 1 kW: ₹30,000
    # 2 kW: ₹60,000
    # 3 kW and above: ₹78,000 max
    PM_SURYA_GHAR_1KW_SUBSIDY: float = 30000.0
    PM_SURYA_GHAR_2KW_SUBSIDY: float = 60000.0
    PM_SURYA_GHAR_3KW_MAX_SUBSIDY: float = 78000.0
    
    # Special Category States (North Eastern, Uttarakhand, HP, J&K, Ladakh, Islands):
    PM_SURYA_GHAR_SPECIAL_1KW_SUBSIDY: float = 33000.0
    PM_SURYA_GHAR_SPECIAL_2KW_SUBSIDY: float = 66000.0
    PM_SURYA_GHAR_SPECIAL_3KW_MAX_SUBSIDY: float = 85800.0

    model_config = SettingsConfigDict(case_sensitive=True, extra="ignore")

settings = Settings()

# State-wise average tariffs and solar insolation multipliers for high precision
STATE_TARIFF_AND_INSOLATION: Dict[str, Dict[str, float]] = {
    "Maharashtra": {"tariff": 8.20, "insolation_factor": 1.02, "special_state": 0},
    "Gujarat": {"tariff": 6.80, "insolation_factor": 1.08, "special_state": 0},
    "Delhi": {"tariff": 7.00, "insolation_factor": 0.98, "special_state": 0},
    "Karnataka": {"tariff": 7.90, "insolation_factor": 1.04, "special_state": 0},
    "Tamil Nadu": {"tariff": 6.90, "insolation_factor": 1.05, "special_state": 0},
    "Uttar Pradesh": {"tariff": 7.40, "insolation_factor": 0.99, "special_state": 0},
    "Rajasthan": {"tariff": 7.60, "insolation_factor": 1.12, "special_state": 0},
    "Kerala": {"tariff": 7.10, "insolation_factor": 0.96, "special_state": 0},
    "Telangana": {"tariff": 7.30, "insolation_factor": 1.03, "special_state": 0},
    "Andhra Pradesh": {"tariff": 7.20, "insolation_factor": 1.04, "special_state": 0},
    "West Bengal": {"tariff": 7.80, "insolation_factor": 0.95, "special_state": 0},
    "Punjab": {"tariff": 6.50, "insolation_factor": 1.00, "special_state": 0},
    "Haryana": {"tariff": 7.10, "insolation_factor": 1.01, "special_state": 0},
    "Madhya Pradesh": {"tariff": 7.50, "insolation_factor": 1.06, "special_state": 0},
    "Bihar": {"tariff": 7.30, "insolation_factor": 0.97, "special_state": 0},
    "Odisha": {"tariff": 6.40, "insolation_factor": 0.99, "special_state": 0},
    "Himachal Pradesh": {"tariff": 5.80, "insolation_factor": 0.95, "special_state": 1},
    "Uttarakhand": {"tariff": 5.90, "insolation_factor": 0.96, "special_state": 1},
    "Jammu and Kashmir": {"tariff": 5.20, "insolation_factor": 0.96, "special_state": 1},
    "Assam": {"tariff": 7.10, "insolation_factor": 0.90, "special_state": 1},
    "Goa": {"tariff": 5.40, "insolation_factor": 1.02, "special_state": 0},
}
