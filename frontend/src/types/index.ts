export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  state: string;
  district?: string;
  city?: string;
  pincode?: string;
  property_type: string;
  consumer_category?: string;
  is_demo: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SolarInputState {
  inputType: 'units' | 'bill';
  monthlyUnits: number;
  monthlyBill: number;
  tariff: number;
  roofArea: number;
  roofType: 'RCC' | 'Metal' | 'Tiled' | 'Other';
  shading: 'Low' | 'Medium' | 'High';
  state: string;
  district: string;
  city: string;
  discom: string;
  propertyType: 'Home' | 'Shop' | 'Institution';
  consumerCategory: string;
  hasGridConnection: boolean;
  hasRoofRights: boolean;
}

export interface CostBreakdown {
  solar_panels: number;
  inverter: number;
  mounting_structure: number;
  electrical_and_bos: number;
  installation_and_netmetering: number;
  total_gross_cost: number;
}

export interface YearlySavingsItem {
  year: string;
  year_num: number;
  tariff_rate: number;
  annual_generation_kwh: number;
  annual_savings: number;
  cumulative_savings: number;
  system_cost: number;
  net_benefit: number;
  is_profitable: boolean;
}

export interface SolarCalculationResult {
  monthly_units_consumed: number;
  annual_consumption_kwh: number;
  estimated_tariff_rate: number;
  tariff_source: string;
  recommended_capacity_kw: number;
  exact_capacity_needed_kw: number;
  panel_count: number;
  panel_wattage_w: number;
  annual_generation_kwh: number;
  monthly_generation_kwh: number;
  daily_average_generation_kwh: number;
  roof_area_available_sqft: number;
  roof_area_required_sqft: number;
  roof_utilization_pct: number;
  roof_constraint_applied: boolean;
  shading_factor_applied: number;
  gross_cost: number;
  potential_subsidy: number;
  net_cost: number;
  annual_savings: number;
  monthly_savings: number;
  payback_period_years: number;
  roi_25yr_pct: number;
  cost_breakdown: CostBreakdown;
  co2_avoided_annual_kg: number;
  co2_avoided_25yr_kg: number;
  trees_equivalent_annual: number;
  coal_saved_annual_kg: number;
  petrol_car_km_offset_annual: number;
  recommendation_rationale: string;
  assumptions_used: Record<string, string>;
  disclaimer: string;
  assessment_id?: number;
  calculation_id?: number;
}

export interface Scheme {
  id: number;
  scheme_name: string;
  ministry: string;
  state: string;
  applicable_property_type: string;
  description: string;
  eligibility: string;
  subsidy_type: string;
  subsidy_amount: string;
  subsidy_percentage?: string;
  application_process: string;
  required_documents: string;
  official_url: string;
  active_status: boolean;
  category: string;
  last_verified_date: string;
  min_capacity_kw: number;
  max_capacity_kw: number;
}

export interface SchemeEligibilityMatch {
  scheme: Scheme;
  match_status: 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_MATCHING';
  match_score: number;
  potential_subsidy_amount: number;
  potential_subsidy_display: string;
  reasons: string[];
  missing_criteria: string[];
  action_items: string[];
}

export interface EligibilityResult {
  user_state: string;
  property_type: string;
  capacity_kw: number;
  total_schemes_evaluated: number;
  matching_schemes: SchemeEligibilityMatch[];
  best_match_scheme_name: string;
  max_potential_subsidy: number;
  important_notice: string;
}

export interface Installer {
  id: number;
  name: string;
  state: string;
  district: string;
  city: string;
  contact: string;
  phone: string;
  email?: string;
  website?: string;
  service_area: string;
  authorised_status: string;
  verification_source: string;
  rating: number;
  completed_projects: number;
  is_demo: boolean;
  last_verified_date: string;
}

export interface InstallerListResponse {
  total: number;
  installers: Installer[];
  states_available: string[];
  filter_state?: string;
}

export interface SolarReportData {
  report_code: string;
  created_at: string;
  user_info: {
    name: string;
    email: string;
    mobile: string;
    state: string;
    district: string;
    property_type: string;
  };
  electricity_profile: {
    monthly_units: number;
    monthly_bill: number;
    annual_consumption_kwh: number;
    tariff_rate: number;
    tariff_source: string;
  };
  solar_recommendation: {
    recommended_capacity_kw: number;
    panel_count: number;
    panel_wattage_w: number;
    annual_generation_kwh: number;
    monthly_generation_kwh: number;
    daily_average_generation_kwh: number;
    roof_area_available_sqft: number;
    roof_area_required_sqft: number;
    roof_utilization_pct: number;
    roof_constraint_applied: boolean;
    shading_factor_applied: number;
    rationale: string;
  };
  financial_analysis: {
    gross_cost: number;
    potential_subsidy: number;
    net_cost: number;
    cost_breakdown: CostBreakdown;
    financing: {
      loan_eligible_amount: number;
      concessional_interest_rate_pct: number;
      tenure_years: number;
      estimated_monthly_emi: number;
      note: string;
    };
    year_1_savings: number;
    monthly_avg_savings: number;
    simple_payback_years: number;
    exact_breakeven_year: number;
    total_10yr_savings: number;
    total_25yr_savings: number;
    net_lifetime_profit: number;
    roi_25yr_pct: number;
    projections_10yr: YearlySavingsItem[];
  };
  scheme_guidance: Array<{
    scheme_name: string;
    ministry: string;
    match_status: string;
    potential_subsidy_display: string;
    potential_subsidy_amount: number;
    reasons: string[];
    required_documents: string;
    official_url: string;
    last_verified_date: string;
  }>;
  environmental_impact: {
    annual_generation_kwh: number;
    grid_emission_factor_used: number;
    co2_avoided_annual_kg: number;
    co2_avoided_annual_tonnes: number;
    co2_avoided_lifetime_kg: number;
    co2_avoided_lifetime_tonnes: number;
    trees_equivalent_annual: number;
    trees_equivalent_lifetime: number;
    coal_saved_annual_kg: number;
    coal_saved_lifetime_tonnes: number;
    petrol_car_km_offset_annual: number;
  };
  installation_roadmap: Array<{
    step: number;
    title: string;
    stage: string;
    description: string;
    duration: string;
    docs_needed: string;
  }>;
  assumptions: Record<string, string>;
  disclaimer: string;
}
