import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Layers, 
  Zap, 
  Home, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Info, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Award,
  Sparkles,
  Download
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { StatCard } from '../components/StatCard';
import { StepWizardNav } from '../components/StepWizardNav';
import { Disclaimer } from '../components/Disclaimer';

export const SolarResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { result, inputState, calculate, isCalculating, error } = useSolar();

  // If no result exists yet, run calculation automatically
  useEffect(() => {
    if (!result && !isCalculating) {
      calculate().catch(() => {});
    }
  }, [result]);

  if (!result) {
    if (error) {
      return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-red-700 space-y-3">
            <h2 className="text-lg font-bold text-red-900">Calculation Error</h2>
            <p className="text-xs text-red-700">{error}</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => calculate().catch(() => {})}
                className="px-4 py-2 rounded-xl bg-solar-500 hover:bg-solar-600 text-white font-bold text-xs shadow-sm transition-all"
              >
                Retry Calculation
              </button>
              <Link
                to="/calculator"
                className="px-4 py-2 rounded-xl border border-gov-300 hover:bg-gov-50 text-gov-700 font-semibold text-xs transition-colors"
              >
                Back to Calculator
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-solar-500 border-t-transparent animate-spin mx-auto"></div>
        <h2 className="text-xl font-bold text-gov-900">Calculating your optimal solar recommendation...</h2>
        <p className="text-xs text-gov-500">Evaluating solar irradiance, roof space constraints, and tariff models.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gov-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-solar-600 uppercase tracking-wider mb-1">
              <Sun className="w-4 h-4" />
              <span>Step 2 of 8 • Sizing Recommendation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-950 font-display">
              Your Personalized Solar Recommendation
            </h1>
            <p className="text-xs sm:text-sm text-gov-600 mt-1">
              Engineering simulation calculated for your {inputState.propertyType.toLowerCase()} in {inputState.state}.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/calculator"
              className="px-3 py-1.5 rounded-lg border border-gov-300 hover:bg-gov-50 text-xs font-semibold text-gov-700 transition-colors"
            >
              Adjust Inputs
            </Link>
            <Link
              to="/schemes"
              className="px-4 py-1.5 rounded-lg bg-solar-500 hover:bg-solar-600 text-xs font-bold text-white shadow-sm transition-all"
            >
              Check Schemes →
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Recommended Capacity"
          value={`${result.recommended_capacity_kw} kW`}
          subtitle="Optimal sizing"
          icon={Sun}
          accent={true}
          badge="Optimal"
        />
        <StatCard
          title="Solar Panels"
          value={`${result.panel_count}`}
          subtitle={`${result.panel_wattage_w}W Mono PERC`}
          icon={Layers}
          badge="Tier-1 ALMM"
          badgeColor="solar"
        />
        <StatCard
          title="Annual Generation"
          value={`${result.annual_generation_kwh.toLocaleString('en-IN')} kWh`}
          subtitle={`~${result.monthly_generation_kwh.toLocaleString('en-IN')} units/mo`}
          icon={Zap}
          badge="CEA Yield"
          badgeColor="blue"
        />
        <StatCard
          title="Roof Space Needed"
          value={`${result.roof_area_required_sqft} sq.ft.`}
          subtitle={`${result.roof_utilization_pct}% of available`}
          icon={Home}
          badge={result.roof_constraint_applied ? 'Constrained' : 'Fits Comfortably'}
          badgeColor={result.roof_constraint_applied ? 'solar' : 'eco'}
        />
        <StatCard
          title="Annual Bill Savings"
          value={`₹${result.annual_savings.toLocaleString('en-IN')}`}
          subtitle={`~₹${result.monthly_savings.toLocaleString('en-IN')}/month`}
          icon={TrendingUp}
          trend="+100% Offset"
          badgeColor="eco"
        />
        <StatCard
          title="Estimated Payback"
          value={`${result.payback_period_years} Yrs`}
          subtitle="Net break-even"
          icon={Clock}
          badge="High ROI"
          badgeColor="solar"
        />
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Why this recommendation? & Detailed Analysis */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Why This Recommendation Card */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-gov-100">
              <div className="w-8 h-8 rounded-xl bg-solar-50 text-solar-600 flex items-center justify-center font-bold">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-gov-950 font-display">
                Why this recommendation?
              </h3>
            </div>

            <p className="text-sm text-gov-700 leading-relaxed">
              {result.recommendation_rationale}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-gov-50 border border-gov-100 space-y-1">
                <span className="text-[11px] font-semibold text-gov-500 block">Electricity Coverage</span>
                <span className="text-sm font-bold text-gov-900">
                  {Math.min(100, Math.round((result.annual_generation_kwh / Math.max(1, result.annual_consumption_kwh)) * 100))}% of your consumption
                </span>
                <p className="text-[10px] text-gov-500">
                  Estimated consumption: {result.annual_consumption_kwh.toLocaleString('en-IN')} kWh/yr
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gov-50 border border-gov-100 space-y-1">
                <span className="text-[11px] font-semibold text-gov-500 block">Roof Fit Efficiency</span>
                <span className="text-sm font-bold text-gov-900">
                  {result.roof_area_required_sqft} sq.ft. utilized ({result.roof_utilization_pct}%)
                </span>
                <p className="text-[10px] text-gov-500">
                  Leaves {Math.max(0, result.roof_area_available_sqft - result.roof_area_required_sqft)} sq.ft. for access & storage
                </p>
              </div>
            </div>
          </div>

          {/* Technical System Specification Table */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-gov-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Recommended Hardware & Technical Specifications</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gov-50 text-gov-700 font-bold border-b border-gov-200">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-lg">Component</th>
                    <th className="py-2.5 px-3">Specification</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Standard / Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-100 text-gov-800">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Solar Modules</td>
                    <td className="py-2.5 px-3">{result.panel_count} × {result.panel_wattage_w}W Mono PERC Half-Cut</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">ALMM / DCR Compliant (25-Yr Linear Warranty)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Grid-Tied Inverter</td>
                    <td className="py-2.5 px-3">{result.recommended_capacity_kw} kW Smart On-Grid String Inverter</td>
                    <td className="py-2.5 px-3 text-gov-600">IS 16221 / IEEE 1547 Anti-Islanding Protection</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Mounting Structure</td>
                    <td className="py-2.5 px-3">Hot-Dip Galvanized (HDG) / Aluminium (150 km/h wind rated)</td>
                    <td className="py-2.5 px-3 text-gov-600">IS 875 (Part 3) Wind Load Certified</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Net Metering</td>
                    <td className="py-2.5 px-3">Bi-directional Smart Energy Meter</td>
                    <td className="py-2.5 px-3 text-gov-600">DISCOM Net-Meter Standard</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Safety & Earthing</td>
                    <td className="py-2.5 px-3">Dedicated Chemical Earthing Pits + Lightning Arrestor</td>
                    <td className="py-2.5 px-3 text-gov-600">IS 3043 (&lt; 5 Ohms resistance)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Transparent Assumptions Card */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Calculation Assumptions Used</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {Object.entries(result.assumptions_used).map(([k, v], idx) => (
                <div key={idx} className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <span className="font-medium text-slate-500">{k}:</span>
                  <span className="font-bold text-slate-800">{v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Financial Snapshot & Next Step CTA */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Financial Summary Card */}
          <div className="p-6 rounded-3xl bg-gov-950 text-white shadow-xl border border-gov-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gov-800">
              <h4 className="text-sm font-bold font-display text-white">Financial Snapshot</h4>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DBT Subsidy
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gov-900">
                <span className="text-slate-400">Estimated Turnkey Cost:</span>
                <span className="font-bold text-white font-mono">₹{result.gross_cost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-gov-900">
                <span className="text-emerald-400">Potential PM Surya Ghar Subsidy:</span>
                <span className="font-bold text-emerald-400 font-mono">- ₹{result.potential_subsidy.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-200 font-semibold">Estimated Net Cost:</span>
                <span className="font-black text-solar-400 font-mono text-base">₹{result.net_cost.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 border-t border-gov-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Simple Payback Period:</span>
                <span className="font-bold text-white">{result.payback_period_years} Years</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Link
                to="/schemes"
                className="w-full py-3 rounded-xl bg-solar-500 hover:bg-solar-600 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>Check Scheme Eligibility →</span>
              </Link>
              
              <Link
                to="/cost-estimator"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <span>View Itemized BOM Cost Breakdown</span>
              </Link>
            </div>
          </div>

          <Disclaimer variant="banner" />

        </div>

      </div>

      <StepWizardNav
        currentStep={2}
        totalSteps={8}
        backPath="/calculator"
        nextPath="/schemes"
        nextLabel="Check Government Scheme Eligibility"
      />

    </div>
  );
};
