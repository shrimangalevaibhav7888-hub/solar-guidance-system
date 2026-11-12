import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'banner' | 'card' | 'inline';
  customText?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ variant = 'banner', customText }) => {
  const text = customText || "This is an estimate for planning purposes. Actual generation, installation cost, subsidy, savings, eligibility and payback may vary based on site specifics, approved DISCOM vendor rates, and state regulations.";

  if (variant === 'inline') {
    return (
      <p className="text-[11px] text-gov-500 italic flex items-center gap-1.5 mt-2">
        <AlertCircle className="w-3.5 h-3.5 text-solar-500 shrink-0" />
        <span>{text}</span>
      </p>
    );
  }

  if (variant === 'card') {
    return (
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 leading-relaxed shadow-sm flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-amber-950 mb-0.5">Important Transparency Note</h5>
          <p>{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
      <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-slate-800">Planning Estimate: </span>
        {text}
      </div>
    </div>
  );
};
