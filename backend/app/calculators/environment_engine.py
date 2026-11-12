from typing import Dict, Any
from app.config import settings

class EnvironmentEngine:
    @staticmethod
    def calculate_impact(
        annual_generation_kwh: float,
        lifetime_years: int = 25,
        grid_emission_factor: float = None
    ) -> Dict[str, Any]:
        """
        Calculates environmental benefits: CO2 avoided, tree equivalents,
        thermal coal avoided, and petrol vehicle kilometer equivalents.
        """
        effective_factor = grid_emission_factor if grid_emission_factor is not None else settings.GRID_EMISSION_FACTOR

        annual_co2_kg = round(annual_generation_kwh * effective_factor, 1)
        lifetime_co2_kg = round(annual_co2_kg * lifetime_years, 1)
        lifetime_co2_tonnes = round(lifetime_co2_kg / 1000.0, 2)

        # Trees equivalent (approx 20-22 kg CO2 absorbed per tree per year -> ~45 trees per tonne)
        trees_annual = round((annual_co2_kg / 1000.0) * settings.TREES_EQUIVALENT_FACTOR, 1)
        trees_lifetime = round(trees_annual * lifetime_years, 0)

        # Coal saved
        coal_saved_annual_kg = round(annual_generation_kwh * settings.COAL_SAVED_PER_KWH, 1)
        coal_saved_lifetime_tonnes = round((coal_saved_annual_kg * lifetime_years) / 1000.0, 2)

        # Petrol vehicle km offset
        petrol_km_annual = round(annual_co2_kg * settings.PETROL_CAR_KM_PER_KG_CO2, 0)

        return {
            "annual_generation_kwh": annual_generation_kwh,
            "grid_emission_factor_used": effective_factor,
            "co2_avoided_annual_kg": annual_co2_kg,
            "co2_avoided_annual_tonnes": round(annual_co2_kg / 1000.0, 2),
            "co2_avoided_lifetime_kg": lifetime_co2_kg,
            "co2_avoided_lifetime_tonnes": lifetime_co2_tonnes,
            "trees_equivalent_annual": int(trees_annual),
            "trees_equivalent_lifetime": int(trees_lifetime),
            "coal_saved_annual_kg": coal_saved_annual_kg,
            "coal_saved_lifetime_tonnes": coal_saved_lifetime_tonnes,
            "petrol_car_km_offset_annual": petrol_km_annual,
            "assumptions": {
                "grid_factor": f"{effective_factor} kg CO₂ / kWh (CEA India National Baseline)",
                "tree_factor": "1 mature tree absorbs ~22 kg CO₂/year",
                "coal_factor": "0.45 kg thermal coal displaced per kWh solar",
                "petrol_factor": "~165g CO₂/km emitted by average petrol passenger car"
            },
            "disclaimer": "Environmental metrics are estimated based on Central Electricity Authority (CEA) India grid emission baseline."
        }
