from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
import io
from app.database.session import get_db
from app.database.models import SolarReport
from app.schemas.report import ReportGenerateRequest
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Personalized Solar Reports"])

@router.post("/generate")
def generate_report(req: ReportGenerateRequest, db: Session = Depends(get_db)):
    return ReportService.generate_full_report(db=db, payload=req.model_dump())

@router.get("/user/{user_id}")
def get_user_reports(user_id: int, db: Session = Depends(get_db)):
    reports = db.query(SolarReport).filter(SolarReport.user_id == user_id).order_by(SolarReport.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "report_code": r.report_code,
            "created_at": r.created_at,
            "capacity_kw": r.report_data.get("solar_recommendation", {}).get("recommended_capacity_kw"),
            "net_cost": r.report_data.get("financial_analysis", {}).get("net_cost"),
            "annual_savings": r.report_data.get("financial_analysis", {}).get("year_1_savings")
        }
        for r in reports
    ]

@router.get("/{code_or_id}")
def get_report(code_or_id: str, db: Session = Depends(get_db)):
    # Try by code
    report = db.query(SolarReport).filter(SolarReport.report_code == code_or_id).first()
    if not report and code_or_id.isdigit():
        report = db.query(SolarReport).filter(SolarReport.id == int(code_or_id)).first()

    if not report:
        raise HTTPException(status_code=404, detail="Solar assessment report not found.")

    return report.report_data
