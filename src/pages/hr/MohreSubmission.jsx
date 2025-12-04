import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileCheck, Send, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const MohreSubmission = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, updateEmployee, addNotification } = useData();
  const employee = getEmployee(parseInt(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!employee) {
    return <div>Employee not found</div>;
  }

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsProcessing(true);
      
      updateEmployee(employee.id, {
        finalization: {
          ...employee.finalization,
          mohreSubmitted: true,
          mohreSubmittedAt: new Date().toISOString(),
          mohreStatus: 'processing',
        },
      });

      toast.success('Contract submitted to MOHRE!');
      
      // Simulate MOHRE approval after 3 seconds
      setTimeout(() => {
        updateEmployee(employee.id, {
          finalization: {
            ...employee.finalization,
            mohreSubmitted: true,
            mohreApproved: true,
            mohreApprovedAt: new Date().toISOString(),
            mohreStatus: 'approved',
          },
        });

        addNotification(
          employee.id,
          'Your contract has been approved by MOHRE. Visa application will proceed.',
          'success'
        );

        setIsProcessing(false);
        toast.success('MOHRE Approved! Proceeding to visa application...');
        setTimeout(() => navigate(`/hr/visa-application/${employee.id}`), 1500);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1000px] mx-auto p-4">
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">MOHRE Submission</h1>
            <p className="text-xs text-neutral-500">
              Submit employment contract to Ministry of Human Resources & Emiratisation
            </p>
          </div>
        </div>

      {/* Employee Info */}
      <Card title="Employee Information">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{employee.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Job Title</p>
            <p className="font-medium text-gray-900">{employee.jobTitle}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Salary</p>
            <p className="font-medium text-gray-900">AED {employee.salary}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contract Status</p>
            <p className="font-medium text-success-600">Signed</p>
          </div>
        </div>
      </Card>

      {/* Contract Details */}
      <Card title="Contract Summary" icon={FileCheck}>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Contract Type:</span>
            <span className="font-medium text-gray-900">
              {employee.finalization?.contractData?.contractType === 'limited' ? 'Limited' : 'Unlimited'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">
              {employee.finalization?.contractData?.duration} years
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Signed Date:</span>
            <span className="font-medium text-gray-900">
              {new Date(employee.finalization?.contractSignedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Submission Info */}
      <Card title="MOHRE Submission">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-blue-900 mb-2">What will be submitted:</p>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Signed employment contract</li>
            <li>Employee passport copy</li>
            <li>Company establishment card</li>
            <li>Labor contract details</li>
            <li>Salary breakdown</li>
          </ul>
        </div>

        {isProcessing && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
              <div>
                <p className="text-sm font-medium text-amber-900">Processing MOHRE Approval...</p>
                <p className="text-xs text-amber-700">This typically takes 2-3 business days (simulated: 3 seconds)</p>
              </div>
            </div>
          </div>
        )}

        {employee.finalization?.mohreApproved && (
          <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-success-600" size={24} />
              <div>
                <p className="text-sm font-medium text-success-900">MOHRE Approved!</p>
                <p className="text-xs text-success-700">
                  Approved on {new Date(employee.finalization?.mohreApprovedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

        {/* Actions */}
        <div className="flex gap-2 bg-white border border-neutral-300 rounded p-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')}>
            Cancel
          </Button>
          {!employee.finalization?.mohreSubmitted && (
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || isProcessing}
              icon={Send}
            >
              {isSubmitting ? 'Submitting...' : 'Submit to MOHRE'}
            </Button>
          )}
          {employee.finalization?.mohreApproved && (
            <Button
              type="button"
              variant="success"
              onClick={() => navigate(`/hr/visa-application/${employee.id}`)}
              icon={CheckCircle}
            >
              Proceed to Visa Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MohreSubmission;
