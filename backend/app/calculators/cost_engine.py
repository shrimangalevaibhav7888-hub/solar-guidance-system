from typing import Dict, Any
from app.config import settings
from app.calculators.subsidy_engine import SubsidyEngine

class CostEngine:
    @staticmethod
    def calculate_cost(
        capacity_kw: float,
        property_type: str = "Home",
        state: str = "Maharashtra"
    ) -> Dict[str, Any]:
        """
        Calculates turnkey installation cost, itemized bill of materials (BOM),
        subsidy deduction, and net out-of-pocket investment.
        """
        # Determine base turnkey price per kW according to system scale
        if capacity_kw <= 2.0:
            rate_per_kw = settings.BASE_COST_PER_KW_1TO2
        elif capacity_kw <= 5.0:
            rate_per_kw = settings.BASE_COST_PER_KW_3TO5
        else:
            rate_per_kw = settings.BASE_COST_PER_KW_6PLUS

        total_gross_cost = round(capacity_kw * rate_per_kw, 2)

        # BOM Component Split
        panels_cost = round(total_gross_cost * settings.COST_SPLIT_PANELS, 2)
        inverter_cost = round(total_gross_cost * settings.COST_SPLIT_INVERTER, 2)
        structure_cost = round(total_gross_cost * settings.COST_SPLIT_STRUCTURE, 2)
        electrical_cost = round(total_gross_cost * settings.COST_SPLIT_ELECTRICAL, 2)
        installation_cost = round(total_gross_cost * settings.COST_SPLIT_LABOUR_NETMETER, 2)

        # Subsidy Calculation
        subsidy_res = SubsidyEngine.calculate_subsidy(capacity_kw, property_type, state)
        potential_subsidy = subsidy_res["subsidy_amount"]

        net_cost = max(0.0, round(total_gross_cost - potential_subsidy, 2))

        # EMI Estimation (7% annual concessional green solar loan over 5 years)
        # Formula: P * r * (1+r)^n / ((1+r)^n - 1)
        loan_amount = net_cost
        monthly_rate = 0.07 / 12.0
        tenure_months = 60
        if loan_amount > 0:
            emi = round(
                (loan_amount * monthly_rate * ((1 + monthly_rate) ** tenure_months))
                / (((1 + monthly_rate) ** tenure_months) - 1),
                0
            )
        else:
            emi = 0.0

        return {
            "capacity_kw": capacity_kw,
            "rate_per_kw": rate_per_kw,
            "total_gross_cost": total_gross_cost,
            "potential_subsidy": potential_subsidy,
            "net_cost": net_cost,
            "subsidy_details": subsidy_res,
            "breakdown": {
                "solar_panels": panels_cost,
                "inverter": inverter_cost,
                "mounting_structure": structure_cost,
                "electrical_and_bos": electrical_cost,
                "installation_and_netmetering": installation_cost,
                "total_gross_cost": total_gross_cost
            },
            "financing_estimate": {
                "loan_eligible_amount": net_cost,
                "concessional_interest_rate_pct": 7.0,
                "tenure_years": 5,
                "estimated_monthly_emi": emi,
                "note": "Under PM Surya Ghar, collateral-free loans at ~7% interest are available via nationalized banks for systems up to 3 kW."
            },
            "disclaimer": "All costs represent estimated turnkey market rates for Tier-1 ALMM modules and string inverters. Actual quotations from empanelled vendors may vary based on roof height, walkway customization, and brand selection."
        }
