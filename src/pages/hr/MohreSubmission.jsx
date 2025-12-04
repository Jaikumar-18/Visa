import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileCheck, Send, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
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
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">MOHRE Submission</h1>
            <p className="text-sm text-neutral-600">
              Submit employment contract to Ministry of Human Resources & Emiratisation
            </p>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {/* Employee Info */}
          <div className="bg-white border border-neutral-300 rounded-lg p-3">
            <h2 className="text-sm font-semibold text-neutral-900 mb-2">Employee Information</h2>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-neutral-500">Name</p>
                <p className="text-xs font-medium text-neutral-900">{employee.name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Job Title</p>
                <p className="text-xs font-medium text-neutral-900">{employee.jobTitle}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Salary</p>
                <p className="text-xs font-medium text-neutral-900">AED {employee.salary}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Contract Status</p>
                <p className="text-xs font-medium text-green-600">Signed</p>
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="bg-white border border-neutral-300 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="w-5 h-5 text-neutral-700" />
              <h2 className="text-sm font-semibold text-neutral-900">Contract Summary</h2>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-xs text-neutral-600">Contract Type:</span>
                <span className="text-xs font-medium text-neutral-900">
                  {employee.finalization?.contractData?.contractType === 'limited' ? 'Limited' : 'Unlimited'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-neutral-600">Duration:</span>
                <span className="text-xs font-medium text-neutral-900">
                  {employee.finalization?.contractData?.duration} years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-neutral-600">Signed Date:</span>
                <span className="text-xs font-medium text-neutral-900">
                  {new Date(employee.finalization?.contractSignedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Info */}
          <div className="bg-white border border-neutral-300 rounded-lg p-3">
            <h2 className="text-sm font-semibold text-neutral-900 mb-2">MOHRE Submission</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-blue-900 mb-1.5">What will be submitted:</p>
              <ul className="list-disc list-inside text-xs text-blue-800 space-y-0.5">
                <li>Signed employment contract</li>
                <li>Employee passport copy</li>
                <li>Company establishment card</li>
                <li>Labor contract details</li>
                <li>Salary breakdown</li>
              </ul>
            </div>

            {isProcessing && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                  <div>
                    <p className="text-xs font-medium text-amber-900">Processing MOHRE Approval...</p>
                    <p className="text-xs text-amber-700">This typically takes 2-3 business days (simulated: 3 seconds)</p>
                  </div>
                </div>
              </div>
            )}

            {employee.finalization?.mohreApproved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <p className="text-xs font-medium text-green-900">MOHRE Approved!</p>
                    <p className="text-xs text-green-700">
                      Approved on {new Date(employee.finalization?.mohreApprovedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
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
