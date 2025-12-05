import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Check, Clock, FileText, UserCheck, MapPin, Activity, FileCheck, Award, CreditCard, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const StatusTracking = () => {
  const { currentUser } = useAuth();
  const { getEmployee } = useData();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state before any early returns
  const [expandedPhases, setExpandedPhases] = useState({
    'Pre-Arrival': false,
    'In-Country': false,
    'Finalization': false,
  });

  useEffect(() => {
    const loadEmployee = async () => {
      if (currentUser?.employeeId) {
        try {
          const data = await getEmployee(currentUser.employeeId);
          setEmployee(data);
        } catch (error) {
          console.error('Failed to load employee:', error);
          toast.error('Failed to load status data');
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadEmployee();
  }, [currentUser?.employeeId, getEmployee]);

  // Set the current phase to be expanded when employee data changes
  useEffect(() => {
    if (employee) {
      const timelineSteps = [
        { completed: employee.documents_uploaded, phase: 'Pre-Arrival' },
        { completed: employee.hr_reviewed, phase: 'Pre-Arrival' },
        { completed: employee.entry_permit_generated, phase: 'Pre-Arrival' },
        { completed: employee.arrival_updated, phase: 'In-Country' },
        { completed: employee.medical_certificate_uploaded, phase: 'In-Country' },
        { completed: employee.biometric_confirmed, phase: 'In-Country' },
        { completed: employee.contract_signed, phase: 'Finalization' },
        { completed: employee.mohre_approved, phase: 'Finalization' },
        { completed: employee.visa_received, phase: 'Finalization' },
        { completed: employee.stamped_visa_uploaded, phase: 'Finalization' },
      ];
      
      const currentIndex = timelineSteps.findIndex(step => !step.completed);
      const currentPhase = timelineSteps[currentIndex]?.phase;
      
      if (currentPhase) {
        setExpandedPhases({
          'Pre-Arrival': currentPhase === 'Pre-Arrival',
          'In-Country': currentPhase === 'In-Country',
          'Finalization': currentPhase === 'Finalization',
        });
      }
    }
  }, [employee]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading status...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return <div>Loading...</div>;
  }

  const timelineSteps = [
    { 
      label: 'Documents Uploaded', 
      completed: employee.documents_uploaded,
      phase: 'Pre-Arrival',
      icon: FileText,
      description: 'All required documents submitted'
    },
    { 
      label: 'HR Review Completed', 
      completed: employee.hr_reviewed,
      phase: 'Pre-Arrival',
      icon: UserCheck,
      description: 'Documents verified by HR team'
    },
    { 
      label: 'Entry Permit Generated', 
      completed: employee.entry_permit_generated,
      phase: 'Pre-Arrival',
      icon: FileCheck,
      description: 'Entry permit has been issued'
    },
    { 
      label: 'Arrival Updated', 
      completed: employee.arrival_updated,
      phase: 'In-Country',
      icon: MapPin,
      description: 'Arrival details confirmed'
    },
    { 
      label: 'Medical Examination', 
      completed: employee.medical_certificate_uploaded,
      phase: 'In-Country',
      icon: Activity,
      description: 'Medical check-up completed'
    },
    { 
      label: 'Biometric Confirmed', 
      completed: employee.biometric_confirmed,
      phase: 'In-Country',
      icon: UserCheck,
      description: 'Biometric data recorded'
    },
    { 
      label: 'Contract Signed', 
      completed: employee.contract_signed,
      phase: 'Finalization',
      icon: FileText,
      description: 'Employment contract finalized'
    },
    { 
      label: 'MOHRE Approved', 
      completed: employee.mohre_approved,
      phase: 'Finalization',
      icon: Award,
      description: 'Ministry approval received'
    },
    { 
      label: 'Visa Received', 
      completed: employee.visa_received,
      phase: 'Finalization',
      icon: CreditCard,
      description: 'Visa has been issued'
    },
    { 
      label: 'Stamped Visa Uploaded', 
      completed: employee.stamped_visa_uploaded,
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

  const togglePhase = (phase) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1600px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Visa Application Status</h1>
            <p className="text-sm text-neutral-600">Track your application progress</p>
          </div>
          <div className="bg-white rounded-lg px-4 py-2 text-center min-w-[100px] border border-neutral-300">
            <div className="text-xl font-bold text-neutral-900">{completedSteps}</div>
            <div className="text-xs text-neutral-500">of {totalSteps} steps</div>
          </div>
        </div>

        {/* Horizontal Timeline */}
        <div className="bg-white rounded-lg border border-neutral-300 p-4 mb-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max">
            {timelineSteps.map((step, index) => {
              const isCompleted = step.completed;
              const isCurrent = index === currentIndex;
              const Icon = step.icon;

              return (
                <div key={index} className="flex items-center">
                  {/* Step */}
                  <div className="flex flex-col items-center min-w-[90px]">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isCurrent
                          ? 'bg-red-600 text-white ring-4 ring-red-100'
                          : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={18} strokeWidth={2.5} />
                      ) : (
                        <Icon size={18} strokeWidth={2} />
                      )}
                    </div>
                    <p
                      className={`text-[10px] mt-1.5 text-center font-medium max-w-[90px] leading-tight ${
                        isCurrent ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-neutral-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    <span className={`text-[9px] mt-0.5 px-1.5 py-0.5 rounded ${
                      isCompleted
                        ? 'bg-green-100 text-green-700'
                        : isCurrent
                        ? 'bg-red-100 text-red-700'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {isCompleted ? 'Done' : isCurrent ? 'Current' : 'Pending'}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {index < timelineSteps.length - 1 && (
                    <div className="flex-shrink-0 w-12 h-0.5 mx-2 mb-8">
                      <div
                        className={`h-full transition-all duration-300 ${
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

        {/* Collapsible Phase Sections */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {phases.map((phase) => {
            const phaseSteps = timelineSteps.filter(step => step.phase === phase);
            const phaseCompleted = phaseSteps.filter(step => step.completed).length;
            const phaseTotal = phaseSteps.length;
            const isExpanded = expandedPhases[phase];

            return (
              <div key={phase} className="bg-white rounded-lg border border-neutral-300 overflow-hidden">
                {/* Phase Header - Clickable */}
                <button
                  onClick={() => togglePhase(phase)}
                  className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-neutral-900">{phase}</h3>
                    <span className="text-xs text-neutral-600">
                      {phaseCompleted} of {phaseTotal} completed
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-neutral-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Phase Content - Collapsible */}
                {isExpanded && (
                  <div className="border-t border-neutral-200 p-4 bg-neutral-50">
                    <div className="space-y-3">
                      {phaseSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = step.completed;
                        const isCurrent = timelineSteps.indexOf(step) === currentIndex;

                        return (
                          <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${
                              isCompleted
                                ? 'bg-green-50 border-green-200'
                                : isCurrent
                                ? 'bg-red-50 border-red-200'
                                : 'bg-white border-neutral-200'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCompleted
                                  ? 'bg-green-600 text-white'
                                  : isCurrent
                                  ? 'bg-red-600 text-white'
                                  : 'bg-neutral-200 text-neutral-400'
                              }`}
                            >
                              {isCompleted ? <Check size={16} strokeWidth={2.5} /> : <Icon size={16} strokeWidth={2} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-neutral-900">{step.label}</h4>
                                {isCompleted && (
                                  <span className="text-xs font-medium text-green-600 flex items-center gap-0.5">
                                    <Check size={10} /> Done
                                  </span>
                                )}
                                {isCurrent && (
                                  <span className="text-xs font-medium text-red-600 flex items-center gap-0.5">
                                    <Clock size={10} /> Current
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-600">{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Completion Message */}
          {completedSteps === totalSteps && (
            <div className="bg-green-600 rounded-lg p-4 text-white text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-full mb-2">
                <Check size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-semibold mb-1">Congratulations! 🎉</h3>
              <p className="text-xs text-green-50">Your visa application process is complete!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusTracking;