import math
from typing import Dict, Any, Tuple
from app.config import settings, STATE_TARIFF_AND_INSOLATION

class SolarEngine:
    @staticmethod
    def calculate(
        input_type: str = "units",
        monthly_units: float = None,
        monthly_bill: float = None,
        tariff: float = None,
        roof_area: float = 500.0,
        roof_type: str = "RCC",
        shading: str = "Low",
        state: str = "Maharashtra",
        property_type: str = "Home"
    ) -> Dict[str, Any]:
        """
        Calculates optimal solar capacity, panel count, generation, and roof utilization
        using transparent engineering formulas and configurable assumptions.
        """
        # 1. State-specific baseline tariff & insolation factor
        normalized_state = (state or "Maharashtra").strip().title()
        state_info = STATE_TARIFF_AND_INSOLATION.get(normalized_state)
        if not state_info:
            for k, v in STATE_TARIFF_AND_INSOLATION.items():
                if k.lower() == (state or "").strip().lower():
                    state_info = v
                    normalized_state = k
                    break
        if not state_info:
            state_info = {"tariff": settings.DEFAULT_TARIFF_RATE, "insolation_factor": 1.0, "special_state": 0}
            normalized_state = state or "Maharashtra"

        effective_tariff = tariff if (tariff and tariff > 0) else state_info["tariff"]
        tariff_source = "User Provided" if (tariff and tariff > 0) else f"State Benchmark ({normalized_state} @ ₹{effective_tariff}/kWh)"

        # 2. Electricity consumption derivation
        if input_type == "bill" and monthly_bill is not None and monthly_bill > 0:
            derived_monthly_units = round(monthly_bill / effective_tariff, 1)
        elif monthly_units is not None and monthly_units > 0:
            derived_monthly_units = float(monthly_units)
        else:
            derived_monthly_units = 300.0 # Standard Indian household default

        annual_consumption = derived_monthly_units * 12.0

        # 3. Solar Generation Factors
        insolation_multiplier = state_info.get("insolation_factor", 1.0)
        
        # Shading derating factor
        shading_derate = 1.0
        shading_clean = (shading or "Low").strip().lower()
        if shading_clean == "medium":
            shading_derate = 0.88
        elif shading_clean == "high":
            shading_derate = 0.72

        # Base annual generation per kWp (e.g. 1460 kWh / kWp / year in standard conditions)
        effective_annual_gen_per_kw = settings.ANNUAL_GENERATION_PER_KW * insolation_multiplier * shading_derate

        # 4. Ideal Capacity Needed to offset 100% of consumption
        ideal_capacity_kw = annual_consumption / effective_annual_gen_per_kw

        # 5. Roof Area Constraint Analysis
        # ~80 sq.ft. required per kW of 550W panels including maintenance walkways & pitch spacing
        area_per_kw = settings.DEFAULT_ROOF_AREA_PER_KW_SQFT
        safe_roof_area = max(10.0, float(roof_area or 500.0))
        max_capacity_by_roof = max(0.5, safe_roof_area / area_per_kw)

        roof_constraint_applied = False
        if ideal_capacity_kw > max_capacity_by_roof:
            effective_capacity_kw = max_capacity_by_roof
            roof_constraint_applied = True
        else:
            effective_capacity_kw = ideal_capacity_kw

        # Practical lower and upper clamping (min 1 kW, reasonable round numbers)
        panel_watts = settings.DEFAULT_PANEL_WATTAGE
        panel_kw = panel_watts / 1000.0 # 0.55 kW

        # Round to integer number of 550W panels
        panels_count = max(2, math.ceil(effective_capacity_kw / panel_kw))
        
        # Re-check if panel area strictly fits in roof
        # 1 panel 550W is ~25 sq.ft., but layout with walkways needs ~44 sq.ft./panel (~80 sq.ft./kW)
        while (panels_count * area_per_kw * panel_kw > safe_roof_area) and panels_count > 2:
            panels_count -= 1
            roof_constraint_applied = True

        recommended_capacity_kw = round(panels_count * panel_kw, 2)
        
        # 6. Actual Expected Generation Output
        annual_generation_kwh = round(recommended_capacity_kw * effective_annual_gen_per_kw, 1)
        monthly_generation_kwh = round(annual_generation_kwh / 12.0, 1)
        daily_average_generation_kwh = round(annual_generation_kwh / 365.0, 1)

        # 7. Roof Utilization
        roof_required_sqft = round(panels_count * (area_per_kw * panel_kw), 1)
        roof_utilization_pct = min(100.0, round((roof_required_sqft / max(1.0, safe_roof_area)) * 100.0, 1))

        # 8. Rationale Text Generation
        coverage_pct = round((annual_generation_kwh / max(1.0, annual_consumption)) * 100, 1)
        if roof_constraint_applied:
            rationale = (
                f"Based on your available roof area of {roof_area:g} sq.ft., we recommend a {recommended_capacity_kw} kW system "
                f"({panels_count} × {panel_watts}W panels). This optimizes your available space and can cover approximately "
                f"{min(100, coverage_pct)}% of your estimated {annual_consumption:,.0f} kWh annual electricity requirement."
            )
        else:
            rationale = (
                f"Based on your estimated electricity consumption of {derived_monthly_units:,.0f} units/month ({annual_consumption:,.0f} kWh/year), "
                f"a {recommended_capacity_kw} kW system ({panels_count} × {panel_watts}W panels) will offset approximately "
                f"{min(100, coverage_pct)}% of your electricity consumption while comfortably occupying {roof_required_sqft:g} sq.ft. of your roof."
            )

        assumptions_dict = {
            "Panel Technology": f"{panel_watts}W Monocrystalline PERC Half-Cut (High Efficiency)",
            "Specific Solar Yield": f"{effective_annual_gen_per_kw / 365.0:.2f} kWh/kWp/day ({round(effective_annual_gen_per_kw):,} kWh/kWp/year)",
            "System Performance Ratio": f"{int(settings.DEFAULT_PERFORMANCE_RATIO * 100)}% (accounting for inverter losses, cabling & thermal derate)",
            "Roof Space Index": f"{area_per_kw:g} sq.ft. per kWp (includes shadow-free spacing & maintenance paths)",
            "State Insolation Multiplier": f"{insolation_multiplier}x ({state})",
            "Shading Factor": f"{int(shading_derate * 100)}% ({shading} shading condition)",
            "Electricity Tariff": f"₹{effective_tariff:.2f} per unit/kWh"
        }

        return {
            "monthly_units_consumed": derived_monthly_units,
            "annual_consumption_kwh": annual_consumption,
            "estimated_tariff_rate": effective_tariff,
            "tariff_source": tariff_source,
            "recommended_capacity_kw": recommended_capacity_kw,
            "exact_capacity_needed_kw": round(ideal_capacity_kw, 2),
            "panel_count": panels_count,
            "panel_wattage_w": panel_watts,
            "annual_generation_kwh": annual_generation_kwh,
            "monthly_generation_kwh": monthly_generation_kwh,
            "daily_average_generation_kwh": daily_average_generation_kwh,
            "roof_area_available_sqft": roof_area,
            "roof_area_required_sqft": roof_required_sqft,
            "roof_utilization_pct": roof_utilization_pct,
            "roof_constraint_applied": roof_constraint_applied,
            "shading_factor_applied": shading_derate,
            "recommendation_rationale": rationale,
            "assumptions_used": assumptions_dict
        }
