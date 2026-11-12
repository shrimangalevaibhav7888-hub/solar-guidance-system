import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Cable, 
  Wrench, 
  CreditCard, 
  HelpCircle, 
  Info,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { CostBreakdownChart } from '../components/CostBreakdownChart';
import { StepWizardNav } from '../components/StepWizardNav';
import { Disclaimer } from '../components/Disclaimer';

export const CostEstimatorPage: React.FC = () => {
  const { result, inputState } = useSolar();

  const [capacity, setCapacity] = useState<number>(result?.recommended_capacity_kw || 3.3);
  const [costData, setCostData] = useState<{
    grossCost: number;
    subsidy: number;
    netCost: number;
    emi: number;
    breakdown: {
      solar_panels: number;
      inverter: number;
      mounting_structure: number;
      electrical_and_bos: number;
      installation_and_netmetering: number;
      total_gross_cost: number;
    };
  }>({
    grossCost: 181500,
    subsidy: 78000,
    netCost: 103500,
    emi: 2050,
    breakdown: {
      solar_panels: 81675,
      inverter: 36300,
      mounting_structure: 27225,
      electrical_and_bos: 18150,
      installation_and_netmetering: 18150,
      total_gross_cost: 181500
    }
  });

  // Calculate live costs as slider changes
  useEffect(() => {
    let ratePerKw = 55000;
    if (capacity <= 2.0) ratePerKw = 65000;
    else if (capacity <= 5.0) ratePerKw = 55000;
    else ratePerKw = 50000;

    const gross = Math.round(capacity * ratePerKw);

    // Subsidy
    let sub = 0;
    if (inputState.propertyType === 'Home') {
      if (capacity <= 1.0) sub = 30000 * capacity;
      else if (capacity <= 2.0) sub = 30000 + (capacity - 1) * 30000;
      else if (capacity <= 3.0) sub = 60000 + (capacity - 2) * 18000;
      else sub = 78000;
    }

    const net = Math.max(0, gross - sub);

    // 7% loan EMI for 60 months
    const r = 0.07 / 12;
    const n = 60;
    const emi = net > 0 ? Math.round((net * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0;

    setCostData({
      grossCost: gross,
      subsidy: Math.round(sub),
      netCost: net,
      emi: emi,
      breakdown: {
        solar_panels: Math.round(gross * 0.45),
        inverter: Math.round(gross * 0.20),
        mounting_structure: Math.round(gross * 0.15),
        electrical_and_bos: Math.round(gross * 0.10),
        installation_and_netmetering: Math.round(gross * 0.10),
        total_gross_cost: gross
      }
    });
  }, [capacity, inputState.propertyType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gov-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-solar-600 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Step 4 of 8 • Cost Estimator & Bill of Materials</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-950 font-display">
              Installation Cost & Subsidy Estimator
            </h1>
            <p className="text-xs sm:text-sm text-gov-600 mt-1">
              Explore itemized component pricing, potential PM Surya Ghar direct cash assistance, and out-of-pocket investment.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              System Scale: {capacity} kWp ({Math.ceil(capacity / 0.55)} × 550W Panels)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Sizing Capacity Slider */}
      <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-gov-950">Adjust System Capacity to Compare Pricing</h3>
            <p className="text-xs text-gov-500">Slide to test different rooftop solar capacity tiers</p>
          </div>
          <span className="text-xl font-black text-solar-600 font-display">
            {capacity} kWp
          </span>
        </div>

        <input
          type="range"
          min="1.0"
          max="15.0"
          step="0.55"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="w-full accent-solar-500 h-2.5 bg-gov-200 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-bold text-gov-500">
          <span>1.0 kW (Compact)</span>
          <span>3.3 kW (Standard Home)</span>
          <span>5.5 kW (Large Villa)</span>
          <span>10+ kW (Commercial/Society)</span>
        </div>
      </div>

      {/* 3 Metric Pillars: Gross Cost, Subsidy, Net Out-of-Pocket */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gross Cost */}
        <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-2">
          <span className="text-xs font-bold text-gov-500 uppercase tracking-wider block">Gross Turnkey Price</span>
          <div className="text-3xl font-black text-gov-950 font-display">
            ₹{costData.grossCost.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-gov-500 leading-relaxed">
            Includes Tier-1 ALMM modules, inverter, structure, cables & DISCOM commissioning.
          </p>
        </div>

        {/* Potential Subsidy */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-card space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">PM Surya Ghar Subsidy</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">Direct DBT</span>
          </div>
          <div className="text-3xl font-black text-emerald-700 font-display">
            ₹{costData.subsidy.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            {inputState.propertyType === 'Home' 
              ? 'Direct Benefit Transfer into applicant bank account post meter commissioning.' 
              : 'Commercial property: 40% Accelerated Depreciation tax benefit.'}
          </p>
        </div>

        {/* Net Cost */}
        <div className="p-6 rounded-3xl bg-gov-950 text-white shadow-card space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Net Out-of-Pocket Cost</span>
          <div className="text-3xl font-black text-solar-400 font-display">
            ₹{costData.netCost.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Your estimated net investment payable to the empanelled solar vendor.
          </p>
        </div>

      </div>

      {/* Main Grid: Itemized BOM (Left) + Concessional Loan & Slabs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Itemized BOM breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-4">
            <h3 className="text-base font-bold text-gov-950 font-display">
              Itemized Turnkey Bill of Materials (BOM)
            </h3>
            <CostBreakdownChart
              breakdown={costData.breakdown}
              subsidy={costData.subsidy}
              netCost={costData.netCost}
            />
          </div>
        </div>

        {/* Right: Green Loan EMI & Subsidy Rules */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Concessional Green Loan Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-solar-50 to-amber-50/80 border border-solar-200 shadow-card space-y-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-solar-700" />
              <h4 className="text-sm font-bold text-gov-950 font-display">7% Concessional Green Solar Loan</h4>
            </div>

            <p className="text-xs text-gov-700 leading-relaxed">
              Under PM Surya Ghar, public sector banks (SBI, Canara, PNB, BoB) provide collateral-free loans at ~7% interest for up to 3 kW systems.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-solar-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gov-600">Loan Amount:</span>
                <span className="font-bold text-gov-900">₹{costData.netCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gov-600">Interest Rate / Tenure:</span>
                <span className="font-bold text-gov-900">7.0% p.a. • 5 Years (60 Mo)</span>
              </div>
              <div className="border-t border-gov-100 pt-2 flex justify-between items-center">
                <span className="text-xs font-bold text-gov-800">Estimated Monthly EMI:</span>
                <span className="text-lg font-black text-solar-700 font-mono">₹{costData.emi.toLocaleString('en-IN')}/mo</span>
              </div>
            </div>

            <p className="text-[10px] text-gov-500 italic">
              Note: Monthly electricity bill savings typically exceed the monthly loan EMI, making rooftop solar cashflow positive from Month 1!
            </p>
          </div>

          {/* PM Surya Ghar Subsidy Slabs */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gov-700 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-gov-500" />
              <span>Official PM Surya Ghar Subsidy Slabs</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-gov-50 flex justify-between items-center">
                <div>
                  <span className="font-bold text-gov-900 block">1 kW System</span>
                  <span className="text-[10px] text-gov-500">Up to 150 units/mo</span>
                </div>
                <span className="font-bold text-emerald-700 font-mono">₹30,000 CFA</span>
              </div>

              <div className="p-2.5 rounded-xl bg-gov-50 flex justify-between items-center">
                <div>
                  <span className="font-bold text-gov-900 block">2 kW System</span>
                  <span className="text-[10px] text-gov-500">150 to 300 units/mo</span>
                </div>
                <span className="font-bold text-emerald-700 font-mono">₹60,000 CFA</span>
              </div>

              <div className="p-2.5 rounded-xl bg-gov-50 flex justify-between items-center">
                <div>
                  <span className="font-bold text-gov-900 block">3 kW & Higher Systems</span>
                  <span className="text-[10px] text-gov-500">&gt;300 units/mo</span>
                </div>
                <span className="font-bold text-emerald-700 font-mono">₹78,000 Max Cap</span>
              </div>
            </div>

            <p className="text-[10px] text-gov-400 italic">
              Special category states receive ₹33k for 1kW, ₹66k for 2kW, and up to ₹85,800 for 3kW+.
            </p>
          </div>

        </div>

      </div>

      <Disclaimer variant="banner" customText="Turnkey costs reflect standard industry rates. Final quotations from empanelled installers may vary depending on rooftop accessibility, elevated mounting structures, and custom wiring runs." />

      <StepWizardNav
        currentStep={4}
        totalSteps={8}
        backPath="/schemes"
        nextPath="/savings"
        nextLabel="View 10-Year Savings & ROI"
      />

    </div>
  );
};
