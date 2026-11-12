from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database.models import Scheme
from app.schemas.scheme import SchemeResponse, SchemeEligibilityMatch, EligibilityCheckResponse
from app.calculators.subsidy_engine import SubsidyEngine

class SchemeService:
    @staticmethod
    def evaluate_eligibility(
        db: Session,
        state: str,
        property_type: str,
        capacity_kw: float,
        has_active_grid_connection: bool = True,
        has_roof_rights: bool = True,
        consumer_category: str = "Domestic/Residential"
    ) -> EligibilityCheckResponse:
        """
        Evaluates user profile against all government solar schemes in the database.
        Returns match status (ELIGIBLE, POTENTIALLY_ELIGIBLE, NOT_MATCHING), subsidy estimates,
        and explicit criteria checks.
        """
        schemes = db.query(Scheme).filter(Scheme.active_status == True).all()

        matches: List[SchemeEligibilityMatch] = []
        max_potential_subsidy = 0.0
        best_match_name = None
        best_score = -1

        for scheme in schemes:
            score = 100
            reasons: List[str] = []
            missing_criteria: List[str] = []
            action_items: List[str] = []
            potential_subsidy = 0.0

            # 1. State check
            user_state_clean = (state or "").strip().lower()
            scheme_state_clean = scheme.state.strip().lower()
            state_match = (scheme_state_clean == "all india") or (scheme_state_clean == user_state_clean)
            if not state_match:
                score -= 60
                missing_criteria.append(f"Scheme is applicable only for {scheme.state} (your location: {state}).")
            else:
                reasons.append(f"Location Match: Scheme covers your state ({state}).")

            # 2. Property type check
            app_props = [p.strip().lower() for p in scheme.applicable_property_type.split(",")]
            user_prop_clean = (property_type or "Home").strip().lower()
            prop_match = (user_prop_clean in app_props) or ("all" in app_props)
            if not prop_match:
                score -= 40
                missing_criteria.append(f"Scheme is designated for {scheme.applicable_property_type} (your property: {property_type}).")
            else:
                reasons.append(f"Property Type Match: Applicable for {property_type} premises.")

            # 3. Capacity bounds check
            if capacity_kw < scheme.min_capacity_kw:
                score -= 15
                missing_criteria.append(f"Recommended capacity ({capacity_kw} kW) is below scheme minimum of {scheme.min_capacity_kw} kW.")
            elif capacity_kw > scheme.max_capacity_kw:
                score -= 10
                reasons.append(f"Capacity ({capacity_kw} kW) exceeds maximum subsidized tier ({scheme.max_capacity_kw} kW); subsidy capped at max limit.")
            else:
                reasons.append(f"Capacity Requirement Met: {capacity_kw} kW is within the eligible range ({scheme.min_capacity_kw}-{scheme.max_capacity_kw} kW).")

            # 4. Prerequisites check
            if not has_active_grid_connection:
                score -= 30
                missing_criteria.append("Active grid-connected electricity connection with DISCOM is required for net-metering subsidy.")
                action_items.append("Ensure you have an active electricity meter in the applicant's name.")

            if not has_roof_rights:
                score -= 30
                missing_criteria.append("Ownership or clear legal roof usage authorization is required.")
                action_items.append("Obtain an NOC from building owner or housing society committee.")

            # Calculate Subsidy Amount for this scheme
            if "PM Surya Ghar" in scheme.scheme_name:
                sub_calc = SubsidyEngine.calculate_subsidy(capacity_kw, property_type, state)
                potential_subsidy = sub_calc["subsidy_amount"]
                subsidy_display = f"₹{potential_subsidy:,.0f} Direct DBT Subsidy"
                action_items.extend([
                    "Register on the National Solar Portal (pmsuryaghar.gov.in) with your electricity CA number.",
                    "Select an empanelled vendor and obtain feasibility approval from your state DISCOM."
                ])
            elif "KUSUM" in scheme.scheme_name:
                if user_prop_clean in ["agriculture", "farmer", "rural"]:
                    potential_subsidy = min(200000.0, capacity_kw * 35000.0)
                    subsidy_display = "Up to 60% (30% Central + 30% State Subsidy)"
                else:
                    score -= 40
                    subsidy_display = "Exclusively for Farmers & Agricultural land"
                    missing_criteria.append("Only farmers, farmer producer groups, and panchayats qualify for PM-KUSUM.")
            elif "Delhi Solar" in scheme.scheme_name:
                if user_state_clean == "delhi":
                    potential_subsidy = round(capacity_kw * 1460 * 3.0, 0) # ₹3/kWh GBI for 5 years
                    subsidy_display = f"₹3.00/kWh Generation Based Incentive (~₹{potential_subsidy:,.0f}/yr) + PM Surya Ghar"
                    action_items.append("Submit single-window rooftop application on Delhi DISCOM portal (BSES / TPDDL).")
                else:
                    potential_subsidy = 0.0
                    subsidy_display = scheme.subsidy_amount
            elif "Surya Gujarat" in scheme.scheme_name:
                if user_state_clean == "gujarat":
                    potential_subsidy = min(78000.0, capacity_kw * 25000.0)
                    subsidy_display = "State DISCOM Rooftop Subsidy + Fast Track Net Metering"
                    action_items.append("Apply through GUVNL unified solar portal with your GUVNL consumer number.")
                else:
                    potential_subsidy = 0.0
                    subsidy_display = scheme.subsidy_amount
            else:
                potential_subsidy = 0.0
                subsidy_display = scheme.subsidy_amount

            # Match status classification
            if score >= 80:
                match_status = "ELIGIBLE"
            elif score >= 50:
                match_status = "POTENTIALLY_ELIGIBLE"
            else:
                match_status = "NOT_MATCHING"

            if match_status == "ELIGIBLE" and potential_subsidy > max_potential_subsidy:
                max_potential_subsidy = potential_subsidy

            if score > best_score and match_status != "NOT_MATCHING":
                best_score = score
                best_match_name = scheme.scheme_name

            matches.append(SchemeEligibilityMatch(
                scheme=SchemeResponse.model_validate(scheme),
                match_status=match_status,
                match_score=max(0, min(100, score)),
                potential_subsidy_amount=potential_subsidy,
                potential_subsidy_display=subsidy_display,
                reasons=reasons,
                missing_criteria=missing_criteria,
                action_items=action_items
            ))

        # Sort matches by score descending
        matches.sort(key=lambda x: (0 if x.match_status == "ELIGIBLE" else (1 if x.match_status == "POTENTIALLY_ELIGIBLE" else 2), -x.match_score))

        return EligibilityCheckResponse(
            user_state=state,
            property_type=property_type,
            capacity_kw=capacity_kw,
            total_schemes_evaluated=len(schemes),
            matching_schemes=matches,
            best_match_scheme_name=best_match_name or "PM Surya Ghar: Muft Bijli Yojana",
            max_potential_subsidy=max_potential_subsidy,
            important_notice="Government scheme rules, DISCOM guidelines, and subsidy allocations are subject to official verification on state & national portals."
        )
