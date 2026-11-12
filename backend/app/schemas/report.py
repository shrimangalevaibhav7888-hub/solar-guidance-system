from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime

class ReportGenerateRequest(BaseModel):
    user_id: Optional[int] = None
    user_name: Optional[str] = "Valued Solar Planner"
    email: Optional[str] = "citizen@solarsahayak.gov.in"
    mobile: Optional[str] = "9876543210"
    state: str = "Maharashtra"
    district: Optional[str] = "Pune"
    property_type: str = "Home"
    monthly_units: float = 300.0
    monthly_bill: float = 2460.0
    roof_area: float = 500.0
    roof_type: str = "RCC"
    shading: str = "Low"
    recommended_capacity_kw: float = 3.3
    panel_count: int = 6
    annual_generation_kwh: float = 4818.0
    gross_cost: float = 181500.0
    subsidy_amount: float = 78000.0
    net_cost: float = 103500.0
    annual_savings: float = 39507.0
    payback_years: float = 2.6
    co2_avoided_kg: float = 3950.0

class ReportResponse(BaseModel):
    report_code: str
    created_at: datetime
    user_info: Dict[str, Any]
    electricity_profile: Dict[str, Any]
    solar_recommendation: Dict[str, Any]
    financial_analysis: Dict[str, Any]
    scheme_guidance: List[Dict[str, Any]]
    environmental_impact: Dict[str, Any]
    installation_roadmap: List[Dict[str, Any]]
    assumptions: Dict[str, str]
    disclaimer: str

    model_config = ConfigDict(from_attributes=True)
