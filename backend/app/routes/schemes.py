from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.database.models import Scheme
from app.schemas.scheme import SchemeResponse, EligibilityCheckRequest, EligibilityCheckResponse
from app.services.scheme_service import SchemeService

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

@router.get("", response_model=List[SchemeResponse])
def get_schemes(
    state: Optional[str] = None,
    property_type: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Scheme).filter(Scheme.active_status == True)
    
    if state and state.strip().lower() not in ["all", "all india"]:
        st = state.strip()
        query = query.filter((Scheme.state == "All India") | (Scheme.state.ilike(f"%{st}%")))

    if property_type and property_type.strip().lower() != "all":
        pt = property_type.strip()
        query = query.filter(Scheme.applicable_property_type.ilike(f"%{pt}%"))

    if category and category.strip().lower() != "all":
        cat = category.strip()
        query = query.filter(Scheme.category.ilike(f"%{cat}%"))

    return [SchemeResponse.model_validate(s) for s in query.all()]

@router.get("/{scheme_id}", response_model=SchemeResponse)
def get_scheme_by_id(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Government scheme not found.")
    return SchemeResponse.model_validate(scheme)

@router.post("/check-eligibility", response_model=EligibilityCheckResponse)
def check_eligibility(req: EligibilityCheckRequest, db: Session = Depends(get_db)):
    return SchemeService.evaluate_eligibility(
        db=db,
        state=req.state,
        property_type=req.property_type,
        capacity_kw=req.recommended_capacity_kw,
        has_active_grid_connection=req.has_active_grid_connection,
        has_roof_rights=req.has_roof_rights,
        consumer_category=req.consumer_category
    )
