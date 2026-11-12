import uuid
import json
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import SolarReport, User
from app.calculators.solar_engine import SolarEngine
from app.calculators.cost_engine import CostEngine
from app.calculators.savings_engine import SavingsEngine
from app.calculators.environment_engine import EnvironmentEngine
from app.services.scheme_service import SchemeService

class ReportService:
    @staticmethod
    def generate_full_report(
        db: Session,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Creates a comprehensive, high-fidelity personalized solar report object,
        persisting it in the database and returning structured report sections.
        """
        user_name = payload.get("user_name") or "Solar Citizen"
        email = payload.get("email") or "citizen@solarsahayak.gov.in"
        mobile = payload.get("mobile") or "9876543210"
        state = payload.get("state") or "Maharashtra"
        district = payload.get("district") or "Pune"
        property_type = payload.get("property_type") or "Home"
        user_id = payload.get("user_id")

        monthly_units = float(payload.get("monthly_units") or 300.0)
        monthly_bill = float(payload.get("monthly_bill") or (monthly_units * 8.2))
        roof_area = float(payload.get("roof_area") or 500.0)
        roof_type = payload.get("roof_type") or "RCC"
        shading = payload.get("shading") or "Low"

        # 1. Run Engineering Engine
        solar_res = SolarEngine.calculate(
            input_type="units",
            monthly_units=monthly_units,
            monthly_bill=monthly_bill,
            roof_area=roof_area,
            roof_type=roof_type,
            shading=shading,
            state=state,
            property_type=property_type
        )

        cap_kw = solar_res["recommended_capacity_kw"]

        # 2. Run Cost & Subsidy Engine
        cost_res = CostEngine.calculate_cost(
            capacity_kw=cap_kw,
            property_type=property_type,
            state=state
        )

        # 3. Run Savings Engine
        savings_res = SavingsEngine.calculate_savings(
            annual_generation_kwh=solar_res["annual_generation_kwh"],
            net_system_cost=cost_res["net_cost"],
            tariff_rate=solar_res["estimated_tariff_rate"]
        )

        # 4. Run Environmental Engine
        env_res = EnvironmentEngine.calculate_impact(
            annual_generation_kwh=solar_res["annual_generation_kwh"]
        )

        # 5. Run Scheme Engine
        scheme_eval = SchemeService.evaluate_eligibility(
            db=db,
            state=state,
            property_type=property_type,
            capacity_kw=cap_kw
        )

        # 6. Installation 10-Step Roadmap
        roadmap = [
            {
                "step": 1,
                "title": "Solar Requirement Assessment",
                "stage": "Planning",
                "description": "Completed via SolarSahayak. Your verified capacity requirement is calculated.",
                "duration": "Day 1",
                "docs_needed": "Latest 3 months electricity bills"
            },
            {
                "step": 2,
                "title": "National Portal Registration",
                "stage": "Scheme Application",
                "description": "Register on pmsuryaghar.gov.in using your electricity consumer account number.",
                "duration": "Day 2-3",
                "docs_needed": "Aadhaar card, Electricity bill, Bank passbook"
            },
            {
                "step": 3,
                "title": "DISCOM Technical Feasibility Approval",
                "stage": "Approval",
                "description": "State power distribution utility verifies local transformer capacity and issues NOC.",
                "duration": "Day 4-10",
                "docs_needed": "Sanctioned load certificate, Roof property tax receipt"
            },
            {
                "step": 4,
                "title": "Empanelled Installer Selection",
                "stage": "Procurement",
                "description": "Choose a DISCOM-empanelled solar vendor from the National Portal directory.",
                "duration": "Day 11-14",
                "docs_needed": "Vendor quotation & ALMM module certificate"
            },
            {
                "step": 5,
                "title": "Detailed Site Survey & Engineering Design",
                "stage": "Engineering",
                "description": "Vendor inspects roof azimuth, structural strength, earthing pit locations, and cable routing.",
                "duration": "Day 15-18",
                "docs_needed": "Single Line Diagram (SLD) & layout approval"
            },
            {
                "step": 6,
                "title": "Hardware Procurement & On-site Installation",
                "stage": "Installation",
                "description": "Installation of hot-dip galvanized mounting structures, 550W panels, inverter, and AC/DC protection boxes.",
                "duration": "Day 19-24",
                "docs_needed": "DCR (Domestic Content Requirement) module serial certificates"
            },
            {
                "step": 7,
                "title": "Vendor Work Completion Submission",
                "stage": "Documentation",
                "description": "Installer submits work completion report, module serial photos, and geo-tagged site images.",
                "duration": "Day 25-27",
                "docs_needed": "Joint inspection report & safety certificate"
            },
            {
                "step": 8,
                "title": "DISCOM Site Inspection & Verification",
                "stage": "Quality Check",
                "description": "DISCOM junior engineer inspects earthing resistance (<5 ohms) and anti-islanding inverter protection.",
                "duration": "Day 28-35",
                "docs_needed": "Earthing test report"
            },
            {
                "step": 9,
                "title": "Bi-directional Net Meter Installation",
                "stage": "Commissioning",
                "description": "DISCOM replaces existing meter with a smart bi-directional net meter to track solar export/import.",
                "duration": "Day 36-42",
                "docs_needed": "Meter testing certificate"
            },
            {
                "step": 10,
                "title": "Commissioning Certificate & Direct Subsidy Disbursal",
                "stage": "Subsidy DBT",
                "description": "National Portal issues Commissioning Certificate. Central subsidy is credited directly to your bank account.",
                "duration": "Within 30 Days post-commissioning",
                "docs_needed": "Cancelled cheque matching applicant name"
            }
        ]

        report_code = f"SS-{state[:2].upper()}-{datetime.utcnow().strftime('%y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

        report_data = {
            "report_code": report_code,
            "created_at": datetime.utcnow().isoformat(),
            "user_info": {
                "name": user_name,
                "email": email,
                "mobile": mobile,
                "state": state,
                "district": district,
                "property_type": property_type
            },
            "electricity_profile": {
                "monthly_units": monthly_units,
                "monthly_bill": monthly_bill,
                "annual_consumption_kwh": solar_res["annual_consumption_kwh"],
                "tariff_rate": solar_res["estimated_tariff_rate"],
                "tariff_source": solar_res["tariff_source"]
            },
            "solar_recommendation": {
                "recommended_capacity_kw": cap_kw,
                "panel_count": solar_res["panel_count"],
                "panel_wattage_w": solar_res["panel_wattage_w"],
                "annual_generation_kwh": solar_res["annual_generation_kwh"],
                "monthly_generation_kwh": solar_res["monthly_generation_kwh"],
                "daily_average_generation_kwh": solar_res["daily_average_generation_kwh"],
                "roof_area_available_sqft": roof_area,
                "roof_area_required_sqft": solar_res["roof_area_required_sqft"],
                "roof_utilization_pct": solar_res["roof_utilization_pct"],
                "roof_constraint_applied": solar_res["roof_constraint_applied"],
                "shading_factor_applied": solar_res["shading_factor_applied"],
                "rationale": solar_res["recommendation_rationale"]
            },
            "financial_analysis": {
                "gross_cost": cost_res["total_gross_cost"],
                "potential_subsidy": cost_res["potential_subsidy"],
                "net_cost": cost_res["net_cost"],
                "cost_breakdown": cost_res["breakdown"],
                "financing": cost_res["financing_estimate"],
                "year_1_savings": savings_res["year_1_savings"],
                "monthly_avg_savings": savings_res["monthly_avg_savings"],
                "simple_payback_years": savings_res["simple_payback_years"],
                "exact_breakeven_year": savings_res["exact_breakeven_year"],
                "total_10yr_savings": savings_res["total_10yr_savings"],
                "total_25yr_savings": savings_res["total_25yr_savings"],
                "net_lifetime_profit": savings_res["net_lifetime_profit"],
                "roi_25yr_pct": savings_res["roi_25yr_pct"],
                "projections_10yr": savings_res["projections_10yr"]
            },
            "scheme_guidance": [
                {
                    "scheme_name": m.scheme.scheme_name,
                    "ministry": m.scheme.ministry,
                    "match_status": m.match_status,
                    "potential_subsidy_display": m.potential_subsidy_display,
                    "potential_subsidy_amount": m.potential_subsidy_amount,
                    "reasons": m.reasons,
                    "required_documents": m.scheme.required_documents,
                    "official_url": m.scheme.official_url,
                    "last_verified_date": m.scheme.last_verified_date
                }
                for m in scheme_eval.matching_schemes[:3]
            ],
            "environmental_impact": env_res,
            "installation_roadmap": roadmap,
            "assumptions": solar_res["assumptions_used"],
            "disclaimer": (
                "This report is generated by SolarSahayak for guidance and techno-commercial planning purposes. "
                "Actual system generation, turnkey pricing, subsidy eligibility, DISCOM approvals, and financial returns "
                "depend on site-specific shading, approved DISCOM vendor rates, ALMM module availability, and current state/central regulatory rules. "
                "Always verify latest scheme guidelines on pmsuryaghar.gov.in before executing agreements."
            )
        }

        # Save to database
        try:
            valid_user_id = user_id if (user_id and db.query(User).filter(User.id == user_id).first()) else None
            db_report = SolarReport(
                user_id=valid_user_id,
                report_code=report_code,
                report_data=report_data
            )
            db.add(db_report)
            db.commit()
            db.refresh(db_report)
        except Exception:
            db.rollback()

        return report_data
