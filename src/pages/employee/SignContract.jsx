import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Employment Contract</h1>
        <p className="text-gray-600 mt-1">Review and sign your employment contract</p>
      </div>

      <WorkflowStepper steps={workflowSteps} currentStep={6} />

      <div className="mt-6 space-y-6">
        {/* Contract Preview */}
        <Card title="Contract Details" icon={FileText}>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">EMPLOYMENT CONTRACT</h2>
              <p className="text-gray-600 mt-2">United Arab Emirates</p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">PARTIES</h3>
                <p className="text-gray-700">
                  This Employment Contract is entered into between:
                </p>
                <p className="text-gray-700 ml-4">
                  <strong>Employer:</strong> {contract.companyName || 'Company Name'}<br />
                  <strong>Employee:</strong> {contract.employeeName}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">POSITION & DEPARTMENT</h3>
                <p className="text-gray-700 ml-4">
                  <strong>Job Title:</strong> {contract.jobTitle}<br />
                  <strong>Department:</strong> {contract.department}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">COMPENSATION</h3>
                <p className="text-gray-700 ml-4">
                  <strong>Monthly Salary:</strong> AED {contract.salary}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">CONTRACT TERMS</h3>
                <p className="text-gray-700 ml-4">
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
                  <h3 className="font-semibold text-gray-900 mb-2">BENEFITS & ALLOWANCES</h3>
                  <p className="text-gray-700 ml-4 whitespace-pre-line">{contract.benefits}</p>
                </div>
              )}

              {contract.additionalTerms && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">ADDITIONAL TERMS</h3>
                  <p className="text-gray-700 ml-4 whitespace-pre-line">{contract.additionalTerms}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-700">
                  <strong>Generated on:</strong> {new Date(contract.generatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button variant="outline" icon={Download}>
              Download PDF
            </Button>
          </div>
        </Card>

        {/* Agreement */}
        <Card>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I have read and understood all the terms and conditions of this employment contract. 
              I agree to abide by all the terms mentioned above and accept this offer of employment.
            </label>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
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
  );
};

export default SignContract;
