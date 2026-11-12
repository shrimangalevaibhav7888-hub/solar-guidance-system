import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: 'solar' | 'eco' | 'blue' | 'slate';
  trend?: string;
  accent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'solar',
  trend,
  accent = false,
}) => {
  const badgeClasses = {
    solar: 'bg-solar-100 text-solar-800 border-solar-200',
    eco: 'bg-eco-100 text-eco-800 border-eco-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    slate: 'bg-slate-100 text-slate-800 border-slate-200',
  }[badgeColor];

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
      accent 
        ? 'bg-gradient-to-br from-solar-500 to-solar-600 text-white border-solar-400 shadow-md shadow-solar-500/20' 
        : 'bg-white text-gov-900 border-gov-200/80 shadow-card hover:shadow-soft hover:border-solar-300'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            accent ? 'bg-white/20 text-white' : 'bg-solar-50 text-solar-600'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={`text-xs font-semibold ${accent ? 'text-white/90' : 'text-gov-600'}`}>
            {title}
          </span>
        </div>

        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            accent ? 'bg-white/20 text-white border-white/30' : badgeClasses
          }`}>
            {badge}
          </span>
        )}
      </div>

      <div className="mt-1">
        <div className={`text-2xl sm:text-3xl font-black tracking-tight font-display ${accent ? 'text-white' : 'text-gov-950'}`}>
          {value}
        </div>
        
        {(subtitle || trend) && (
          <div className="mt-1.5 flex items-center justify-between text-xs">
            {subtitle && (
              <span className={accent ? 'text-white/80' : 'text-gov-500'}>
                {subtitle}
              </span>
            )}
            {trend && (
              <span className={`font-bold ${accent ? 'text-white' : 'text-eco-600'}`}>
                {trend}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
