import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Check, Clock, FileText, UserCheck, MapPin, Activity, FileCheck, Award, CreditCard, Upload } from 'lucide-react';

const StatusTracking = () => {
  const { currentUser } = useAuth();
  const { getEmployee } = useData();
  const employee = getEmployee(currentUser.id);

  if (!employee) {
    return <div>Loading...</div>;
  }

  const timelineSteps = [
    { 
      label: 'Documents Uploaded', 
      completed: employee.preArrival?.documentsUploaded,
      phase: 'Pre-Arrival',
      icon: FileText,
      description: 'All required documents submitted'
    },
    { 
      label: 'HR Review Completed', 
      completed: employee.preArrival?.hrReviewed,
      phase: 'Pre-Arrival',
      icon: UserCheck,
      description: 'Documents verified by HR team'
    },
    { 
      label: 'Entry Permit Generated', 
      completed: employee.preArrival?.entryPermitGenerated,
      phase: 'Pre-Arrival',
      icon: FileCheck,
      description: 'Entry permit has been issued'
    },
    { 
      label: 'Arrival Updated', 
      completed: employee.inCountry?.arrivalUpdated,
      phase: 'In-Country',
      icon: MapPin,
      description: 'Arrival details confirmed'
    },
    { 
      label: 'Medical Examination', 
      completed: employee.inCountry?.medicalCertificate,
      phase: 'In-Country',
      icon: Activity,
      description: 'Medical check-up completed'
    },
    { 
      label: 'Biometric Confirmed', 
      completed: employee.inCountry?.biometricConfirmed,
      phase: 'In-Country',
      icon: UserCheck,
      description: 'Biometric data recorded'
    },
    { 
      label: 'Contract Signed', 
      completed: employee.finalization?.contractSigned,
      phase: 'Finalization',
      icon: FileText,
      description: 'Employment contract finalized'
    },
    { 
      label: 'MOHRE Approved', 
      completed: employee.finalization?.mohreApproved,
      phase: 'Finalization',
      icon: Award,
      description: 'Ministry approval received'
    },
    { 
      label: 'Visa Received', 
      completed: employee.finalization?.visaReceived,
      phase: 'Finalization',
      icon: CreditCard,
      description: 'Visa has been issued'
    },
    { 
      label: 'Stamped Visa Uploaded', 
      completed: employee.finalization?.stampedVisaUploaded,
      phase: 'Finalization',
      icon: Upload,
      description: 'Final visa document uploaded'
    },
  ];

  const getCurrentStepIndex = () => {
    return timelineSteps.findIndex(step => !step.completed);
  };

  const currentIndex = getCurrentStepIndex();
  const completedSteps = timelineSteps.filter(step => step.completed).length;
  const totalSteps = timelineSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const phases = ['Pre-Arrival', 'In-Country', 'Finalization'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">Visa Application Status</h1>
              <p className="text-sm text-gray-500">Track your application progress</p>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-center min-w-[100px] border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{completedSteps}</div>
              <div className="text-xs text-gray-500">of {totalSteps} steps</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-red-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>

        {/* Phase Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {phases.map((phase, phaseIndex) => {
            const phaseSteps = timelineSteps.filter(step => step.phase === phase);
            const phaseCompleted = phaseSteps.filter(step => step.completed).length;
            const phaseTotal = phaseSteps.length;
            const phaseProgress = (phaseCompleted / phaseTotal) * 100;
            const isCurrentPhase = timelineSteps[currentIndex]?.phase === phase;
            
            return (
              <div 
                key={phase}
                className={`bg-white rounded-lg shadow-sm p-5 border transition-all ${
                  isCurrentPhase 
                    ? 'border-red-300' 
                    : phaseProgress === 100
                    ? 'border-green-300'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">{phase}</h3>
                  {phaseProgress === 100 && (
                    <div className="bg-green-100 text-green-600 rounded-full p-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{phaseCompleted} of {phaseTotal}</span>
                    <span className="font-medium text-gray-700">{Math.round(phaseProgress)}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        phaseProgress === 100 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${phaseProgress}%` }}
                    ></div>
                  </div>
                </div>
                {isCurrentPhase && (
                  <div className="flex items-center gap-1.5 text-red-600 text-xs font-medium mt-2">
                    <Clock size={12} />
                    <span>In Progress</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Detailed Progress</h2>
          
          {timelineSteps.map((step, index) => {
            const isCompleted = step.completed;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;
            const isLastInPhase = index < timelineSteps.length - 1 && 
                                  timelineSteps[index + 1].phase !== step.phase;
            const showPhaseLabel = index === 0 || timelineSteps[index - 1].phase !== step.phase;
            const Icon = step.icon;

            return (
              <div key={index}>
                {/* Phase Label */}
                {showPhaseLabel && index !== 0 && (
                  <div className="my-8">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 border-t border-dashed border-gray-300"></div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3">
                        {step.phase} Phase
                      </span>
                      <div className="flex-1 border-t border-dashed border-gray-300"></div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-5 mb-6">
                  {/* Timeline Column */}
                  <div className="flex flex-col items-center">
                    {/* Circle with Icon */}
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 text-white shadow-sm'
                          : isCurrent
                          ? 'bg-red-500 text-white border-2 border-red-300'
                          : 'bg-gray-100 border border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={18} strokeWidth={2.5} />
                      ) : (
                        <Icon size={18} strokeWidth={2} />
                      )}
                    </div>

                    {/* Connector Line */}
                    {index < timelineSteps.length - 1 && !isLastInPhase && (
                      <div
                        className={`w-0.5 h-16 my-2 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      ></div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div 
                    className={`flex-1 rounded-lg p-4 transition-all duration-300 border ${
                      isCompleted
                        ? 'bg-gray-50 border-gray-200'
                        : isCurrent
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded ${
                            isCompleted
                              ? 'bg-gray-100 text-gray-700'
                              : isCurrent
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            Step {index + 1}
                          </span>
                          {isCompleted && (
                            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                              <Check size={11} /> Completed
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                              <Clock size={11} /> Current
                            </span>
                          )}
                        </div>
                        <h3 className={`text-base font-semibold mb-1 ${
                          isCompleted
                            ? 'text-gray-900'
                            : isCurrent
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}>
                          {step.label}
                        </h3>
                        <p className={`text-xs ${
                          isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {completedSteps === totalSteps && (
          <div className="mt-6 bg-green-500 rounded-lg shadow-sm p-6 text-white text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
              <Check size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-semibold mb-1">Congratulations! 🎉</h3>
            <p className="text-sm text-green-50">Your visa application process is complete!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusTracking;