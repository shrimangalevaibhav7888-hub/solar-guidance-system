from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List

class SchemeBase(BaseModel):
    scheme_name: str
    ministry: str
    state: str
    applicable_property_type: str
    description: str
    eligibility: str
    subsidy_type: str
    subsidy_amount: str
    subsidy_percentage: Optional[str] = None
    application_process: str
    required_documents: str
    official_url: str
    active_status: bool = True
    category: str = "Central"
    last_verified_date: str
    max_capacity_kw: float = 10.0
    min_capacity_kw: float = 1.0

class SchemeResponse(SchemeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class EligibilityCheckRequest(BaseModel):
    state: str = Field(..., description="Indian State, e.g. Maharashtra")
    property_type: str = Field(default="Home", description="Home, Shop, Institution")
    recommended_capacity_kw: float = Field(default=3.0, gt=0)
    has_active_grid_connection: bool = Field(default=True)
    has_roof_rights: bool = Field(default=True)
    consumer_category: Optional[str] = "Domestic/Residential"

class SchemeEligibilityMatch(BaseModel):
    scheme: SchemeResponse
    match_status: str # "ELIGIBLE", "POTENTIALLY_ELIGIBLE", "NOT_MATCHING"
    match_score: int # 0 to 100
    potential_subsidy_amount: float
    potential_subsidy_display: str
    reasons: List[str]
    missing_criteria: List[str]
    action_items: List[str]

class EligibilityCheckResponse(BaseModel):
    user_state: str
    property_type: str
    capacity_kw: float
    total_schemes_evaluated: int
    matching_schemes: List[SchemeEligibilityMatch]
    best_match_scheme_name: Optional[str] = None
    max_potential_subsidy: float = 0.0
    important_notice: str
