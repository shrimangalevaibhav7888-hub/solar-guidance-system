import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface StepWizardNavProps {
  currentStep: number;
  totalSteps?: number;
  backPath?: string;
  nextPath?: string;
  nextLabel?: string;
  onNext?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const FLOW_STEPS = [
  { step: 1, name: 'Electricity & Roof', path: '/calculator' },
  { step: 2, name: 'Solar Recommendation', path: '/solar-results' },
  { step: 3, name: 'Scheme & Eligibility', path: '/schemes' },
  { step: 4, name: 'Cost & Subsidy', path: '/cost-estimator' },
  { step: 5, name: 'Savings & Payback', path: '/savings' },
  { step: 6, name: 'Environmental Impact', path: '/environment' },
  { step: 7, name: 'Installation Roadmap', path: '/installation-guide' },
  { step: 8, name: 'Full Assessment Report', path: '/report' },
];

export const StepWizardNav: React.FC<StepWizardNavProps> = ({
  currentStep,
  totalSteps = 8,
  backPath,
  nextPath,
  nextLabel,
  onNext,
  isLoading = false,
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      const prevStep = FLOW_STEPS.find(s => s.step === currentStep - 1);
      if (prevStep) navigate(prevStep.path);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextPath) {
      navigate(nextPath);
    } else {
      const nStep = FLOW_STEPS.find(s => s.step === currentStep + 1);
      if (nStep) navigate(nStep.path);
    }
  };

  return (
    <div className="bg-white border-t border-gov-200/80 p-4 sm:px-8 shadow-card rounded-2xl mt-8 no-print">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Progress Tracker Pill */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-gov-600 order-2 sm:order-1">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-solar-50 text-solar-800 border border-solar-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-solar-600" />
            Step {currentStep} of {totalSteps}: {FLOW_STEPS[currentStep - 1]?.name}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-gov-300 hover:bg-gov-50 text-gov-700 text-xs font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {currentStep < totalSteps && (
            <button
              onClick={handleNext}
              disabled={disabled || isLoading}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 text-white text-xs font-bold shadow-md shadow-solar-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Processing...' : (nextLabel || 'Continue to Next Step')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === totalSteps && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>Print / Save Assessment PDF</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
