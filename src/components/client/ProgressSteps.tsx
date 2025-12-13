import { User, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import type { Step } from '../../types';

interface ProgressStepsProps {
  currentStep: Step;
}

export const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  const steps = [
    { id: 'form', label: 'Informations', icon: User },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
    { id: 'success', label: 'Confirmation', icon: CheckCircle }
  ];

  return (
    <div className="mb-6 sm:mb-8 overflow-x-auto">
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max px-4">
        {steps.map((s, i) => {
          const isActive = s.id === currentStep;
          const isPast = steps.findIndex(st => st.id === currentStep) > i;
          const Icon = s.icon;
          
          return (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${
                isActive ? 'bg-indigo-600 text-white shadow-lg' :
                isPast ? 'bg-emerald-100 text-emerald-700' :
                'bg-gray-100 text-gray-400'
              }`}>
                <Icon size={14} />
                <span className="text-xs sm:text-sm font-semibold hidden sm:inline">{s.label}</span>
              </div>
              {i < 2 && <ArrowRight className={`mx-1 sm:mx-2 ${isPast ? 'text-emerald-500' : 'text-gray-300'}`} size={16} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};