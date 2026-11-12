from typing import Dict, Any, Tuple
from app.config import settings, STATE_TARIFF_AND_INSOLATION

class SubsidyEngine:
    @staticmethod
    def calculate_subsidy(
        capacity_kw: float,
        property_type: str = "Home",
        state: str = "Maharashtra"
    ) -> Dict[str, Any]:
        """
        Calculates exact subsidy under PM Surya Ghar Muft Bijli Yojana and applicable state policies.
        """
        normalized_state = (state or "Maharashtra").strip().title()
        state_info = STATE_TARIFF_AND_INSOLATION.get(normalized_state)
        if not state_info:
            for k, v in STATE_TARIFF_AND_INSOLATION.items():
                if k.lower() == (state or "").strip().lower():
                    state_info = v
                    break
        if not state_info:
            state_info = {"special_state": 0}

        is_special_state = state_info.get("special_state", 0) == 1

        is_residential = (property_type or "Home").strip().lower() in ["home", "residential", "housing society", "individual home"]
        
        subsidy_amount = 0.0
        scheme_name = "PM Surya Ghar: Muft Bijli Yojana"
        subsidy_type = "Direct Central Financial Assistance (CFA)"
        subsidy_breakdown = []
        notes = []

        if not is_residential:
            # Commercial, Institutions, Shops
            subsidy_amount = 0.0
            subsidy_type = "Tax Benefits & Accelerated Depreciation"
            notes.append("Commercial and Institutional properties are not eligible for direct CFA cash subsidy under PM Surya Ghar.")
            notes.append("However, commercial entities are entitled to 40% Accelerated Depreciation (AD), Section 32 Income Tax benefits, and GST input credit.")
            subsidy_breakdown.append({"slab": "Commercial / Institutional Solar", "amount": 0.0, "note": "40% Accelerated Depreciation eligible"})
        else:
            # Residential Consumer Subsidy Rules
            if is_special_state:
                # Special category states (Himalayan, NE, Islands)
                if capacity_kw <= 1.0:
                    subsidy_amount = settings.PM_SURYA_GHAR_SPECIAL_1KW_SUBSIDY * capacity_kw
                    subsidy_breakdown.append({"slab": "Up to 1 kW (Special State Rate)", "amount": subsidy_amount, "rate": "₹33,000 / kW"})
                elif capacity_kw <= 2.0:
                    subsidy_amount = settings.PM_SURYA_GHAR_SPECIAL_2KW_SUBSIDY
                    subsidy_breakdown.append({"slab": "1 kW to 2 kW (Special State Rate)", "amount": subsidy_amount, "rate": "₹33,000 / kW up to ₹66,000"})
                else:
                    subsidy_amount = settings.PM_SURYA_GHAR_SPECIAL_3KW_MAX_SUBSIDY
                    subsidy_breakdown.append({"slab": "3 kW and above (Special State Max Cap)", "amount": subsidy_amount, "rate": "Capped at ₹85,800 maximum"})
            else:
                # Standard Indian States
                if capacity_kw < 1.0:
                    subsidy_amount = settings.PM_SURYA_GHAR_1KW_SUBSIDY * capacity_kw
                    subsidy_breakdown.append({"slab": f"Fractional Capacity ({capacity_kw:.1f} kW)", "amount": round(subsidy_amount, 2), "rate": "₹30,000 / kW pro-rata"})
                elif capacity_kw < 2.0:
                    subsidy_amount = settings.PM_SURYA_GHAR_1KW_SUBSIDY + (capacity_kw - 1.0) * settings.PM_SURYA_GHAR_1KW_SUBSIDY
                    subsidy_breakdown.append({"slab": "1st kW", "amount": 30000.0, "rate": "₹30,000"})
                    subsidy_breakdown.append({"slab": f"Additional {capacity_kw - 1.0:.1f} kW", "amount": round((capacity_kw - 1.0) * 30000.0, 2), "rate": "₹30,000 / kW"})
                elif capacity_kw < 3.0:
                    subsidy_amount = 60000.0 + (capacity_kw - 2.0) * 18000.0
                    subsidy_breakdown.append({"slab": "First 2 kW", "amount": 60000.0, "rate": "₹30,000 / kW = ₹60,000"})
                    subsidy_breakdown.append({"slab": f"Additional {capacity_kw - 2.0:.1f} kW", "amount": round((capacity_kw - 2.0) * 18000.0, 2), "rate": "₹18,000 / kW"})
                else:
                    subsidy_amount = settings.PM_SURYA_GHAR_3KW_MAX_SUBSIDY
                    subsidy_breakdown.append({"slab": "First 2 kW", "amount": 60000.0, "rate": "₹30,000 / kW = ₹60,000"})
                    subsidy_breakdown.append({"slab": "3rd kW", "amount": 18000.0, "rate": "₹18,000 for 3rd kW"})
                    subsidy_breakdown.append({"slab": "Capacity beyond 3 kW", "amount": 0.0, "rate": "Subsidy capped at ₹78,000 as per MNRE guidelines"})

            notes.append("Subsidy is disbursed directly to beneficiary bank account via DBT after DISCOM meter commissioning and National Portal inspection approval.")
            notes.append("Solar system must be installed by an empanelled vendor using ALMM-compliant DCR (Domestic Content Requirement) solar modules.")

        return {
            "scheme_name": scheme_name,
            "property_type": property_type,
            "capacity_kw": capacity_kw,
            "subsidy_amount": round(subsidy_amount, 2),
            "subsidy_type": subsidy_type,
            "is_special_state": is_special_state,
            "subsidy_breakdown": subsidy_breakdown,
            "disbursal_method": "Direct Benefit Transfer (DBT) to Bank Account",
            "notes": notes,
            "last_verified_policy_date": "2026-03-01",
            "disclaimer": "Potential subsidy based on current PM Surya Ghar guidelines. Final disbursement is subject to DISCOM inspection, DCR module verification, and portal approval."
        }
