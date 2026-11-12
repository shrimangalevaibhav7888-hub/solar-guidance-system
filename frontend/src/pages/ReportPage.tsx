import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Home, 
  Zap, 
  Layers, 
  Trees, 
  FileText, 
  Info, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { useAuth } from '../context/AuthContext';
import { SolarReportData } from '../types';

export const ReportPage: React.FC = () => {
  const { result, inputState, generateReport, report, isCalculating } = useSolar();
  const { user } = useAuth();
  const [activeReport, setActiveReport] = useState<SolarReportData | null>(report);
  const [reportError, setReportError] = useState<string | null>(null);

  const loadReport = () => {
    setReportError(null);
    generateReport()
      .then((rep) => setActiveReport(rep))
      .catch((err) => setReportError(err.message || 'Failed to generate report. Please try again.'));
  };

  useEffect(() => {
    if (!activeReport) {
      loadReport();
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!activeReport || isCalculating) {
    if (reportError) {
      return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-red-700 space-y-3">
            <h2 className="text-lg font-bold text-red-900">Report Generation Error</h2>
            <p className="text-xs text-red-700">{reportError}</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={loadReport}
                className="px-4 py-2 rounded-xl bg-solar-500 hover:bg-solar-600 text-white font-bold text-xs shadow-sm transition-all"
              >
                Retry Generating Report
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
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-solar-500 border-t-transparent animate-spin mx-auto"></div>
        <h2 className="text-xl font-bold text-gov-900">Generating your formal Solar Assessment Report...</h2>
        <p className="text-xs text-gov-500">Compiling engineering calculations, scheme matches, and financial models.</p>
      </div>
    );
  }

  const {
    report_code,
    created_at,
    user_info,
    electricity_profile,
    solar_recommendation,
    financial_analysis,
    scheme_guidance,
    environmental_impact,
    installation_roadmap,
    assumptions,
    disclaimer
  } = activeReport;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Action Top Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gov-200 shadow-sm no-print">
        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl border border-gov-300 hover:bg-gov-50 text-gov-700 text-xs font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-xs text-gov-500 font-mono">Report Code: <strong>{report_code}</strong></span>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/calculator"
            className="px-3.5 py-2 rounded-xl border border-gov-300 hover:bg-gov-50 text-gov-700 text-xs font-bold transition-colors"
          >
            Adjust Sizing Inputs
          </Link>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 text-white font-bold text-xs shadow-md shadow-solar-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF Report</span>
          </button>
        </div>
      </div>

      {/* FORMAL SOLAR CONSULTATION REPORT CONTAINER */}
      <div className="bg-white p-6 sm:p-12 rounded-3xl border border-gov-200 shadow-xl space-y-8 print-page text-gov-900">
        
        {/* Report Header */}
        <div className="border-b-2 border-solar-500 pb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-solar-500 text-white flex items-center justify-center shadow-md">
              <Sun className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gov-950 font-display">Solar<span className="text-solar-600">Sahayak</span></h1>
              <p className="text-xs text-gov-500 font-medium">Solar Installation & Government Scheme Guidance System</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-gov-600 space-y-0.5">
            <span className="font-bold text-gov-950 font-mono text-sm block">REPORT: {report_code}</span>
            <p>Generated on: <strong>{new Date(created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></p>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ Verified Techno-Commercial Model
            </span>
          </div>
        </div>

        {/* Section 1 & 2: User Profile & Electricity Baseline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-avoid-break">
          
          {/* User Profile Card */}
          <div className="p-5 rounded-2xl bg-gov-50 border border-gov-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gov-700 flex items-center gap-1.5">
              <Home className="w-4 h-4 text-solar-600" />
              <span>1. Applicant & Property Profile</span>
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-gov-500">Applicant:</span><span className="font-bold">{user_info.name}</span></div>
              <div className="flex justify-between"><span className="text-gov-500">State / Location:</span><span className="font-semibold">{user_info.district}, {user_info.state}</span></div>
              <div className="flex justify-between"><span className="text-gov-500">Property Category:</span><span className="font-semibold">{user_info.property_type}</span></div>
              <div className="flex justify-between"><span className="text-gov-500">Available Roof:</span><span className="font-semibold">{solar_recommendation.roof_area_available_sqft} sq.ft.</span></div>
            </div>
          </div>

          {/* Electricity Baseline Card */}
          <div className="p-5 rounded-2xl bg-gov-50 border border-gov-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gov-700 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-solar-600" />
              <span>2. Electricity Profile Baseline</span>
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-gov-500">Monthly Usage:</span><span className="font-bold">{electricity_profile.monthly_units} kWh / month</span></div>
              <div className="flex justify-between"><span className="text-gov-500">Annual Consumption:</span><span className="font-bold">{electricity_profile.annual_consumption_kwh.toLocaleString('en-IN')} kWh / yr</span></div>
              <div className="flex justify-between"><span className="text-gov-500">Average Tariff:</span><span className="font-semibold">₹{electricity_profile.tariff_rate.toFixed(2)} / unit</span></div>
              <div className="flex justify-between"><span className="text-gov-500">Tariff Basis:</span><span className="font-semibold">{electricity_profile.tariff_source}</span></div>
            </div>
          </div>

        </div>

        {/* Section 3: Recommended Solar System */}
        <div className="space-y-4 print-avoid-break">
          <h3 className="text-sm font-bold text-gov-950 flex items-center gap-2 border-b border-gov-100 pb-2">
            <Sun className="w-4 h-4 text-solar-600" />
            <span>3. Technical Solar Sizing Recommendation</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-solar-50/70 border border-solar-200 text-center">
              <span className="text-[11px] font-semibold text-gov-600 block">Recommended Capacity</span>
              <span className="text-2xl font-black text-gov-950 font-display">{solar_recommendation.recommended_capacity_kw} kW</span>
            </div>
            <div className="p-4 rounded-2xl bg-gov-50 border border-gov-200 text-center">
              <span className="text-[11px] font-semibold text-gov-600 block">Solar Panels</span>
              <span className="text-2xl font-black text-gov-950 font-display">{solar_recommendation.panel_count} × 550W</span>
            </div>
            <div className="p-4 rounded-2xl bg-gov-50 border border-gov-200 text-center">
              <span className="text-[11px] font-semibold text-gov-600 block">Annual Generation</span>
              <span className="text-2xl font-black text-gov-950 font-display">{solar_recommendation.annual_generation_kwh.toLocaleString('en-IN')} kWh</span>
            </div>
            <div className="p-4 rounded-2xl bg-gov-50 border border-gov-200 text-center">
              <span className="text-[11px] font-semibold text-gov-600 block">Roof Area Utilized</span>
              <span className="text-2xl font-black text-gov-950 font-display">{solar_recommendation.roof_area_required_sqft} sq.ft.</span>
            </div>
          </div>

          <p className="text-xs text-gov-700 bg-gov-50 p-3.5 rounded-xl border border-gov-100 leading-relaxed">
            <strong>Rationale: </strong>{solar_recommendation.rationale}
          </p>
        </div>

        {/* Section 4 & 5: Cost, Subsidy & Financial ROI */}
        <div className="space-y-4 print-avoid-break">
          <h3 className="text-sm font-bold text-gov-950 flex items-center gap-2 border-b border-gov-100 pb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>4. Financial Analysis & Government Subsidy</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gov-50 border border-gov-200">
              <span className="text-[11px] font-semibold text-gov-500 block">Turnkey Installation Cost</span>
              <span className="text-xl font-black text-gov-950 font-mono">₹{financial_analysis.gross_cost.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[11px] font-semibold text-emerald-700 block">PM Surya Ghar DBT Subsidy</span>
              <span className="text-xl font-black text-emerald-700 font-mono">- ₹{financial_analysis.potential_subsidy.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-4 rounded-2xl bg-gov-950 text-white">
              <span className="text-[11px] font-semibold text-slate-300 block">Net Out-of-Pocket Cost</span>
              <span className="text-xl font-black text-solar-400 font-mono">₹{financial_analysis.net_cost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Financial Return Summary Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gov-50 text-gov-700 font-bold border-b border-gov-200">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Financial Metric</th>
                  <th className="py-2.5 px-3">Estimated Value</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Notes & Assumptions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-100 text-gov-800">
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Annual Electricity Savings (Year 1)</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">₹{financial_analysis.year_1_savings.toLocaleString('en-IN')} / yr</td>
                  <td className="py-2.5 px-3 text-gov-500">~₹{financial_analysis.monthly_avg_savings.toLocaleString('en-IN')} average monthly bill offset</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Simple Payback Period</td>
                  <td className="py-2.5 px-3 font-mono font-bold">{financial_analysis.simple_payback_years} Years</td>
                  <td className="py-2.5 px-3 text-gov-500">Break-even against net out-of-pocket investment</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">10-Year Cumulative Savings</td>
                  <td className="py-2.5 px-3 font-mono font-bold">₹{financial_analysis.total_10yr_savings.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-gov-500">Includes 4% annual compound tariff escalation</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">25-Year Net Profit & ROI</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">₹{financial_analysis.net_lifetime_profit.toLocaleString('en-IN')} ({financial_analysis.roi_25yr_pct}% ROI)</td>
                  <td className="py-2.5 px-3 text-gov-500">Lifetime system warranty financial simulation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6: Matched Schemes */}
        <div className="space-y-3 print-avoid-break">
          <h3 className="text-sm font-bold text-gov-950 flex items-center gap-2 border-b border-gov-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-solar-600" />
            <span>5. Government Schemes & Subsidy Guidance</span>
          </h3>

          <div className="space-y-2.5">
            {(scheme_guidance || []).map((sg, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-gov-200 bg-gov-50/60 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gov-900">{sg.scheme_name}</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {sg.potential_subsidy_display}
                  </span>
                </div>
                <p className="text-gov-600 text-[11px]">Authority: {sg.ministry}</p>
                <div className="text-gov-500 text-[11px]">
                  <strong>Key Documents: </strong>{sg.required_documents ? `${sg.required_documents.slice(0, 140)}...` : 'Standard documentation required'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Environmental Impact */}
        <div className="p-5 rounded-2xl bg-emerald-950 text-white space-y-3 print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Trees className="w-4 h-4" />
            <span>6. Environmental & Sustainability Impact</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-lg font-black text-white font-mono block">{environmental_impact.co2_avoided_annual_tonnes} Tonnes</span>
              <span className="text-[10px] text-emerald-300">CO₂ Avoided / Year</span>
            </div>
            <div>
              <span className="text-lg font-black text-white font-mono block">{environmental_impact.co2_avoided_lifetime_tonnes} Tonnes</span>
              <span className="text-[10px] text-emerald-300">25-Yr Carbon Offset</span>
            </div>
            <div>
              <span className="text-lg font-black text-white font-mono block">{environmental_impact.trees_equivalent_annual} Trees</span>
              <span className="text-[10px] text-emerald-300">Annual Trees Equiv.</span>
            </div>
            <div>
              <span className="text-lg font-black text-white font-mono block">{environmental_impact.coal_saved_annual_kg.toLocaleString('en-IN')} kg</span>
              <span className="text-[10px] text-emerald-300">Coal Burning Saved / Yr</span>
            </div>
          </div>
        </div>

        {/* Section 8: Implementation Roadmap */}
        <div className="space-y-3 print-avoid-break">
          <h3 className="text-sm font-bold text-gov-950 flex items-center gap-2 border-b border-gov-100 pb-2">
            <Calendar className="w-4 h-4 text-solar-600" />
            <span>7. 10-Step Implementation Roadmap</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(installation_roadmap || []).slice(0, 6).map((step) => (
              <div key={step.step} className="p-2.5 rounded-lg border border-gov-200 bg-white flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-solar-100 text-solar-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {step.step}
                </span>
                <div>
                  <p className="font-bold text-gov-900">{step.title} <span className="text-gov-400 font-normal">({step.duration})</span></p>
                  <p className="text-[11px] text-gov-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 9: Engineering Assumptions Table */}
        <div className="p-4 rounded-2xl bg-gov-50 border border-gov-200 space-y-2 text-xs print-avoid-break">
          <h4 className="font-bold text-gov-800">8. Engineering & Financial Assumptions Used</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-gov-600">
            {Object.entries(assumptions || {}).map(([k, v], idx) => (
              <div key={idx}>
                <span className="text-gov-500">{k}:</span> <strong>{v}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Section 10: Legal Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-[11px] text-slate-600 leading-relaxed print-avoid-break">
          <p className="font-bold text-slate-800 mb-0.5">Planning & Regulatory Notice:</p>
          {disclaimer}
        </div>

        {/* Report Footer */}
        <div className="pt-4 border-t border-gov-200 flex flex-col sm:flex-row justify-between items-center text-xs text-gov-500 gap-2">
          <span>SolarSahayak Guidance System • National Portal for Rooftop Solar</span>
          <span className="font-mono">Verification Code: {report_code}</span>
        </div>

      </div>

    </div>
  );
};
