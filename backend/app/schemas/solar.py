from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class SolarCalculateRequest(BaseModel):
    user_id: Optional[int] = None
    input_type: str = Field(default="units", description="'units' or 'bill'")
    monthly_units: Optional[float] = Field(default=None, ge=0)
    monthly_bill: Optional[float] = Field(default=None, ge=0)
    tariff: Optional[float] = Field(default=None, gt=0)
    roof_area: float = Field(..., gt=0, description="Available roof area in sq. ft.")
    roof_type: str = Field(default="RCC", description="RCC, Metal, Tiled, Other")
    shading: str = Field(default="Low", description="Low, Medium, High")
    state: str = Field(default="Maharashtra")
    district: Optional[str] = "Pune"
    property_type: str = Field(default="Home", description="Home, Shop, Institution")

class CostBreakdown(BaseModel):
    solar_panels: float
    inverter: float
    mounting_structure: float
    electrical_and_bos: float
    installation_and_netmetering: float
    total_gross_cost: float

class YearlySavingsItem(BaseModel):
    year: int
    tariff_rate: float
    annual_generation_kwh: float
    annual_savings: float
    cumulative_savings: float
    net_system_cost: float
    net_benefit: float

class SolarCalculateResponse(BaseModel):
    # Electricity stats
    monthly_units_consumed: float
    annual_consumption_kwh: float
    estimated_tariff_rate: float
    tariff_source: str
    
    # Solar engineering recommendation
    recommended_capacity_kw: float
    exact_capacity_needed_kw: float
    panel_count: int
    panel_wattage_w: int
    annual_generation_kwh: float
    monthly_generation_kwh: float
    daily_average_generation_kwh: float
    
    # Roof analytics
    roof_area_available_sqft: float
    roof_area_required_sqft: float
    roof_utilization_pct: float
    roof_constraint_applied: bool
    shading_factor_applied: float
    
    # Financial summary
    gross_cost: float
    potential_subsidy: float
    net_cost: float
    annual_savings: float
    monthly_savings: float
    payback_period_years: float
    roi_25yr_pct: float
    cost_breakdown: CostBreakdown
    
    # Environmental metrics
    co2_avoided_annual_kg: float
    co2_avoided_25yr_kg: float
    trees_equivalent_annual: float
    coal_saved_annual_kg: float
    petrol_car_km_offset_annual: float
    
    # Explanation and assumptions
    recommendation_rationale: str
    assumptions_used: Dict[str, str]
    disclaimer: str
    
    # DB references if saved
    assessment_id: Optional[int] = None
    calculation_id: Optional[int] = None

class QuickCalculateRequest(BaseModel):
    monthly_bill: Optional[float] = None
    monthly_units: Optional[float] = None
    state: str = "Maharashtra"
    roof_area: Optional[float] = 500

class QuickCalculateResponse(BaseModel):
    capacity_kw: float
    panels: int
    gross_cost: float
    subsidy: float
    net_cost: float
    annual_savings: float
    payback_years: float
    co2_avoided_kg: float
