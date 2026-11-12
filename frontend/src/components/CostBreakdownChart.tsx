import React from 'react';
import { CostBreakdown } from '../types';
import { Layers, Cpu, ShieldCheck, Cable, Wrench } from 'lucide-react';

interface CostBreakdownChartProps {
  breakdown: CostBreakdown;
  subsidy: number;
  netCost: number;
}

export const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({ breakdown, subsidy, netCost }) => {
  const items = [
    {
      label: 'Solar Modules (550W Tier-1 DCR)',
      amount: breakdown.solar_panels,
      pct: 45,
      icon: Layers,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50'
    },
    {
      label: 'Inverter & Smart IoT Monitor',
      amount: breakdown.inverter,
      pct: 20,
      icon: Cpu,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50'
    },
    {
      label: 'HDG / Aluminium Structure',
      amount: breakdown.mounting_structure,
      pct: 15,
      icon: ShieldCheck,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      bgLight: 'bg-indigo-50'
    },
    {
      label: 'Balance of System (Cables, DB, Earthing)',
      amount: breakdown.electrical_and_bos,
      pct: 10,
      icon: Cable,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50'
    },
    {
      label: 'Installation, Civil & Net Meter Testing',
      amount: breakdown.installation_and_netmetering,
      pct: 10,
      icon: Wrench,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgLight: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Visual Multi-Segment Bar */}
      <div>
        <div className="flex justify-between items-center text-xs font-semibold text-gov-600 mb-2">
          <span>Turnkey Bill of Materials (BOM) Split</span>
          <span>Gross Total: ₹{breakdown.total_gross_cost.toLocaleString('en-IN')}</span>
        </div>
        <div className="h-3.5 w-full rounded-full bg-slate-100 flex overflow-hidden p-0.5 border border-slate-200">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`${item.color} h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${item.pct}%` }}
              title={`${item.label}: ${item.pct}% (₹${item.amount.toLocaleString('en-IN')})`}
            />
          ))}
        </div>
      </div>

      {/* Itemized List */}
      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border border-gov-100 bg-white hover:bg-gov-50/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg ${item.bgLight} ${item.textColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gov-900">{item.label}</p>
                  <span className="text-[11px] text-gov-500">{item.pct}% of system cost</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gov-950 font-mono">
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Deduction Summary */}
      <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-sm">
        <div className="flex justify-between items-center text-xs text-slate-300">
          <span>Gross Estimated Turnkey Cost</span>
          <span className="font-semibold text-white font-mono">₹{breakdown.total_gross_cost.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-emerald-400">
          <span>Potential PM Surya Ghar DBT Subsidy</span>
          <span className="font-bold font-mono">- ₹{subsidy.toLocaleString('en-IN')}</span>
        </div>
        <div className="border-t border-slate-700 pt-2.5 flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-slate-200">Estimated Net Out-of-Pocket Cost</span>
            <p className="text-[10px] text-slate-400">Payable to installer</p>
          </div>
          <span className="text-lg font-black text-solar-400 font-mono">
            ₹{netCost.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};
