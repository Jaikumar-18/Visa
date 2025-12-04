import { Check } from 'lucide-react';

const VerticalTimeline = ({ steps, currentStep }) => {
  return (
    <div className="flex flex-col items-center py-6">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;

        return (
          <div key={index} className="flex flex-col items-center">
            {/* Step Circle */}
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  isCompleted
                    ? 'bg-success-500 text-white shadow-lg'
                    : isCurrent
                    ? 'bg-primary-600 text-white shadow-lg ring-4 ring-primary-200 animate-pulse'
                    : 'bg-gray-200 text-gray-400 border-2 border-gray-300'
                }`}
              >
                {isCompleted ? (
                  <Check size={32} strokeWidth={3} />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              
              {/* Outer ring for current step */}
              {isCurrent && (
                <div className="absolute inset-0 rounded-full border-4 border-primary-600 opacity-30 animate-ping"></div>
              )}
            </div>

            {/* Step Label */}
            <p
              className={`text-sm font-medium mt-3 text-center max-w-[120px] ${
                isCurrent
                  ? 'text-primary-600'
                  : isCompleted
                  ? 'text-success-600'
                  : 'text-gray-400'
              }`}
            >
              {step.label}
            </p>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="my-4">
                <div
                  className={`w-1 h-12 transition-all ${
                    isCompleted ? 'bg-success-500' : 'bg-gray-300'
                  }`}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VerticalTimeline;
