from typing import Dict, Any, List
from app.config import settings

class SavingsEngine:
    @staticmethod
    def calculate_savings(
        annual_generation_kwh: float,
        net_system_cost: float,
        tariff_rate: float = None,
        annual_tariff_inflation: float = None,
        panel_degradation_rate: float = None
    ) -> Dict[str, Any]:
        """
        Calculates annual savings, monthly savings, simple payback, 10-year chart data,
        and 25-year lifetime financial returns.
        """
        effective_tariff = tariff_rate if (tariff_rate and tariff_rate > 0) else settings.DEFAULT_TARIFF_RATE
        inflation_rate = annual_tariff_inflation if annual_tariff_inflation is not None else settings.ANNUAL_TARIFF_ESCALATION
        degradation_rate = panel_degradation_rate if panel_degradation_rate is not None else settings.ANNUAL_PANEL_DEGRADATION

        # Year 1 baseline
        year_1_savings = round(annual_generation_kwh * effective_tariff, 2)
        monthly_avg_savings = round(year_1_savings / 12.0, 2)

        # Simple Payback Period
        if year_1_savings > 0:
            simple_payback_years = round(net_system_cost / year_1_savings, 1)
        else:
            simple_payback_years = 99.0

        # Detailed 10-year projection data for charts & 25-year totals
        projections_10yr: List[Dict[str, Any]] = []
        cumulative_savings = 0.0
        exact_breakeven_year = None
        total_25yr_savings = 0.0

        for year in range(1, 26):
            # Panel degradation: (1 - 0.007)^(year-1)
            gen_year = annual_generation_kwh * ((1.0 - degradation_rate) ** (year - 1))
            # Tariff escalation: (1 + 0.04)^(year-1)
            tariff_year = effective_tariff * ((1.0 + inflation_rate) ** (year - 1))
            
            savings_year = gen_year * tariff_year
            cumulative_savings += savings_year

            if year <= 10:
                net_benefit = round(cumulative_savings - net_system_cost, 2)
                projections_10yr.append({
                    "year": f"Year {year}",
                    "year_num": year,
                    "tariff_rate": round(tariff_year, 2),
                    "annual_generation_kwh": round(gen_year, 1),
                    "annual_savings": round(savings_year, 2),
                    "cumulative_savings": round(cumulative_savings, 2),
                    "system_cost": round(net_system_cost, 2),
                    "net_benefit": net_benefit,
                    "is_profitable": cumulative_savings >= net_system_cost
                })

            if cumulative_savings >= net_system_cost and exact_breakeven_year is None:
                # Interpolate exact break-even fraction
                prev_cumulative = cumulative_savings - savings_year
                fraction = (net_system_cost - prev_cumulative) / max(1.0, savings_year)
                exact_breakeven_year = round((year - 1) + max(0.0, min(1.0, fraction)), 1)

        total_25yr_savings = round(cumulative_savings, 2)
        net_lifetime_profit = round(total_25yr_savings - net_system_cost, 2)
        roi_25yr_pct = round((net_lifetime_profit / max(1.0, net_system_cost)) * 100.0, 1)

        return {
            "year_1_savings": year_1_savings,
            "monthly_avg_savings": monthly_avg_savings,
            "simple_payback_years": simple_payback_years,
            "exact_breakeven_year": exact_breakeven_year or simple_payback_years,
            "total_10yr_savings": projections_10yr[-1]["cumulative_savings"] if projections_10yr else 0,
            "total_25yr_savings": total_25yr_savings,
            "net_lifetime_profit": net_lifetime_profit,
            "roi_25yr_pct": roi_25yr_pct,
            "projections_10yr": projections_10yr,
            "assumptions": {
                "base_tariff": f"₹{effective_tariff:.2f} / kWh",
                "annual_tariff_inflation": f"{int(inflation_rate * 100)}% / year",
                "panel_degradation": f"{degradation_rate * 100:.1f}% / year",
                "analysis_period": "25 Years (Standard Linear Power Warranty)"
            },
            "disclaimer": "Savings projections account for 4% annual tariff inflation and 0.7% standard solar panel degradation. Actual savings depend on state net metering settlement rates and weather."
        }
