from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.database.models import SystemAssumption
from app.schemas.config import SystemConfigResponse, AssumptionItem, AssumptionUpdate
from app.config import settings, STATE_TARIFF_AND_INSOLATION

router = APIRouter(prefix="/config", tags=["System Configuration & Assumptions"])

@router.get("/assumptions")
def get_system_assumptions(db: Session = Depends(get_db)):
    assumptions = db.query(SystemAssumption).all()
    
    panel_options = [
        {"name": "550W Mono PERC Half-Cut", "wattage": 550, "efficiency": "21.5%", "tier": "Tier 1 ALMM", "tech": "P-Type Mono"},
        {"name": "575W TOPCon N-Type Bifacial", "wattage": 575, "efficiency": "22.3%", "tier": "Tier 1 ALMM", "tech": "N-Type TOPCon"},
        {"name": "450W Monocrystalline Standard", "wattage": 450, "efficiency": "20.2%", "tier": "Standard", "tech": "Mono Crystalline"}
    ]

    subsidy_tiers = {
        "1 kW Central CFA": settings.PM_SURYA_GHAR_1KW_SUBSIDY,
        "2 kW Central CFA": settings.PM_SURYA_GHAR_2KW_SUBSIDY,
        "3 kW+ Central CFA (Max Cap)": settings.PM_SURYA_GHAR_3KW_MAX_SUBSIDY,
        "Special State 1 kW CFA": settings.PM_SURYA_GHAR_SPECIAL_1KW_SUBSIDY,
        "Special State 2 kW CFA": settings.PM_SURYA_GHAR_SPECIAL_2KW_SUBSIDY,
        "Special State 3 kW+ CFA (Max Cap)": settings.PM_SURYA_GHAR_SPECIAL_3KW_MAX_SUBSIDY
    }

    return {
        "assumptions": [
            {
                "key": a.key,
                "value": a.value,
                "unit": a.unit,
                "category": a.category,
                "description": a.description,
                "updated_at": a.updated_at
            }
            for a in assumptions
        ],
        "state_tariffs": STATE_TARIFF_AND_INSOLATION,
        "subsidy_tiers": subsidy_tiers,
        "panel_options": panel_options
    }

@router.post("/assumptions/update")
def update_assumption(req: AssumptionUpdate, db: Session = Depends(get_db)):
    assump = db.query(SystemAssumption).filter(SystemAssumption.key == req.key).first()
    if not assump:
        raise HTTPException(status_code=404, detail=f"Assumption '{req.key}' not found.")
    
    assump.value = req.value
    db.commit()
    db.refresh(assump)

    setting_map = {
        "panel_wattage_w": "DEFAULT_PANEL_WATTAGE",
        "generation_factor_kwh_per_kwp_day": "DEFAULT_GENERATION_FACTOR",
        "annual_generation_per_kwp": "ANNUAL_GENERATION_PER_KW",
        "system_performance_ratio": "DEFAULT_PERFORMANCE_RATIO",
        "roof_area_sqft_per_kwp": "DEFAULT_ROOF_AREA_PER_KW_SQFT",
        "base_cost_per_kw_1to2kw": "BASE_COST_PER_KW_1TO2",
        "base_cost_per_kw_3to5kw": "BASE_COST_PER_KW_3TO5",
        "base_cost_per_kw_6plus": "BASE_COST_PER_KW_6PLUS",
        "grid_emission_factor": "GRID_EMISSION_FACTOR",
        "trees_equivalent_factor": "TREES_EQUIVALENT_FACTOR",
        "default_electricity_tariff": "DEFAULT_TARIFF_RATE",
        "annual_tariff_inflation": "ANNUAL_TARIFF_ESCALATION",
        "panel_annual_degradation": "ANNUAL_PANEL_DEGRADATION"
    }
    if req.key in setting_map and hasattr(settings, setting_map[req.key]):
        setattr(settings, setting_map[req.key], req.value)

    return {"message": f"Updated {req.key} to {req.value}", "assumption": assump.key, "value": assump.value}
