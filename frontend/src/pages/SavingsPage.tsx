import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Compass, 
  Clock, 
  Calendar, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Zap, 
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { SavingsChart } from '../components/SavingsChart';
import { StatCard } from '../components/StatCard';
import { StepWizardNav } from '../components/StepWizardNav';
import { Disclaimer } from '../components/Disclaimer';
import { YearlySavingsItem } from '../types';

export const SavingsPage: React.FC = () => {
  const { result, inputState } = useSolar();

  const [inflationRate, setInflationRate] = useState<number>(4); // 4% per year
  const [projections, setProjections] = useState<YearlySavingsItem[]>([]);
  const [totals, setTotals] = useState<{
    year1: number;
    monthly: number;
    tenYear: number;
    twentyFiveYear: number;
    netProfit: number;
    roiPct: number;
    payback: number;
  }>({
    year1: 39507,
    monthly: 3292,
    tenYear: 474200,
    twentyFiveYear: 1485000,
    netProfit: 1381500,
    roiPct: 1335,
    payback: 2.6
  });

  const annualGen = result?.annual_generation_kwh || 4818;
  const netCost = result?.net_cost || 103500;
  const baseTariff = result?.estimated_tariff_rate || 8.2;

  // Re-simulate 10-25 years when inflation rate changes
  useEffect(() => {
    const proj: YearlySavingsItem[] = [];
    let cumSavings = 0;
    const infl = inflationRate / 100;
    const deg = 0.007; // 0.7% degradation

    for (let yr = 1; yr <= 10; yr++) {
      const genYr = annualGen * Math.pow(1 - deg, yr - 1);
      const tarYr = baseTariff * Math.pow(1 + infl, yr - 1);
      const savYr = Math.round(genYr * tarYr);
      cumSavings += savYr;

      proj.push({
        year: `Year ${yr}`,
        year_num: yr,
        tariff_rate: Math.round(tarYr * 100) / 100,
        annual_generation_kwh: Math.round(genYr),
        annual_savings: savYr,
        cumulative_savings: cumSavings,
        system_cost: netCost,
        net_benefit: cumSavings - netCost,
        is_profitable: cumSavings >= netCost
      });
    }

    // Compute 25 year total
    let lifetimeCum = cumSavings;
    for (let yr = 11; yr <= 25; yr++) {
      const genYr = annualGen * Math.pow(1 - deg, yr - 1);
      const tarYr = baseTariff * Math.pow(1 + infl, yr - 1);
      lifetimeCum += Math.round(genYr * tarYr);
    }

    const yr1Sav = proj[0]?.annual_savings || 0;
    const pb = yr1Sav > 0 ? Math.round((netCost / yr1Sav) * 10) / 10 : 0;
    const profit = lifetimeCum - netCost;
    const roi = netCost > 0 ? Math.round((profit / netCost) * 100) : 0;

    setProjections(proj);
    setTotals({
      year1: yr1Sav,
      monthly: Math.round(yr1Sav / 12),
      tenYear: cumSavings,
      twentyFiveYear: lifetimeCum,
      netProfit: profit,
      roiPct: roi,
      payback: pb
    });
  }, [inflationRate, annualGen, netCost, baseTariff]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gov-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-solar-600 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Step 5 of 8 • Financial Returns & Break-Even Projections</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-950 font-display">
              10-Year Savings & Financial Payback Simulation
            </h1>
            <p className="text-xs sm:text-sm text-gov-600 mt-1">
              Multi-year financial projection considering annual electricity tariff escalation and standard Tier-1 panel linear performance.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gov-500 font-medium">Base Tariff:</span>
            <span className="px-2.5 py-1 rounded-lg bg-gov-100 text-xs font-bold text-gov-900">
              ₹{baseTariff}/kWh ({inputState.state})
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Year 1 Bill Savings"
          value={`₹${totals.year1.toLocaleString('en-IN')}`}
          subtitle={`~₹${totals.monthly.toLocaleString('en-IN')}/month`}
          icon={TrendingUp}
          accent={true}
          badge="Immediate"
        />
        <StatCard
          title="Payback Period"
          value={`${totals.payback} Years`}
          subtitle="Net break-even"
          icon={Clock}
          badge="Rapid ROI"
          badgeColor="eco"
        />
        <StatCard
          title="10-Year Cumulative"
          value={`₹${totals.tenYear.toLocaleString('en-IN')}`}
          subtitle="Total bill offset"
          icon={Calendar}
          badge="10-Yr Outlook"
          badgeColor="solar"
        />
        <StatCard
          title="25-Year Net Profit"
          value={`₹${totals.netProfit.toLocaleString('en-IN')}`}
          subtitle={`${totals.roiPct}% Net ROI`}
          icon={Sparkles}
          badge="Lifetime Gain"
          badgeColor="blue"
        />
      </div>

      {/* Main Chart Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gov-200 shadow-card space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gov-100">
          <div>
            <h3 className="text-base font-bold text-gov-950 font-display">
              10-Year Cumulative Savings vs System Investment (Break-Even Curve)
            </h3>
            <p className="text-xs text-gov-500">
              Green shaded area represents cumulative electricity savings surpassing the red initial investment line.
            </p>
          </div>

          {/* Inflation Rate Slider */}
          <div className="flex items-center space-x-3 bg-gov-50 p-2.5 rounded-2xl border border-gov-200 text-xs">
            <span className="font-semibold text-gov-700">Tariff Escalation:</span>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="accent-solar-500 w-24 h-1.5 cursor-pointer"
            />
            <span className="font-bold text-solar-700 font-mono w-8 text-right">{inflationRate}%/yr</span>
          </div>
        </div>

        {/* Recharts Component */}
        <SavingsChart
          data={projections}
          netSystemCost={netCost}
          paybackYears={totals.payback}
        />

        {/* Table representation for Accessibility */}
        <div className="pt-4 border-t border-gov-100">
          <h4 className="text-xs font-bold text-gov-800 uppercase tracking-wider mb-3">
            Year-by-Year Financial Cashflow Breakdown
          </h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gov-50 text-gov-700 font-bold border-b border-gov-200">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Timeline</th>
                  <th className="py-2.5 px-3">Tariff (₹/kWh)</th>
                  <th className="py-2.5 px-3">Generation (kWh)</th>
                  <th className="py-2.5 px-3">Annual Savings</th>
                  <th className="py-2.5 px-3">Cumulative Savings</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-100 text-gov-800">
                {projections.map((p) => (
                  <tr key={p.year_num} className={p.is_profitable ? 'bg-emerald-50/30' : ''}>
                    <td className="py-2 px-3 font-semibold">{p.year}</td>
                    <td className="py-2 px-3 font-mono">₹{p.tariff_rate.toFixed(2)}</td>
                    <td className="py-2 px-3 font-mono">{p.annual_generation_kwh.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 font-mono font-semibold">₹{p.annual_savings.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 font-mono text-emerald-700 font-bold">₹{p.cumulative_savings.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 font-mono font-bold">
                      <span className={p.net_benefit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        {p.net_benefit >= 0 ? '+' : ''}₹{p.net_benefit.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <Disclaimer variant="banner" customText="Long-term financial projections assume average 4% yearly tariff escalation and 0.7% standard solar module degradation. Actual returns depend on weather, maintenance, and state net-metering settlement regulations." />

      <StepWizardNav
        currentStep={5}
        totalSteps={8}
        backPath="/cost-estimator"
        nextPath="/environment"
        nextLabel="View Environmental & CO₂ Impact"
      />

    </div>
  );
};
