import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Zap, 
  Home, 
  MapPin, 
  Sun, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  Layers, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { INDIAN_STATES } from '../data/indianStates';
import { StepWizardNav } from '../components/StepWizardNav';
import { Disclaimer } from '../components/Disclaimer';

export const SolarCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { inputState, updateInput, calculate, isCalculating, error } = useSolar();

  const [activeTab, setActiveTab] = useState<'units' | 'bill'>(inputState.inputType);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const stateData = INDIAN_STATES[inputState.state] || INDIAN_STATES['Maharashtra'];

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (activeTab === 'units' && (!inputState.monthlyUnits || inputState.monthlyUnits <= 0)) {
      errs.monthlyUnits = 'Please enter a valid monthly consumption in units (kWh) greater than 0.';
    }
    if (activeTab === 'bill' && (!inputState.monthlyBill || inputState.monthlyBill <= 0)) {
      errs.monthlyBill = 'Please enter a valid average monthly electricity bill greater than ₹0.';
    }
    if (!inputState.roofArea || inputState.roofArea <= 0) {
      errs.roofArea = 'Please specify available shadow-free roof area in sq.ft. (greater than 0).';
    }
    if (!inputState.state) {
      errs.state = 'Please select your state.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    try {
      await calculate({ inputType: activeTab });
      navigate('/solar-results');
    } catch (err) {
      // Error handled by SolarContext
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-gov-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-solar-600 uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" />
              <span>Step 1 of 8 • Solar Sizing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-950 font-display">
              Solar Requirement Calculator
            </h1>
            <p className="text-xs sm:text-sm text-gov-600 mt-1">
              Enter your monthly electricity usage and roof details to compute the optimal solar system size, panel count, and generation yield.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gov-500 font-medium">State Benchmark:</span>
            <span className="px-2.5 py-1 rounded-lg bg-solar-50 border border-solar-200 text-xs font-bold text-solar-800">
              {inputState.state} (₹{stateData.tariff}/kWh)
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-800">Calculation Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Form Inputs (Left) + Realtime Preview Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Sections */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          
          {/* SECTION 1: Electricity Consumption Details */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-gov-100">
              <div className="w-8 h-8 rounded-xl bg-solar-50 text-solar-600 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gov-950">1. Electricity Consumption Information</h3>
                <p className="text-[11px] text-gov-500">Choose between your monthly units (kWh) or average bill amount</p>
              </div>
            </div>

            {/* Switch Tabs */}
            <div className="flex p-1 bg-gov-100 rounded-xl max-w-md">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('units');
                  updateInput({ inputType: 'units' });
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'units'
                    ? 'bg-white text-gov-900 shadow-sm'
                    : 'text-gov-600 hover:text-gov-900'
                }`}
              >
                I know my monthly units (kWh)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('bill');
                  updateInput({ inputType: 'bill' });
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'bill'
                    ? 'bg-white text-gov-900 shadow-sm'
                    : 'text-gov-600 hover:text-gov-900'
                }`}
              >
                I only know my monthly bill (₹)
              </button>
            </div>

            {activeTab === 'units' ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gov-800">
                    Monthly Electricity Units (kWh) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-solar-700 bg-solar-50 px-2 py-0.5 rounded border border-solar-200">
                    {inputState.monthlyUnits || 0} kWh / month
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={inputState.monthlyUnits || ''}
                  onChange={(e) => updateInput({ monthlyUnits: Number(e.target.value) })}
                  placeholder="e.g. 300"
                  className="w-full px-4 py-2.5 rounded-xl border border-gov-300 focus:ring-2 focus:ring-solar-500 focus:outline-none text-sm font-semibold"
                />
                {formErrors.monthlyUnits && (
                  <p className="text-[11px] text-red-600 font-medium">{formErrors.monthlyUnits}</p>
                )}
                <p className="text-[11px] text-gov-500 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Check the "Units Consumed" or "Total kWh" line on your latest electricity bill.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gov-800">
                    Average Monthly Bill (₹) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-solar-700 bg-solar-50 px-2 py-0.5 rounded border border-solar-200">
                    ₹{(inputState.monthlyBill || 0).toLocaleString()} / month
                  </span>
                </div>
                <input
                  type="number"
                  min="100"
                  max="500000"
                  value={inputState.monthlyBill || ''}
                  onChange={(e) => updateInput({ monthlyBill: Number(e.target.value) })}
                  placeholder="e.g. 2500"
                  className="w-full px-4 py-2.5 rounded-xl border border-gov-300 focus:ring-2 focus:ring-solar-500 focus:outline-none text-sm font-semibold"
                />
                {formErrors.monthlyBill && (
                  <p className="text-[11px] text-red-600 font-medium">{formErrors.monthlyBill}</p>
                )}
                <div className="p-3 rounded-xl bg-gov-50 border border-gov-200 text-[11px] text-gov-600 space-y-1">
                  <p className="font-semibold text-gov-800">Automatic Unit Derivation:</p>
                  <p>
                    Estimated consumption: <strong>{Math.round((inputState.monthlyBill || 0) / stateData.tariff)} kWh/month</strong> based on {inputState.state}'s average domestic tariff of ₹{stateData.tariff}/unit.
                  </p>
                  <p className="text-gov-500 italic">Note: Actual unit consumption may vary slightly due to fixed meter charges and telescopic tariff slabs.</p>
                </div>
              </div>
            )}

            {/* Custom Tariff Override Option */}
            <div className="pt-2 border-t border-gov-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-gov-700">Electricity Tariff Rate (₹/kWh):</span>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="20"
                  value={inputState.tariff}
                  onChange={(e) => updateInput({ tariff: Number(e.target.value) })}
                  className="w-24 px-2.5 py-1 rounded-lg border border-gov-300 text-xs font-bold text-right"
                />
                <span className="text-gov-500 font-medium">₹/unit</span>
              </div>
            </div>

          </div>

          {/* SECTION 2: Roof & Property Information */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-gov-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gov-950">2. Roof & Structural Information</h3>
                <p className="text-[11px] text-gov-500">Specify shadow-free space and roof construction</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Roof Area */}
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gov-800">
                    Available Shadow-Free Roof Area (sq. ft.) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-gov-900">
                    {inputState.roofArea || 0} sq.ft. (~{Math.round((inputState.roofArea || 0) * 0.0929)} sq.m)
                  </span>
                </div>
                <input
                  type="number"
                  min="50"
                  max="50000"
                  value={inputState.roofArea || ''}
                  onChange={(e) => updateInput({ roofArea: Number(e.target.value) })}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 rounded-xl border border-gov-300 focus:ring-2 focus:ring-solar-500 focus:outline-none text-sm font-semibold"
                />
                {formErrors.roofArea && (
                  <p className="text-[11px] text-red-600 font-medium">{formErrors.roofArea}</p>
                )}
                <p className="text-[10px] text-gov-500">
                  Tip: Standard residential 1 kW solar system requires approximately 80 sq.ft. of shadow-free rooftop space.
                </p>
              </div>

              {/* Roof Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gov-800">Roof Surface Type</label>
                <select
                  value={inputState.roofType}
                  onChange={(e) => updateInput({ roofType: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gov-300 bg-gov-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-solar-500"
                >
                  <option value="RCC">Flat RCC Concrete Roof (Standard)</option>
                  <option value="Metal">Pitched Metal / Tin Sheet Roof</option>
                  <option value="Tiled">Slanted Mangalore / Clay Tiled Roof</option>
                  <option value="Other">Elevated / Terrace Structure</option>
                </select>
              </div>

              {/* Shading Condition */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gov-800">Daytime Shading Condition</label>
                <select
                  value={inputState.shading}
                  onChange={(e) => updateInput({ shading: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gov-300 bg-gov-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-solar-500"
                >
                  <option value="Low">Low / No Shading (Full 9am-4pm Sun)</option>
                  <option value="Medium">Medium (Partial shade from trees/parapet)</option>
                  <option value="High">High (Significant nearby tall buildings)</option>
                </select>
              </div>

            </div>

          </div>

          {/* SECTION 3: Location & Consumer Category */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-gov-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gov-950">3. Location & Property Category</h3>
                <p className="text-[11px] text-gov-500">Enables exact state scheme eligibility and DISCOM rules</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* State */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gov-800">State <span className="text-red-500">*</span></label>
                <select
                  value={inputState.state}
                  onChange={(e) => updateInput({ state: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gov-300 bg-gov-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-solar-500"
                >
                  {Object.keys(INDIAN_STATES).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* District / City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gov-800">District / City</label>
                <select
                  value={inputState.district}
                  onChange={(e) => updateInput({ district: e.target.value, city: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gov-300 bg-gov-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-solar-500"
                >
                  {stateData.districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gov-800">Property Type</label>
                <select
                  value={inputState.propertyType}
                  onChange={(e) => updateInput({ propertyType: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gov-300 bg-gov-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-solar-500"
                >
                  <option value="Home">Individual Home / Villa (Subsidy Eligible)</option>
                  <option value="Shop">Commercial Shop / Office</option>
                  <option value="Institution">School / Hospital / Institution</option>
                </select>
              </div>

            </div>

            {/* DISCOM Info */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-solar-600 shrink-0" />
                <span className="text-gov-700 font-medium">Empanelled DISCOM Authority:</span>
              </div>
              <span className="font-bold text-gov-900">{stateData.discoms[0] || 'State Power Distribution'}</span>
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 text-white font-black text-sm shadow-xl shadow-solar-500/25 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sun className="w-5 h-5" />
              <span>{isCalculating ? 'Computing Engineering Sizing...' : 'Calculate My Solar Recommendation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

        {/* Right Column: Sticky Live Sizing Preview Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          
          <div className="p-6 rounded-3xl bg-gov-950 text-white shadow-xl border border-gov-800 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-gov-800">
              <div className="flex items-center space-x-2">
                <Sun className="w-5 h-5 text-solar-400" />
                <h4 className="text-sm font-bold font-display text-white">Live Sizing Summary</h4>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-solar-500/20 text-solar-300 border border-solar-500/30">
                Auto-updating
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-3 text-xs">
              
              <div className="flex justify-between items-center py-1 border-b border-gov-900">
                <span className="text-slate-400">Monthly Usage:</span>
                <span className="font-bold text-white">
                  {activeTab === 'units' ? `${inputState.monthlyUnits || 0} units` : `₹${(inputState.monthlyBill || 0).toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-gov-900">
                <span className="text-slate-400">Annual Baseline:</span>
                <span className="font-bold text-white">
                  {((activeTab === 'units' ? (inputState.monthlyUnits || 0) : Math.round((inputState.monthlyBill || 0) / (stateData?.tariff || 7.5))) * 12).toLocaleString()} kWh/yr
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-gov-900">
                <span className="text-slate-400">Available Roof:</span>
                <span className="font-bold text-white">{inputState.roofArea || 0} sq.ft.</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-gov-900">
                <span className="text-slate-400">Estimated Sizing:</span>
                <span className="font-bold text-solar-400 font-mono text-sm">
                  {Math.max(1, Math.round(((activeTab === 'units' ? (inputState.monthlyUnits || 0) : ((inputState.monthlyBill || 0) / (stateData?.tariff || 7.5))) * 12 / (1460 * (stateData?.insolationFactor || 1.0))) * 10) / 10)} kW
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Potential Subsidy:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {inputState.propertyType === 'Home' ? 'Up to ₹78,000' : 'Tax AD 40%'}
                </span>
              </div>

            </div>

            {/* Transparency Note */}
            <div className="p-3 rounded-xl bg-gov-900/80 border border-gov-800 text-[11px] text-slate-300 leading-relaxed">
              <span className="font-semibold text-solar-300">Engineering Method: </span>
              Capacity is calculated using state solar insolation, 550W Tier-1 module dimensions, and shadow-free roof boundaries.
            </div>

            <button
              onClick={() => handleSubmit()}
              disabled={isCalculating}
              className="w-full py-2.5 rounded-xl bg-solar-500 hover:bg-solar-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Continue to Step 2 →
            </button>

          </div>

          <Disclaimer variant="banner" />

        </div>

      </div>

      <StepWizardNav
        currentStep={1}
        totalSteps={8}
        nextLabel="Compute & View Solar Recommendation"
        onNext={() => handleSubmit()}
        isLoading={isCalculating}
      />

    </div>
  );
};
