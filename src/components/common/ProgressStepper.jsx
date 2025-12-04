import { Check } from 'lucide-react';

const ProgressStepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    isCompleted
                      ? 'bg-success-600 text-white'
                      : isCurrent
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check size={20} /> : stepNumber}
                </div>
                <p
                  className={`text-xs mt-2 text-center font-medium ${
                    isCurrent ? 'text-primary-600' : isCompleted ? 'text-success-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 -mt-6">
                  <div
                    className={`h-full transition-all ${
                      isCompleted ? 'bg-success-600' : 'bg-gray-200'
                    }`}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
