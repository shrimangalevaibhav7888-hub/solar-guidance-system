from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.database.models import User, ElectricityProfile, SolarAssessment, Calculation
from app.schemas.solar import (
    SolarCalculateRequest,
    SolarCalculateResponse,
    QuickCalculateRequest,
    QuickCalculateResponse,
    CostBreakdown
)
from app.calculators.solar_engine import SolarEngine
from app.calculators.cost_engine import CostEngine
from app.calculators.savings_engine import SavingsEngine
from app.calculators.environment_engine import EnvironmentEngine

router = APIRouter(prefix="/solar", tags=["Solar Calculations"])

@router.post("/calculate", response_model=SolarCalculateResponse)
def calculate_solar(req: SolarCalculateRequest, db: Session = Depends(get_db)):
    try:
        # 1. Engineering Sizing
        solar_res = SolarEngine.calculate(
            input_type=req.input_type,
            monthly_units=req.monthly_units,
            monthly_bill=req.monthly_bill,
            tariff=req.tariff,
            roof_area=req.roof_area,
            roof_type=req.roof_type,
            shading=req.shading,
            state=req.state,
            property_type=req.property_type
        )

        cap_kw = solar_res["recommended_capacity_kw"]

        # 2. Cost & Subsidy
        cost_res = CostEngine.calculate_cost(
            capacity_kw=cap_kw,
            property_type=req.property_type,
            state=req.state
        )

        # 3. Savings & Financials
        savings_res = SavingsEngine.calculate_savings(
            annual_generation_kwh=solar_res["annual_generation_kwh"],
            net_system_cost=cost_res["net_cost"],
            tariff_rate=solar_res["estimated_tariff_rate"]
        )

        # 4. Environmental Impact
        env_res = EnvironmentEngine.calculate_impact(
            annual_generation_kwh=solar_res["annual_generation_kwh"]
        )

        # 5. Persist to DB if user_id is provided and valid
        assessment_id = None
        calculation_id = None

        if req.user_id:
            user = db.query(User).filter(User.id == req.user_id).first()
            if user:
                try:
                    # Create Electricity Profile record
                    elec = ElectricityProfile(
                        user_id=user.id,
                        monthly_units=solar_res["monthly_units_consumed"],
                        monthly_bill=req.monthly_bill or (solar_res["monthly_units_consumed"] * solar_res["estimated_tariff_rate"]),
                        tariff=solar_res["estimated_tariff_rate"],
                        annual_consumption=solar_res["annual_consumption_kwh"],
                        calculation_mode=req.input_type
                    )
                    db.add(elec)
                    db.commit()
                    db.refresh(elec)

                    # Create Solar Assessment record
                    assessment = SolarAssessment(
                        user_id=user.id,
                        roof_area=req.roof_area,
                        roof_type=req.roof_type,
                        shading=req.shading,
                        recommended_capacity=cap_kw,
                        panel_count=solar_res["panel_count"],
                        panel_wattage=solar_res["panel_wattage_w"],
                        annual_generation=solar_res["annual_generation_kwh"],
                        monthly_generation=solar_res["monthly_generation_kwh"],
                        roof_required_sqft=solar_res["roof_area_required_sqft"],
                        roof_utilization_pct=solar_res["roof_utilization_pct"],
                        state=req.state,
                        district=req.district
                    )
                    db.add(assessment)
                    db.commit()
                    db.refresh(assessment)
                    assessment_id = assessment.id

                    # Create Calculation record
                    calc = Calculation(
                        user_id=user.id,
                        assessment_id=assessment.id,
                        system_cost=cost_res["total_gross_cost"],
                        subsidy=cost_res["potential_subsidy"],
                        net_cost=cost_res["net_cost"],
                        annual_savings=savings_res["year_1_savings"],
                        monthly_savings=savings_res["monthly_avg_savings"],
                        payback_period=savings_res["simple_payback_years"],
                        co2_avoided=env_res["co2_avoided_annual_kg"],
                        co2_avoided_25yr=env_res["co2_avoided_lifetime_kg"],
                        trees_equivalent=env_res["trees_equivalent_annual"],
                        coal_saved_kg=env_res["coal_saved_annual_kg"]
                    )
                    db.add(calc)
                    db.commit()
                    db.refresh(calc)
                    calculation_id = calc.id
                except Exception:
                    db.rollback()

        return SolarCalculateResponse(
            monthly_units_consumed=solar_res["monthly_units_consumed"],
            annual_consumption_kwh=solar_res["annual_consumption_kwh"],
            estimated_tariff_rate=solar_res["estimated_tariff_rate"],
            tariff_source=solar_res["tariff_source"],
            recommended_capacity_kw=cap_kw,
            exact_capacity_needed_kw=solar_res["exact_capacity_needed_kw"],
            panel_count=solar_res["panel_count"],
            panel_wattage_w=solar_res["panel_wattage_w"],
            annual_generation_kwh=solar_res["annual_generation_kwh"],
            monthly_generation_kwh=solar_res["monthly_generation_kwh"],
            daily_average_generation_kwh=solar_res["daily_average_generation_kwh"],
            roof_area_available_sqft=solar_res["roof_area_available_sqft"],
            roof_area_required_sqft=solar_res["roof_area_required_sqft"],
            roof_utilization_pct=solar_res["roof_utilization_pct"],
            roof_constraint_applied=solar_res["roof_constraint_applied"],
            shading_factor_applied=solar_res["shading_factor_applied"],
            gross_cost=cost_res["total_gross_cost"],
            potential_subsidy=cost_res["potential_subsidy"],
            net_cost=cost_res["net_cost"],
            annual_savings=savings_res["year_1_savings"],
            monthly_savings=savings_res["monthly_avg_savings"],
            payback_period_years=savings_res["simple_payback_years"],
            roi_25yr_pct=savings_res["roi_25yr_pct"],
            cost_breakdown=CostBreakdown(
                solar_panels=cost_res["breakdown"]["solar_panels"],
                inverter=cost_res["breakdown"]["inverter"],
                mounting_structure=cost_res["breakdown"]["mounting_structure"],
                electrical_and_bos=cost_res["breakdown"]["electrical_and_bos"],
                installation_and_netmetering=cost_res["breakdown"]["installation_and_netmetering"],
                total_gross_cost=cost_res["breakdown"]["total_gross_cost"]
            ),
            co2_avoided_annual_kg=env_res["co2_avoided_annual_kg"],
            co2_avoided_25yr_kg=env_res["co2_avoided_lifetime_kg"],
            trees_equivalent_annual=env_res["trees_equivalent_annual"],
            coal_saved_annual_kg=env_res["coal_saved_annual_kg"],
            petrol_car_km_offset_annual=env_res["petrol_car_km_offset_annual"],
            recommendation_rationale=solar_res["recommendation_rationale"],
            assumptions_used=solar_res["assumptions_used"],
            disclaimer="This is an estimate for planning purposes. Actual generation, installation cost, subsidy, savings, eligibility and payback may vary.",
            assessment_id=assessment_id,
            calculation_id=calculation_id
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"We couldn't calculate your solar requirement. Please verify your inputs ({str(e)})."
        )

