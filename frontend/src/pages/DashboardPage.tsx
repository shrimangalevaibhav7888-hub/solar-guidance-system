import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, 
  User, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Clock, 
  FileText, 
  Award, 
  Wrench,
  Trees,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSolar } from '../context/SolarContext';
import { StatCard } from '../components/StatCard';
import { api } from '../services/api';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { result, inputState, loadDemoScenario, isCalculating } = useSolar();
  const [pastReports, setPastReports] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      api.getUserReports(user.id).then(setPastReports).catch(console.error);
    }
  }, [user]);

  const steps = [
    { name: 'Profile Information', done: !!user },
    { name: 'Electricity Baseline', done: !!inputState.monthlyUnits || !!inputState.monthlyBill },
    { name: 'Solar Sizing Calculation', done: !!result },
    { name: 'Scheme & Subsidy Check', done: !!result },
    { name: 'Cost & BOM Breakdown', done: !!result },
    { name: '10-Year Savings Simulation', done: !!result },
    { name: 'Environmental Impact', done: !!result },
    { name: 'Personalized Solar Report', done: !!result },
  ];

  const completedStepsCount = steps.filter(s => s.done).length;
  const progressPct = Math.round((completedStepsCount / steps.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-gov-950 via-slate-900 to-gov-900 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-400 bg-solar-950/80 px-2.5 py-0.5 rounded-full border border-solar-800">
              Solar Dashboard
            </span>
            {user?.is_demo && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⚡ Demo Presentation Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Welcome back, {user?.name || 'Solar Explorer'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-solar-400" />
            <span>{user?.district || inputState.district}, {user?.state || inputState.state}</span>
            <span>•</span>
            <Building2 className="w-3.5 h-3.5 text-solar-400" />
            <span>{user?.property_type || inputState.propertyType} Premises</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Link
            to="/calculator"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 text-white text-xs font-bold shadow-lg shadow-solar-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Sun className="w-4 h-4" />
            <span>{result ? 'Recalculate Sizing' : 'Start Solar Assessment'}</span>
          </Link>
          
          <Link
            to="/report"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-solar-400" />
            <span>View Full Report</span>
          </Link>
        </div>
      </div>

      {/* Grid: Solar Snapshot (Left) + Assessment Progress Tracker (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Your Solar Snapshot */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gov-200 shadow-card space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gov-100">
              <div className="flex items-center space-x-2">
                <Sun className="w-5 h-5 text-solar-600" />
                <h3 className="text-base font-bold text-gov-950 font-display">Your Solar Snapshot</h3>
              </div>
              <span className="text-xs text-gov-500 font-medium">
                {result ? `Recommended Sizing for ${inputState.state}` : 'Sample Maharashtra Baseline'}
              </span>
            </div>

            {/* 6 Key Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-solar-50/70 border border-solar-200 space-y-1">
                <span className="text-[11px] font-semibold text-gov-600 block">Recommended System</span>
                <span className="text-xl font-black text-gov-950 font-display">
                  {result?.recommended_capacity_kw || 3.3} kW
                </span>
                <span className="text-[10px] text-gov-500 block">
                  {result?.panel_count || 6} × 550W Panels
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gov-50 border border-gov-200 space-y-1">
                <span className="text-[11px] font-semibold text-gov-600 block">Annual Generation</span>
                <span className="text-xl font-black text-gov-950 font-display">
                  {(result?.annual_generation_kwh || 4818).toLocaleString('en-IN')} kWh
                </span>
                <span className="text-[10px] text-gov-500 block">
                  ~{(result?.monthly_generation_kwh || 401).toLocaleString('en-IN')} units/mo
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[11px] font-semibold text-emerald-800 block">PM Surya Ghar Subsidy</span>
                <span className="text-xl font-black text-emerald-700 font-display">
                  ₹{(result?.potential_subsidy || 78000).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium block">
                  Direct DBT Cash
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gov-950 text-white space-y-1">
                <span className="text-[11px] font-semibold text-slate-300 block">Estimated Net Cost</span>
                <span className="text-xl font-black text-solar-400 font-mono">
                  ₹{(result?.net_cost || 103500).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Out-of-pocket
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gov-50 border border-gov-200 space-y-1">
                <span className="text-[11px] font-semibold text-gov-600 block">Annual Bill Savings</span>
                <span className="text-xl font-black text-gov-950 font-mono">
                  ₹{(result?.annual_savings || 39507).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block">
                  100% Bill Offset
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gov-50 border border-gov-200 space-y-1">
                <span className="text-[11px] font-semibold text-gov-600 block">Approx. Payback</span>
                <span className="text-xl font-black text-gov-950 font-display">
                  {result?.payback_period_years || 2.6} Years
                </span>
                <span className="text-[10px] text-gov-500 block">
                  Break-even year
                </span>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="pt-4 border-t border-gov-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
              <Link to="/schemes" className="p-3 rounded-xl bg-gov-50 hover:bg-gov-100 text-gov-800 flex items-center justify-between transition-colors">
                <span>View Schemes</span>
                <Award className="w-4 h-4 text-solar-600" />
              </Link>
              <Link to="/cost-estimator" className="p-3 rounded-xl bg-gov-50 hover:bg-gov-100 text-gov-800 flex items-center justify-between transition-colors">
                <span>BOM Cost Split</span>
                <Zap className="w-4 h-4 text-solar-600" />
              </Link>
              <Link to="/savings" className="p-3 rounded-xl bg-gov-50 hover:bg-gov-100 text-gov-800 flex items-center justify-between transition-colors">
                <span>10-Yr ROI Curve</span>
                <TrendingUp className="w-4 h-4 text-solar-600" />
              </Link>
              <Link to="/installers" className="p-3 rounded-xl bg-gov-50 hover:bg-gov-100 text-gov-800 flex items-center justify-between transition-colors">
                <span>Find Installers</span>
                <Wrench className="w-4 h-4 text-solar-600" />
              </Link>
            </div>

          </div>

        </div>

        {/* Right Column: Progress Tracker */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-gov-100">
              <h4 className="text-sm font-bold text-gov-950 font-display">Assessment Progress</h4>
              <span className="text-xs font-bold text-solar-600 bg-solar-50 px-2 py-0.5 rounded border border-solar-200">
                {progressPct}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gov-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-solar-500 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Steps list */}
            <div className="space-y-2.5 text-xs">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between py-1">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${step.done ? 'text-emerald-600' : 'text-gov-300'}`} />
                    <span className={step.done ? 'font-semibold text-gov-900' : 'text-gov-400'}>
                      {step.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold ${step.done ? 'text-emerald-700' : 'text-gov-400'}`}>
                    {step.done ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/calculator"
              className="w-full py-3 rounded-xl bg-gov-950 hover:bg-gov-900 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-sm"
            >
              <span>{result ? 'Review Full Assessment' : 'Complete Solar Assessment'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
