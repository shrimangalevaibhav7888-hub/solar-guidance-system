from app.schemas.user import UserRegister, UserLogin, UserResponse, Token
from app.schemas.solar import (
    SolarCalculateRequest,
    SolarCalculateResponse,
    QuickCalculateRequest,
    QuickCalculateResponse,
    CostBreakdown,
    YearlySavingsItem
)
from app.schemas.scheme import (
    SchemeBase,
    SchemeResponse,
    EligibilityCheckRequest,
    EligibilityCheckResponse,
    SchemeEligibilityMatch
)
from app.schemas.installer import InstallerBase, InstallerResponse, InstallerListResponse
from app.schemas.report import ReportGenerateRequest, ReportResponse
from app.schemas.config import AssumptionItem, AssumptionUpdate, SystemConfigResponse