@router.post("/quick-calculate", response_model=QuickCalculateResponse)
def quick_calculate(req: QuickCalculateRequest):
    solar_res = SolarEngine.calculate(
        input_type="bill" if req.monthly_bill else "units",
        monthly_units=req.monthly_units,
        monthly_bill=req.monthly_bill,
        roof_area=req.roof_area or 500.0,
        state=req.state
    )
    cap_kw = solar_res["recommended_capacity_kw"]
    cost_res = CostEngine.calculate_cost(capacity_kw=cap_kw, state=req.state)
    savings_res = SavingsEngine.calculate_savings(
        annual_generation_kwh=solar_res["annual_generation_kwh"],
        net_system_cost=cost_res["net_cost"],
        tariff_rate=solar_res["estimated_tariff_rate"]
    )
    env_res = EnvironmentEngine.calculate_impact(annual_generation_kwh=solar_res["annual_generation_kwh"])

    return QuickCalculateResponse(
        capacity_kw=cap_kw,
        panels=solar_res["panel_count"],
        gross_cost=cost_res["total_gross_cost"],
        subsidy=cost_res["potential_subsidy"],
        net_cost=cost_res["net_cost"],
        annual_savings=savings_res["year_1_savings"],
        payback_years=savings_res["simple_payback_years"],
        co2_avoided_kg=env_res["co2_avoided_annual_kg"]
    )

@router.get("/latest/{user_id}")
def get_latest_user_assessment(user_id: int, db: Session = Depends(get_db)):
    assessment = db.query(SolarAssessment).filter(SolarAssessment.user_id == user_id).order_by(SolarAssessment.created_at.desc()).first()
    if not assessment:
        return {"has_assessment": False}

    calc = db.query(Calculation).filter(Calculation.assessment_id == assessment.id).first()
    return {
        "has_assessment": True,
        "recommended_capacity_kw": assessment.recommended_capacity,
        "panel_count": assessment.panel_count,
        "annual_generation_kwh": assessment.annual_generation,
        "monthly_generation_kwh": assessment.monthly_generation,
        "roof_area_sqft": assessment.roof_area,
        "roof_utilization_pct": assessment.roof_utilization_pct,
        "system_cost": calc.system_cost if calc else 0,
        "subsidy": calc.subsidy if calc else 0,
        "net_cost": calc.net_cost if calc else 0,
        "annual_savings": calc.annual_savings if calc else 0,
        "payback_period": calc.payback_period if calc else 0,
        "co2_avoided": calc.co2_avoided if calc else 0,
        "created_at": assessment.created_at
    }
