import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { YearlySavingsItem } from '../types';

interface SavingsChartProps {
  data: YearlySavingsItem[];
  netSystemCost: number;
  paybackYears: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as YearlySavingsItem;
    return (
      <div className="bg-gov-950 text-white p-3 rounded-xl shadow-xl border border-gov-800 text-xs space-y-1 z-50">
        <p className="font-bold text-solar-400 text-sm">{label}</p>
        <div className="flex justify-between gap-4 text-slate-300">
          <span>Annual Savings:</span>
          <span className="font-bold text-white">₹{item.annual_savings.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between gap-4 text-slate-300">
          <span>Cumulative Savings:</span>
          <span className="font-bold text-eco-400">₹{item.cumulative_savings.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between gap-4 text-slate-300">
          <span>Net System Cost:</span>
          <span className="font-semibold text-rose-300">₹{item.system_cost.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between gap-4 pt-1 border-t border-gov-800 text-slate-300">
          <span>Net Profit:</span>
          <span className={`font-bold ${item.net_benefit >= 0 ? 'text-eco-400' : 'text-rose-400'}`}>
            {item.net_benefit >= 0 ? '+' : ''}₹{item.net_benefit.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const SavingsChart: React.FC<SavingsChartProps> = ({ data, netSystemCost, paybackYears }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gov-400 text-sm">
        No savings data available to render chart.
      </div>
    );
  }

  return (
    <div className="w-full h-80 sm:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 15, right: 20, left: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }} 
          />
          
          <ReferenceLine 
            y={netSystemCost} 
            stroke="#ef4444" 
            strokeDasharray="4 4" 
            label={{ 
              value: `Net Cost: ₹${(netSystemCost / 1000).toFixed(0)}k`, 
              position: 'insideTopLeft', 
              fill: '#ef4444', 
              fontSize: 11, 
              fontWeight: 600 
            }} 
          />

          <Area 
            type="monotone" 
            dataKey="cumulative_savings" 
            name="Cumulative Savings (₹)" 
            fill="url(#savingsGradient)" 
            stroke="#16a34a" 
            strokeWidth={3} 
          />
          
          <Line 
            type="monotone" 
            dataKey="annual_savings" 
            name="Annual Bill Savings (₹)" 
            stroke="#f59e0b" 
            strokeWidth={2} 
            dot={{ r: 3, fill: '#f59e0b' }} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
