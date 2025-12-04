import { Check } from 'lucide-react';

const WorkflowStepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between overflow-x-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={index} className="flex items-center flex-shrink-0">
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center min-w-[100px]">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted
                      ? 'bg-success-600 text-white'
                      : isCurrent
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check size={24} /> : stepNumber}
                </div>
                <p
                  className={`text-xs mt-3 text-center font-medium max-w-[100px] ${
                    isCurrent ? 'text-primary-600' : isCompleted ? 'text-success-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-shrink-0 w-16 h-1 mx-2 mb-8">
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

export default WorkflowStepper;
