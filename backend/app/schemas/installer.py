from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class InstallerBase(BaseModel):
    name: str
    state: str
    district: str
    city: str
    contact: str
    phone: str
    email: Optional[str] = None
    website: Optional[str] = None
    service_area: str
    authorised_status: str
    verification_source: str
    rating: float
    completed_projects: int
    is_demo: bool = True
    last_verified_date: str

class InstallerResponse(InstallerBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class InstallerListResponse(BaseModel):
    total: int
    installers: List[InstallerResponse]
    states_available: List[str]
    filter_state: Optional[str] = None
