import { Check } from 'lucide-react';

const WorkflowStepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between overflow-x-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={index} className="flex items-center flex-shrink-0">
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center min-w-[80px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isCurrent
                      ? 'bg-red-600 text-white ring-4 ring-red-100'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {isCompleted ? <Check size={16} /> : stepNumber}
                </div>
                <p
                  className={`text-[10px] mt-1.5 text-center font-medium max-w-[80px] leading-tight ${
                    isCurrent ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-neutral-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-shrink-0 w-12 h-0.5 mx-1 mb-6">
                  <div
                    className={`h-full transition-all ${
                      isCompleted ? 'bg-green-600' : 'bg-neutral-200'
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
