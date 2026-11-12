import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Zap, 
  Award, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Leaf, 
  Building2, 
  HelpCircle, 
  Layers, 
  TrendingUp,
  FileCheck2,
  PhoneCall,
  Sliders
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES } from '../data/indianStates';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadDemoScenario, updateInput, calculate, isCalculating } = useSolar();
  const { isAuthenticated, demoLogin } = useAuth();

  // Quick Calculator Widget State on Hero
  const [quickInputType, setQuickInputType] = useState<'units' | 'bill'>('units');
  const [quickUnits, setQuickUnits] = useState<number>(300);
  const [quickBill, setQuickBill] = useState<number>(2500);
  const [quickState, setQuickState] = useState<string>('Maharashtra');
  const [quickRoof, setQuickRoof] = useState<number>(500);
  const [quickResult, setQuickResult] = useState<{
    capacity: number;
    panels: number;
    subsidy: number;
    annualSavings: number;
  }>({
    capacity: 2.75,
    panels: 5,
    subsidy: 73500,
    annualSavings: 32900
  });

  // Re-calculate hero widget live
  useEffect(() => {
    const tariff = INDIAN_STATES[quickState]?.tariff || 7.5;
    const units = quickInputType === 'units' ? quickUnits : Math.round(quickBill / tariff);
    const annualGenPerKw = 1460 * (INDIAN_STATES[quickState]?.insolationFactor || 1.0);
    const capNeeded = (units * 12) / annualGenPerKw;
    const maxRoofCap = quickRoof / 80;
    const effCap = Math.min(capNeeded, maxRoofCap);
    const panels = Math.max(2, Math.ceil(effCap / 0.55));
    const finalCap = Math.round(panels * 0.55 * 100) / 100;
    
    let sub = 0;
    if (finalCap <= 1) sub = 30000;
    else if (finalCap <= 2) sub = 60000;
    else sub = 78000;

    const annSav = Math.round(finalCap * annualGenPerKw * tariff);

    setQuickResult({
      capacity: finalCap,
      panels: panels,
      subsidy: sub,
      annualSavings: annSav
    });
  }, [quickInputType, quickUnits, quickBill, quickState, quickRoof]);

  const handleHeroCalculate = async () => {
    updateInput({
      inputType: quickInputType,
      monthlyUnits: quickUnits,
      monthlyBill: quickBill,
      state: quickState,
      roofArea: quickRoof
    });
    try {
      await calculate({
        inputType: quickInputType,
        monthlyUnits: quickUnits,
        monthlyBill: quickBill,
        state: quickState,
        roofArea: quickRoof
      });
      navigate('/solar-results');
    } catch (e) {
      navigate('/calculator');
    }
  };

  const handleDemoClick = async () => {
    if (!isAuthenticated) {
      await demoLogin();
    }
    await loadDemoScenario();
    navigate('/solar-results');
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-gov-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          
          {/* Top National Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-solar-400 animate-pulse"></span>
              <span className="font-semibold text-solar-300">PM Surya Ghar: Muft Bijli Yojana</span>
              <span className="text-slate-400">| Up to ₹78,000 Direct Central Subsidy</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-white leading-tight">
                Switch to Solar with <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-solar-300 via-solar-400 to-amber-500 bg-clip-text text-transparent">
                  Confidence & Clarity.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Calculate your precise solar requirement, discover applicable government schemes, estimate lifetime electricity savings, and follow the 10-step verified installation process.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/calculator"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 text-white text-sm font-bold shadow-lg shadow-solar-500/25 flex items-center justify-center space-x-2 active:scale-95 transition-all"
                >
                  <Sun className="w-5 h-5" />
                  <span>Calculate My Solar Requirement</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/schemes"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 text-slate-200 border border-slate-700 text-sm font-bold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Award className="w-4 h-4 text-solar-400" />
                  <span>Explore Government Schemes</span>
                </Link>
              </div>

              {/* 1-Click Demo Quick Trigger */}
              <div className="pt-2 flex items-center justify-center lg:justify-start space-x-3 text-xs text-slate-400">
                <span>Want a quick preview?</span>
                <button
                  onClick={handleDemoClick}
                  disabled={isCalculating}
                  className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  {isCalculating ? 'Loading demo scenario...' : 'Try Demo Assessment (MH Home 300 units)'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 text-left">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">Unbiased Sizing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">DBT Subsidy Rules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">DISCOM Empanelled</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quick Solar Sizing Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white text-gov-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
                
                <div className="flex items-center justify-between pb-4 border-b border-gov-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-solar-100 text-solar-700 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gov-950 font-display">Instant Solar Sizer</h3>
                      <p className="text-[11px] text-gov-500">Live preview calculator</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Live Engine
                  </span>
                </div>

                {/* Widget Inputs */}
                <div className="mt-4 space-y-4 text-xs">
                  
                  {/* State Selection */}
                  <div>
                    <label className="block font-semibold text-gov-700 mb-1">State / Location</label>
                    <select
                      value={quickState}
                      onChange={(e) => setQuickState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gov-300 bg-gov-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-solar-500"
                    >
                      {Object.keys(INDIAN_STATES).map((st) => (
                        <option key={st} value={st}>{st} (Avg ₹{INDIAN_STATES[st].tariff}/unit)</option>
                      ))}
                    </select>
                  </div>

                  {/* Input Type Selector: Units vs Bill */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="font-semibold text-gov-700">Monthly Electricity</label>
                      <div className="flex bg-gov-100 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setQuickInputType('units')}
                          className={`px-2 py-0.5 rounded ${quickInputType === 'units' ? 'bg-white shadow-sm text-gov-900' : 'text-gov-500'}`}
                        >
                          Units (kWh)
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickInputType('bill')}
                          className={`px-2 py-0.5 rounded ${quickInputType === 'bill' ? 'bg-white shadow-sm text-gov-900' : 'text-gov-500'}`}
                        >
                          Bill (₹)
                        </button>
                      </div>
                    </div>

                    {quickInputType === 'units' ? (
                      <div>
                        <div className="flex justify-between text-xs font-bold text-gov-900 mb-1">
                          <span>{quickUnits} units / month</span>
                          <span className="text-gov-500 font-normal">~{(quickUnits * 12).toLocaleString()} kWh/yr</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="1500"
                          step="25"
                          value={quickUnits}
                          onChange={(e) => setQuickUnits(Number(e.target.value))}
                          className="w-full accent-solar-500 h-2 bg-gov-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between text-xs font-bold text-gov-900 mb-1">
                          <span>₹{quickBill.toLocaleString()} / month</span>
                          <span className="text-gov-500 font-normal">~{Math.round(quickBill / (INDIAN_STATES[quickState]?.tariff || 7.5))} units</span>
                        </div>
                        <input
                          type="range"
                          min="800"
                          max="15000"
                          step="200"
                          value={quickBill}
                          onChange={(e) => setQuickBill(Number(e.target.value))}
                          className="w-full accent-solar-500 h-2 bg-gov-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Available Roof Area */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gov-700 mb-1">
                      <span>Roof Space Available</span>
                      <span className="font-bold text-gov-900">{quickRoof} sq.ft.</span>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="3000"
                      step="50"
                      value={quickRoof}
                      onChange={(e) => setQuickRoof(Number(e.target.value))}
                      className="w-full accent-solar-500 h-2 bg-gov-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Calculated Output Preview Card */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-solar-50 to-amber-50/70 border border-solar-200 grid grid-cols-2 gap-3 text-left">
                    <div>
                      <span className="text-[10px] font-semibold text-gov-600 block">Recommended Capacity</span>
                      <span className="text-lg font-black text-gov-950 font-display">{quickResult.capacity} kW</span>
                      <span className="text-[10px] text-gov-500 block">({quickResult.panels} × 550W Panels)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-gov-600 block">Gov Subsidy (DBT)</span>
                      <span className="text-lg font-black text-emerald-700 font-display">₹{quickResult.subsidy.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-emerald-600 font-medium block">PM Surya Ghar</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-solar-200/60 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gov-700">Estimated Annual Savings:</span>
                      <span className="text-sm font-black text-gov-950 font-mono">₹{quickResult.annualSavings.toLocaleString('en-IN')}/yr</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleHeroCalculate}
                    disabled={isCalculating}
                    className="w-full py-3 rounded-xl bg-gov-950 hover:bg-gov-900 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
                  >
                    <span>{isCalculating ? 'Processing...' : 'View Complete Assessment & Breakdown'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-[10px] text-gov-400 text-center italic">
                    Planning estimate based on {quickState} tariff & solar insolation.
                  </p>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-solar-600 bg-solar-50 px-3 py-1 rounded-full border border-solar-200">
            Transparent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gov-950 mt-3 font-display">
            How SolarSahayak Works
          </h2>
          <p className="text-sm text-gov-600 mt-2">
            6 simple steps to transition your home, society, or commercial property to solar power with guaranteed government financial assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: '01', title: 'Enter Details', desc: 'Provide monthly units or bill & available roof area.' },
            { step: '02', title: 'Size System', desc: 'Calculate exact kW capacity and 550W panel count.' },
            { step: '03', title: 'Check Schemes', desc: 'Verify eligibility for PM Surya Ghar & state policies.' },
            { step: '04', title: 'Estimate Cost', desc: 'Review turnkey BOM cost, subsidy & net investment.' },
            { step: '05', title: 'Compare ROI', desc: 'Explore 10-year cumulative savings & payback curve.' },
            { step: '06', title: 'Install Solar', desc: 'Connect with DISCOM-empanelled verified installers.' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-gov-200/80 shadow-card hover:shadow-soft hover:border-solar-300 transition-all text-center group">
              <span className="inline-block text-xs font-black text-solar-600 bg-solar-50 px-2.5 py-1 rounded-lg border border-solar-100 mb-3 group-hover:scale-110 transition-transform">
                {item.step}
              </span>
              <h4 className="text-sm font-bold text-gov-900 mb-1">{item.title}</h4>
              <p className="text-xs text-gov-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6 MAIN FEATURE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-eco-700 bg-eco-50 px-3 py-1 rounded-full border border-eco-200">
            Core Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gov-950 mt-3 font-display">
            Engineered for Total Solar Transparency
          </h2>
          <p className="text-sm text-gov-600 mt-2">
            Every calculation tool is built on transparent physics, realistic DISCOM tariffs, and official MNRE guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200/80 shadow-card hover:shadow-soft transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-solar-50 text-solar-600 flex items-center justify-center mb-4">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gov-950 font-display">Solar Requirement Calculator</h3>
              <p className="text-xs text-gov-600 mt-2 leading-relaxed">
                Determine your optimal kW capacity, 550W panel layout, roof area feasibility, and daily generation yield customized to your state's solar insolation.
              </p>
            </div>
            <Link to="/calculator" className="mt-6 inline-flex items-center text-xs font-bold text-solar-600 hover:text-solar-700">
              <span>Launch Calculator</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200/80 shadow-card hover:shadow-soft transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gov-950 font-display">Scheme & Eligibility Engine</h3>
              <p className="text-xs text-gov-600 mt-2 leading-relaxed">
                Database-driven evaluation against PM Surya Ghar, Surya Gujarat, Delhi GBI, and state policies with clear criteria checks and required document checklists.
              </p>
            </div>
            <Link to="/schemes" className="mt-6 inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700">
              <span>Explore Schemes</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200/80 shadow-card hover:shadow-soft transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gov-950 font-display">Subsidy & Cost Estimator</h3>
              <p className="text-xs text-gov-600 mt-2 leading-relaxed">
                Itemized Bill of Materials (BOM) breakdown for modules, inverters, structures, balance of system, and 7% concessional green loan EMI calculations.
              </p>
            </div>
            <Link to="/cost-estimator" className="mt-6 inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700">
              <span>Calculate Cost & Subsidy</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200/80 shadow-card hover:shadow-soft transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gov-950 font-display">10-Year Savings & Payback</h3>
              <p className="text-xs text-gov-600 mt-2 leading-relaxed">
                Interactive financial simulation factoring in annual electricity tariff inflation (4%) and module degradation (0.7%) with break-even curves.
              </p>
            </div>
            <Link to="/savings" className="mt-6 inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700">
              <span>Simulate ROI</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200/80 shadow-card hover:shadow-soft transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gov-950 font-display">Environmental Impact</h3>
              <p className="text-xs text-gov-600 mt-2 leading-relaxed">
                Track exact lifecycle metrics: metric tonnes of CO₂ emissions avoided, equivalent trees planted, thermal coal saved, and petrol vehicle offsets.
              </p>
            </div>
            <Link to="/environment" className="mt-6 inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-700">
              <span>View Eco Metrics</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl bg-white border border-gov-200/80 shadow-card hover:shadow-soft transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gov-950 font-display">Consultation Solar Report</h3>
              <p className="text-xs text-gov-600 mt-2 leading-relaxed">
                Generate a formal, publication-ready PDF & printable consultation report with engineering parameters, scheme details, roadmap, and assumptions.
              </p>
            </div>
            <Link to="/report" className="mt-6 inline-flex items-center text-xs font-bold text-purple-600 hover:text-purple-700">
              <span>View Sample Report</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

        </div>
      </section>

      {/* EDUCATIONAL SNIPPET: UNDERSTAND SOLAR IN 60 SECONDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-gov-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-solar-400 bg-solar-950/80 px-3 py-1 rounded-full border border-solar-800">
                Quick Knowledge Hub
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                Understand Solar in 60 Seconds
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Confused between kW vs kWh? Wondering how net metering credits work or why 550W Mono PERC panels are recommended? We’ve broken down solar engineering into simple, jargon-free explanations.
              </p>
              <div className="pt-3 flex flex-wrap gap-2 text-xs">
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 font-medium">⚡ kW vs kWh</span>
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 font-medium">🔄 Net Metering</span>
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 font-medium">🏦 Direct Benefit Subsidy</span>
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 font-medium">🔌 Inverter Technology</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <Link
                to="/learn-solar"
                className="px-6 py-3.5 rounded-xl bg-solar-500 hover:bg-solar-600 text-white text-xs font-bold shadow-lg shadow-solar-500/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Read 60-Sec Solar Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
