import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Clock, FileText, Calendar, CheckCircle } from 'lucide-react';
import StatusCard from '../../components/common/StatusCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import WorkflowStepper from '../../components/common/WorkflowStepper';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, refreshEmployees } = useData();
  const employee = getEmployee(currentUser.id);

  // Auto-refresh every 3 seconds to check for updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshEmployees();
    }, 3000);

    return () => clearInterval(interval);
  }, [refreshEmployees]);

  if (!employee) {
    return <div>Loading...</div>;
  }

  const getStageProgress = () => {
    const stages = ['pre-arrival', 'in-country', 'finalization', 'completed'];
    const currentIndex = stages.indexOf(employee.currentStage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getCurrentStepNumber = () => {
    // Determine current step based on employee progress
    // Return the step they are currently ON (not completed)
    
    if (!employee.preArrival?.documentsUploaded) {
      return 1; // Step 1: Upload Documents
    }
    if (!employee.inCountry?.arrivalUpdated) {
      return 2; // Step 2: Update Arrival
    }
    if (!employee.inCountry?.medicalCertificateUploaded) {
      return 3; // Step 3: Medical Test
    }
    if (!employee.inCountry?.biometricConfirmed) {
      return 4; // Step 4: Biometric Submission
    }
    if (!employee.inCountry?.residenceVisaSubmitted) {
      return 5; // Step 5: Residence Visa (HR action, employee waits)
    }
    if (!employee.finalization?.contractSigned) {
      return 6; // Step 6: Sign Contract
    }
    if (!employee.finalization?.visaReceived) {
      return 7; // Step 7: MOHRE & Visa (HR action, employee waits)
    }
    if (!employee.finalization?.stampedVisaUploaded) {
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
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1400px] mx-auto p-4">
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Dashboard</h1>
            <p className="text-xs text-neutral-500">Track your visa application progress</p>
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
          {!employee.preArrival?.documentsUploaded && (
            <Button variant="primary" onClick={() => navigate('/employee/upload-documents')}>
              Upload Documents
            </Button>
          )}
          {employee.preArrival?.disoInfoCompleted && !employee.preArrival?.entryPermitGenerated && (
            <Button variant="primary" onClick={() => navigate('/employee/entry-permit')}>
              Download Entry Permit
            </Button>
          )}
          {employee.preArrival?.entryPermitGenerated && !employee.inCountry?.arrivalUpdated && (
            <Button variant="primary" onClick={() => navigate('/employee/update-arrival')}>
              Update Arrival
            </Button>
          )}
          {employee.inCountry?.medicalAppointment?.status === 'scheduled' && !employee.inCountry?.medicalCertificate && (
            <Button variant="primary" onClick={() => navigate('/employee/medical-certificate')}>
              Upload Medical Certificate
            </Button>
          )}
          {employee.inCountry?.medicalCertificate && !employee.inCountry?.biometricConfirmed && (
            <Button variant="primary" onClick={() => navigate('/employee/biometric-confirmation')}>
              Confirm Biometric
            </Button>
          )}
          {employee.finalization?.contractInitiated && !employee.finalization?.contractSigned && (
            <Button variant="primary" onClick={() => navigate('/employee/sign-contract')}>
              Sign Contract
            </Button>
          )}
          {employee.finalization?.visaReceived && !employee.finalization?.stampedVisaUploaded && (
            <Button variant="success" onClick={() => navigate('/employee/upload-stamped-visa')}>
              Upload Stamped Visa
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <StatusCard
            icon={Clock}
            label="Current Status"
            value={
              employee.currentStage
                ? employee.currentStage.charAt(0).toUpperCase() + employee.currentStage.slice(1).toLowerCase()
                : ""
            }
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatusCard
            icon={Calendar}
            label="Submitted"
            value={new Date(employee.createdAt).toLocaleDateString()}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatusCard
            icon={FileText}
            label="Days in Process"
            value={(() => {
              const days = Math.floor((Date.now() - new Date(employee.createdAt)) / (1000 * 60 * 60 * 24));
              return days === 0 ? 'Today' : days;
            })()}
            bgColor="bg-amber-100"
            iconColor="text-amber-600"
          />
        </div>

        {/* Application Progress */}
        <div className="bg-white border border-neutral-300 rounded px-6 mb-3">
          <WorkflowStepper steps={workflowSteps} currentStep={getCurrentStepNumber()} />
        </div>

        {/* Next Steps */}
        <Card title="Next Steps" className="mt-3">
        <div className="space-y-3">
          {!employee.preArrival?.documentsUploaded && (
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
          {employee.preArrival?.documentsUploaded && !employee.preArrival?.hrReviewed && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Waiting for HR Review</p>
              <p className="text-sm text-amber-700">Your documents are being reviewed by HR</p>
            </div>
          )}
          {employee.preArrival?.hrReviewed && !employee.preArrival?.disoInfoCompleted && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">HR Processing Your Application</p>
              <p className="text-sm text-amber-700">HR is completing DISO portal information for your visa</p>
            </div>
          )}
          {employee.preArrival?.disoInfoCompleted && !employee.preArrival?.entryPermitGenerated && (
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
          {employee.preArrival?.entryPermitGenerated && !employee.inCountry?.arrivalUpdated && (
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
          {employee.inCountry?.arrivalUpdated && !employee.inCountry?.medicalAppointment?.status && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Waiting for Medical Appointment</p>
              <p className="text-sm text-amber-700">HR will schedule your medical examination</p>
            </div>
          )}
          {employee.inCountry?.medicalAppointment?.status === 'scheduled' && !employee.inCountry?.medicalCertificate && (
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
          {employee.inCountry?.medicalCertificate && !employee.inCountry?.biometricConfirmed && (
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
          {employee.inCountry?.biometricConfirmed && !employee.inCountry?.residenceVisaSubmitted && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Waiting for Visa Submission</p>
              <p className="text-sm text-amber-700">HR will submit your residence visa application</p>
            </div>
          )}
          {employee.inCountry?.residenceVisaSubmitted && !employee.finalization?.contractInitiated && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Visa Application in Progress</p>
              <p className="text-sm text-amber-700">Your residence visa is being processed by authorities</p>
            </div>
          )}
          {employee.finalization?.contractInitiated && !employee.finalization?.contractSigned && (
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
          {employee.finalization?.contractSigned && !employee.finalization?.mohreSubmitted && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Contract Submitted to MOHRE</p>
              <p className="text-sm text-amber-700">Waiting for MOHRE approval</p>
            </div>
          )}
          {employee.finalization?.mohreApproved && !employee.finalization?.visaReceived && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-900">Visa Application in Progress</p>
              <p className="text-sm text-amber-700">HR is processing your final visa application</p>
            </div>
          )}
          {employee.finalization?.visaReceived && !employee.finalization?.stampedVisaUploaded && (
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
          {employee.currentStage === 'completed' && employee.finalization?.stampedVisaUploaded && (
            <div className="p-4 bg-success-50 border border-success-200 rounded-lg text-center">
              <CheckCircle className="mx-auto text-success-600 mb-2" size={32} />
              <p className="font-medium text-success-900">Process Complete!</p>
              <p className="text-sm text-success-700">Your visa processing is complete. Welcome to UAE!</p>
            </div>
          )}
        </div>
      </Card>

        {/* Application Details */}
        <div className="mt-3">
          <Card title="Application Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-neutral-500">Employee Name</p>
                <p className="text-sm font-medium text-neutral-800">{employee.name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Passport Number</p>
                <p className="text-sm font-medium text-neutral-800">{employee.passportNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Nationality</p>
                <p className="text-sm font-medium text-neutral-800">{employee.nationality || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Job Title</p>
                <p className="text-sm font-medium text-neutral-800">{employee.jobTitle || 'Not provided'}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-neutral-200">
              <Button 
                variant="primary" 
                onClick={() => navigate('/employee/profile')}
                className="w-full"
              >
                View Complete Profile & All Details
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
