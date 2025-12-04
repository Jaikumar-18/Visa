import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../../components/common/Button';
import WorkflowStepper from '../../components/common/WorkflowStepper';
import toast from 'react-hot-toast';

const SignContract = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, updateEmployee, addHRNotification, refreshEmployees } = useData();
  const employee = getEmployee(currentUser.id);
  const [agreed, setAgreed] = useState(false);

  // Refresh data on mount
  useEffect(() => {
    refreshEmployees();
  }, [refreshEmployees]);

  if (!employee) {
    return <div>Loading...</div>;
  }

  const contract = employee.finalization?.contractData;

  if (!contract) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <p className="text-center text-gray-600">No contract available yet.</p>
        </Card>
      </div>
    );
  }

  const handleSign = () => {
    if (!agreed) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    updateEmployee(currentUser.id, {
      finalization: {
        ...employee.finalization,
        contractSigned: true,
        contractSignedAt: new Date().toISOString(),
        contractData: {
          ...contract,
          status: 'signed',
        },
      },
    });

    // Notify HR
    addHRNotification(
      `${employee.name} (${employee.jobTitle}) has signed the employment contract. Ready for MOHRE submission.`,
      'success',
      currentUser.id
    );

    toast.success('Contract signed successfully! HR will now submit to MOHRE.');
    setTimeout(() => navigate('/employee/dashboard'), 1500);
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
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-neutral-900">Employment Contract</h1>
          <p className="text-sm text-neutral-600">Review and sign your employment contract</p>
        </div>

        {/* Workflow Stepper */}
        <div className="bg-white border border-neutral-300 rounded-lg px-6 mb-3">
          <WorkflowStepper steps={workflowSteps} currentStep={6} />
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Contract Preview */}
          <div className="bg-white border border-neutral-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-neutral-700" />
              <h2 className="text-sm font-semibold text-neutral-900">Contract Details</h2>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-neutral-900">EMPLOYMENT CONTRACT</h2>
                <p className="text-xs text-neutral-600 mt-1">United Arab Emirates</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">PARTIES</h3>
                  <p className="text-neutral-700">
                    This Employment Contract is entered into between:
                  </p>
                  <p className="text-neutral-700 ml-3">
                    <strong>Employer:</strong> {contract.companyName || 'Company Name'}<br />
                    <strong>Employee:</strong> {contract.employeeName}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">POSITION & DEPARTMENT</h3>
                  <p className="text-neutral-700 ml-3">
                    <strong>Job Title:</strong> {contract.jobTitle}<br />
                    <strong>Department:</strong> {contract.department}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">COMPENSATION</h3>
                  <p className="text-neutral-700 ml-3">
                    <strong>Monthly Salary:</strong> AED {contract.salary}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">CONTRACT TERMS</h3>
                  <p className="text-neutral-700 ml-3">
                    <strong>Contract Type:</strong> {contract.contractType === 'limited' ? 'Limited' : 'Unlimited'}<br />
                    <strong>Duration:</strong> {contract.duration} years<br />
                    <strong>Probation Period:</strong> {contract.probationPeriod} months<br />
                    <strong>Notice Period:</strong> {contract.noticePeriod} days<br />
                    <strong>Working Hours:</strong> {contract.workingHours} hours per day<br />
                    <strong>Annual Leave:</strong> {contract.annualLeave} days
                  </p>
                </div>

                {contract.benefits && (
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">BENEFITS & ALLOWANCES</h3>
                    <p className="text-neutral-700 ml-3 whitespace-pre-line">{contract.benefits}</p>
                  </div>
                )}

                {contract.additionalTerms && (
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">ADDITIONAL TERMS</h3>
                    <p className="text-neutral-700 ml-3 whitespace-pre-line">{contract.additionalTerms}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-neutral-700">
                    <strong>Generated on:</strong> {new Date(contract.generatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <Button variant="outline" icon={Download}>
                Download PDF
              </Button>
            </div>
          </div>

          {/* Agreement */}
          <div className="bg-white border border-neutral-300 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-red-600 border-neutral-300 rounded focus:ring-red-500 mt-0.5"
              />
              <label htmlFor="agree" className="text-xs text-neutral-700">
                I have read and understood all the terms and conditions of this employment contract. 
                I agree to abide by all the terms mentioned above and accept this offer of employment.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')}>
              Review Later
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSign}
              disabled={!agreed}
              icon={CheckCircle}
            >
              Sign Contract
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignContract;
