import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Clock, FileText, Calendar, CheckCircle } from 'lucide-react';
import StatusCard from '../../components/common/StatusCard';
import Button from '../../components/common/Button';
import WorkflowStepper from '../../components/common/WorkflowStepper';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, refreshEmployees } = useData();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load employee data
  useEffect(() => {
    const loadEmployee = async () => {
      if (currentUser?.employeeId) {
        setIsLoading(true);
        try {
          const data = await getEmployee(currentUser.employeeId);
          setEmployee(data);
        } catch (error) {
          console.error('Failed to load employee:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.employeeId]);

  // Reload data when page becomes visible (e.g., after navigation back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUser?.employeeId) {
        console.log('Dashboard visible - reloading employee data');
        getEmployee(currentUser.employeeId).then(data => {
          console.log('Employee data reloaded:', data);
          setEmployee(data);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentUser?.employeeId, getEmployee]);

  // Force reload when component mounts (e.g., after navigation)
  useEffect(() => {
    if (currentUser?.employeeId && employee) {
      console.log('Dashboard mounted - checking for updates');
      getEmployee(currentUser.employeeId).then(data => {
        if (JSON.stringify(data) !== JSON.stringify(employee)) {
          console.log('Employee data changed - updating');
          setEmployee(data);
        }
      });
    }
  }, []);

  // Auto-refresh every 30 seconds to check for updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser?.employeeId) {
        getEmployee(currentUser.employeeId).then(data => setEmployee(data));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser?.employeeId, getEmployee]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-sm text-neutral-900 font-medium">Employee data not found</p>
          <p className="text-xs text-neutral-600 mt-1">Please contact HR</p>
        </div>
      </div>
    );
  }

  const getStageProgress = () => {
    const stages = ['pre-arrival', 'in-country', 'finalization', 'completed'];
    const currentIndex = stages.indexOf(employee.currentStage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getCurrentStepNumber = () => {
    // Determine current step based on employee progress
    // Return the step they are currently ON (not completed)
    
    if (!employee.documents_uploaded) {
      return 1; // Step 1: Upload Documents
    }
    if (!employee.arrival_updated) {
      return 2; // Step 2: Update Arrival
    }
    if (!employee.medical_certificate_uploaded) {
      return 3; // Step 3: Medical Test
    }
    if (!employee.biometric_confirmed) {
      return 4; // Step 4: Biometric Submission
    }
    if (!employee.residence_visa_submitted) {
      return 5; // Step 5: Residence Visa (HR action, employee waits)
    }
    if (!employee.contract_signed) {
      return 6; // Step 6: Sign Contract
    }
    if (!employee.visa_received) {
      return 7; // Step 7: MOHRE & Visa (HR action, employee waits)
    }
    if (!employee.stamped_visa_uploaded) {
      return 8; // Step 8: Upload Stamped Visa
    }
    return 8; // All steps completed, stay on step 8
  };

  const workflowSteps = [
    { label: 'Upload Documents' },
    { label: 'Update Arrival' },
    { label: 'Medical Test' },
    { label: 'Biometric Submission' },
    { label: 'Residence Visa' },
    { label: 'Sign Contract' },
    { label: 'MOHRE & Visa' },
    { label: 'Upload Stamped Visa' },
  ];

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1600px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
            <p className="text-sm text-neutral-600">Track your visa application progress</p>
          </div>
          <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/employee/profile')}>
            View Full Profile
          </Button>
          <button
            onClick={() => refreshEmployees()}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {/* Show appropriate action button based on current state */}
          {!employee.documents_uploaded && (
            <Button variant="primary" onClick={() => navigate('/employee/upload-documents')}>
              Upload Documents
            </Button>
          )}
          {employee.diso_info_completed && !employee.entry_permit_generated && (
            <Button variant="primary" onClick={() => navigate('/employee/entry-permit')}>
              Download Entry Permit
            </Button>
          )}
          {employee.entry_permit_generated && !employee.arrival_updated && (
            <Button variant="primary" onClick={() => navigate('/employee/update-arrival')}>
              Update Arrival
            </Button>
          )}
          {employee.medical_appointment_scheduled && !employee.medical_certificate_uploaded && (
            <Button variant="primary" onClick={() => navigate('/employee/medical-certificate')}>
              Upload Medical Certificate
            </Button>
          )}
          {employee.medical_certificate_uploaded && !employee.biometric_confirmed && (
            <Button variant="primary" onClick={() => navigate('/employee/biometric-confirmation')}>
              Confirm Biometric
            </Button>
          )}
          {employee.contract_initiated && !employee.contract_signed && (
            <Button variant="primary" onClick={() => navigate('/employee/sign-contract')}>
              Sign Contract
            </Button>
          )}
          {employee.visa_received && !employee.stamped_visa_uploaded && (
            <Button variant="success" onClick={() => navigate('/employee/upload-stamped-visa')}>
              Upload Stamped Visa
            </Button>
          )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <StatusCard
            icon={Clock}
            label="Current Status"
            value={
              employee.current_stage
                ? employee.current_stage.charAt(0).toUpperCase() + employee.current_stage.slice(1).toLowerCase()
                : ""
            }
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatusCard
            icon={Calendar}
            label="Submitted"
            value={new Date(employee.created_at).toLocaleDateString()}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatusCard
            icon={FileText}
            label="Days in Process"
            value={(() => {
              const days = Math.floor((Date.now() - new Date(employee.created_at)) / (1000 * 60 * 60 * 24));
              return days === 0 ? 'Today' : days;
            })()}
            bgColor="bg-amber-100"
            iconColor="text-amber-600"
          />
        </div>

        {/* Application Progress */}
        <div className="bg-white border border-neutral-300 rounded-lg px-6 mb-3">
          <WorkflowStepper steps={workflowSteps} currentStep={getCurrentStepNumber()} />
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Next Steps */}
          <div className="bg-white border border-neutral-300 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-neutral-900 mb-3">Next Steps</h2>
        <div className="space-y-3">
          {!employee.documents_uploaded && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div>
                <p className="font-medium text-primary-900">Upload Your Documents</p>
                <p className="text-sm text-primary-700">Upload passport, photo, and certificates</p>
              </div>
              <Button variant="primary" onClick={() => navigate('/employee/upload-documents')}>
                Start
              </Button>
            </div>
          )}
          {employee.documents_uploaded && !employee.hr_reviewed && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Waiting for HR Review</p>
              <p className="text-sm text-amber-700">Your documents are being reviewed by HR</p>
            </div>
          )}
          {employee.hr_reviewed && !employee.diso_info_completed && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">HR Processing Your Application</p>
              <p className="text-sm text-amber-700">HR is completing DISO portal information for your visa</p>
            </div>
          )}
          {employee.diso_info_completed && !employee.entry_permit_generated && (
            <div className="flex items-center justify-between p-4 bg-success-50 border border-success-200 rounded-lg">
              <div>
                <p className="font-medium text-success-900">Entry Permit Ready!</p>
                <p className="text-sm text-success-700">Your entry permit is ready to download</p>
              </div>
              <Button variant="success" onClick={() => navigate('/employee/entry-permit')}>
                Download
              </Button>
            </div>
          )}
          {employee.entry_permit_generated && !employee.arrival_updated && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div>
                <p className="font-medium text-primary-900">Update Your Arrival</p>
                <p className="text-sm text-primary-700">Confirm when you arrive in UAE</p>
              </div>
              <Button variant="primary" onClick={() => navigate('/employee/update-arrival')}>
                Update
              </Button>
            </div>
          )}
          {employee.arrival_updated && !employee.medical_appointment_scheduled && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Waiting for Medical Appointment</p>
              <p className="text-sm text-amber-700">HR will schedule your medical examination</p>
            </div>
          )}
          {employee.medical_appointment_scheduled && !employee.medical_certificate_uploaded && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div>
                <p className="font-medium text-primary-900">Medical Appointment Scheduled</p>
                <p className="text-sm text-primary-700">Upload your medical certificate after examination</p>
              </div>
              <Button variant="primary" onClick={() => navigate('/employee/medical-certificate')}>
                Upload
              </Button>
            </div>
          )}
          {employee.medical_certificate_uploaded && !employee.biometric_confirmed && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div>
                <p className="font-medium text-primary-900">Confirm Biometric Submission</p>
                <p className="text-sm text-primary-700">Submit your biometric confirmation details</p>
              </div>
              <Button variant="primary" onClick={() => navigate('/employee/biometric-confirmation')}>
                Confirm
              </Button>
            </div>
          )}
          {employee.biometric_confirmed && !employee.residence_visa_submitted && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Waiting for Visa Submission</p>
              <p className="text-sm text-amber-700">HR will submit your residence visa application</p>
            </div>
          )}
          {employee.residence_visa_submitted && !employee.contract_initiated && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Visa Application in Progress</p>
              <p className="text-sm text-amber-700">Your residence visa is being processed by authorities</p>
            </div>
          )}
          {employee.contract_initiated && !employee.contract_signed && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div>
                <p className="font-medium text-primary-900">Sign Your Contract</p>
                <p className="text-sm text-primary-700">Review and sign your employment contract</p>
              </div>
              <Button variant="primary" onClick={() => navigate('/employee/sign-contract')}>
                Sign
              </Button>
            </div>
          )}
          {employee.contract_signed && !employee.mohre_submitted && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Contract Submitted to MOHRE</p>
              <p className="text-sm text-amber-700">Waiting for MOHRE approval</p>
            </div>
          )}
          {employee.mohre_approved && !employee.visa_received && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Visa Application in Progress</p>
              <p className="text-sm text-amber-700">HR is processing your final visa application</p>
            </div>
          )}
          {employee.visa_received && !employee.stamped_visa_uploaded && (
            <div className="flex items-center justify-between p-4 bg-success-50 border border-success-200 rounded-lg">
              <div>
                <p className="font-medium text-success-900">Visa Ready - Upload Stamped Page</p>
                <p className="text-sm text-success-700">Your visa is ready! Upload the stamped passport page</p>
              </div>
              <Button variant="success" onClick={() => navigate('/employee/upload-stamped-visa')}>
                Upload
              </Button>
            </div>
          )}
          {employee.current_stage === 'completed' && employee.stamped_visa_uploaded && (
            <div className="p-4 bg-success-50 border border-success-200 rounded-lg text-center">
              <CheckCircle className="mx-auto text-success-600 mb-2" size={32} />
              <p className="font-medium text-success-900">Process Complete!</p>
              <p className="text-sm text-success-700">Your visa processing is complete. Welcome to UAE!</p>
            </div>
          )}
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white border border-neutral-300 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-neutral-900 mb-3">Application Details</h2>
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div>
                <p className="text-xs text-neutral-500">Employee Name</p>
                <p className="text-xs font-medium text-neutral-900">
                  {employee.first_name} {employee.last_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Passport Number</p>
                <p className="text-xs font-medium text-neutral-900">{employee.passport_number || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Nationality</p>
                <p className="text-xs font-medium text-neutral-900">{employee.present_nationality || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Job Title</p>
                <p className="text-xs font-medium text-neutral-900">{employee.job_title || 'Not provided'}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-neutral-200">
              <Button 
                variant="primary" 
                onClick={() => navigate('/employee/profile')}
                className="w-full"
              >
                View Complete Profile & All Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
