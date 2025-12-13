import { useState } from 'react';
import { ONBOARDING_SLIDES } from '../../client/services';

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingScreen = ({ onComplete, onSkip }: OnboardingScreenProps) => {
  const [step, setStep] = useState(0);
  const currentSlide = ONBOARDING_SLIDES[step];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    if (step < ONBOARDING_SLIDES.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="p-4 sm:p-6 flex justify-between items-center">
        <div className="w-16 sm:w-24"></div>
        <button 
          onClick={onSkip} 
          className="text-gray-400 hover:text-gray-600 font-semibold text-sm transition-colors"
        >
          Passer
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-8 sm:pb-12">
        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br ${currentSlide.color} flex items-center justify-center mb-6 sm:mb-8 shadow-2xl animate-bounce`}>
          <Icon size={48} color='white' />
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4 max-w-sm px-4">
          {currentSlide.title}
        </h1>
        <p className="text-gray-600 text-center text-base sm:text-lg max-w-md leading-relaxed px-4">
          {currentSlide.description}
        </p>
      </div>

      <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
        <div className="flex justify-center space-x-2">
          {ONBOARDING_SLIDES.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all duration-300 ${
                index === step ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-300'
              }`}
            ></div>
          ))}
        </div>

        <div className='flex items-center justify-center'>
          <button 
            onClick={handleNext} 
            className={`w-full max-w-md bg-linear-to-r ${currentSlide.color} text-white py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
          >
            {step < ONBOARDING_SLIDES.length - 1 ? 'Suivant' : 'Commencer'}
          </button>
        </div>
      </div>
    </div>
  );
};