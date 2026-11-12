import pytest
from app.calculators.solar_engine import SolarEngine
from app.calculators.subsidy_engine import SubsidyEngine
from app.calculators.cost_engine import CostEngine
from app.calculators.savings_engine import SavingsEngine
from app.calculators.environment_engine import EnvironmentEngine
from app.database.session import SessionLocal, Base, engine
from app.seed.seed_data import seed_database
from app.services.scheme_service import SchemeService

@pytest.fixture(scope="module")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    yield db
    db.close()

def test_solar_engine_units_sizing():
    # 300 units/mo in Maharashtra -> 3600 kWh/yr -> ~2.75 kW (5 panels of 550W)
    res = SolarEngine.calculate(
        input_type="units",
        monthly_units=300,
        roof_area=500,
        state="Maharashtra",
        property_type="Home"
    )
    assert res["recommended_capacity_kw"] >= 2.2
    assert res["panel_count"] >= 4
    assert res["annual_generation_kwh"] > 3000
    assert res["roof_utilization_pct"] <= 100

def test_solar_engine_roof_constraint():
    # Large consumption (1000 units), but tiny roof (100 sq.ft)
    res = SolarEngine.calculate(
        input_type="units",
        monthly_units=1000,
        roof_area=100,
        state="Maharashtra"
    )
    assert res["roof_constraint_applied"] is True
    assert res["roof_area_required_sqft"] <= 100

def test_subsidy_engine_slabs():
    # PM Surya Ghar: 1kW -> ₹30k, 2kW -> ₹60k, 3kW+ -> ₹78k
    sub1 = SubsidyEngine.calculate_subsidy(1.0, "Home", "Maharashtra")
    assert sub1["subsidy_amount"] == 30000.0

    sub2 = SubsidyEngine.calculate_subsidy(2.0, "Home", "Maharashtra")
    assert sub2["subsidy_amount"] == 60000.0

    sub3 = SubsidyEngine.calculate_subsidy(3.3, "Home", "Maharashtra")
    assert sub3["subsidy_amount"] == 78000.0

    # Commercial property receives 0 direct cash subsidy
    sub_comm = SubsidyEngine.calculate_subsidy(5.0, "Shop", "Maharashtra")
    assert sub_comm["subsidy_amount"] == 0.0

def test_cost_engine_breakdown():
    cost_res = CostEngine.calculate_cost(3.3, "Home", "Maharashtra")
    assert cost_res["total_gross_cost"] > 0
    assert cost_res["potential_subsidy"] == 78000.0
    assert cost_res["net_cost"] == round(cost_res["total_gross_cost"] - 78000.0, 2)
    assert cost_res["breakdown"]["solar_panels"] > 0
    assert cost_res["financing_estimate"]["estimated_monthly_emi"] > 0

def test_savings_engine():
    sav_res = SavingsEngine.calculate_savings(
        annual_generation_kwh=4818.0,
        net_system_cost=103500.0,
        tariff_rate=8.20
    )
    assert sav_res["year_1_savings"] > 35000
    assert sav_res["simple_payback_years"] < 5.0
    assert len(sav_res["projections_10yr"]) == 10
    assert sav_res["total_25yr_savings"] > 1000000

def test_environment_engine():
    env_res = EnvironmentEngine.calculate_impact(4818.0)
    assert env_res["co2_avoided_annual_kg"] > 3000
    assert env_res["trees_equivalent_annual"] > 100
    assert env_res["coal_saved_annual_kg"] > 1500

def test_scheme_eligibility_service(db_session):
    eval_res = SchemeService.evaluate_eligibility(
        db=db_session,
        state="Maharashtra",
        property_type="Home",
        capacity_kw=3.3
    )
    assert len(eval_res.matching_schemes) >= 1
    best = eval_res.matching_schemes[0]
    assert best.match_status in ["ELIGIBLE", "POTENTIALLY_ELIGIBLE"]
    assert eval_res.max_potential_subsidy > 0

def test_auth_and_report_flow(db_session):
    from app.routes.auth import demo_login
    from app.services.report_service import ReportService
    from app.services.installer_service import InstallerService

    # 1. Demo Login
    token_obj = demo_login(db=db_session)
    assert token_obj.access_token is not None
    assert token_obj.user.email == "demo@solarsahayak.in"

    # 2. Report Generation
    rep = ReportService.generate_full_report(
        db=db_session,
        payload={
            "user_id": token_obj.user.id,
            "monthly_units": 300,
            "state": "Maharashtra",
            "property_type": "Home"
        }
    )
    assert rep["report_code"].startswith("SS-")
    assert rep["solar_recommendation"]["recommended_capacity_kw"] > 0
    assert rep["financial_analysis"]["net_cost"] > 0

    # 3. Installer Service
    inst_res = InstallerService.get_installers(db=db_session, state="Maharashtra")
    assert inst_res.total >= 1
    assert len(inst_res.installers) >= 1
