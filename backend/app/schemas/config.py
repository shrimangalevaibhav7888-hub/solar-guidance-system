from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from datetime import datetime

class AssumptionItem(BaseModel):
    key: str
    value: float
    unit: Optional[str] = None
    category: str
    description: str
    updated_at: Optional[datetime] = None

class AssumptionUpdate(BaseModel):
    key: str
    value: float

class SystemConfigResponse(BaseModel):
    assumptions: List[AssumptionItem]
    state_tariffs: Dict[str, Dict[str, float]]
    subsidy_tiers: Dict[str, float]
    panel_options: List[Dict[str, Any]]
