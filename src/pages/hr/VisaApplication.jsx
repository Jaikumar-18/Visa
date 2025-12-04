import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Send, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const VisaApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, updateEmployee, addNotification } = useData();
  const employee = getEmployee(parseInt(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  if (!employee) {
    return <div>Employee not found</div>;
  }

  const handleSubmit = () => {
    setIsSubmitting(true);
    setProcessingStage('Submitting application...');
    
    // Stage 1: Submission
    setTimeout(() => {
      updateEmployee(employee.id, {
        finalization: {
          ...employee.finalization,
          visaApplicationSubmitted: true,
          visaApplicationSubmittedAt: new Date().toISOString(),
          visaStatus: 'submitted',
        },
      });
      
      setProcessingStage('Under review by ICP/GDRFA...');
      
      // Stage 2: Under Review
      setTimeout(() => {
        updateEmployee(employee.id, {
          finalization: {
            ...employee.finalization,
            visaStatus: 'under-review',
          },
        });
        
        setProcessingStage('Processing visa stamping...');
        
        // Stage 3: Approved
        setTimeout(() => {
          updateEmployee(employee.id, {
            finalization: {
              ...employee.finalization,
              visaStatus: 'approved',
              visaReceived: true,
              visaReceivedAt: new Date().toISOString(),
              emiratesIdReceived: true,
            },
            currentStage: 'completed',
          });

          addNotification(
            employee.id,
            'Your residence visa and Emirates ID are ready! Please upload the stamped visa page.',
            'success'
          );

          setProcessingStage('');
          setIsSubmitting(false);
          toast.success('Visa & Emirates ID Generated! Employee notified to upload stamped visa.');
          setTimeout(() => navigate('/hr/employees'), 2000);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1000px] mx-auto p-4">
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Visa Application</h1>
            <p className="text-xs text-neutral-500">
              Apply for Residence Visa Stamping through ICP/GDRFA
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
            <p className="text-sm text-gray-500">Passport Number</p>
            <p className="font-medium text-gray-900">{employee.passportNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nationality</p>
            <p className="font-medium text-gray-900">{employee.nationality}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Visa Type</p>
            <p className="font-medium text-gray-900">{employee.visaType}</p>
          </div>
        </div>
      </Card>

      {/* Application Details */}
      <Card title="Application Details" icon={FileText}>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">MOHRE Approval:</span>
            <span className="font-medium text-success-600">✓ Approved</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Residence Visa Submitted:</span>
            <span className="font-medium text-success-600">✓ Yes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Biometric Data:</span>
            <span className="font-medium text-success-600">✓ Confirmed</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">Application includes:</p>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Residence Visa stamping request</li>
            <li>Emirates ID generation</li>
            <li>Biometric data linkage</li>
            <li>MOHRE approved contract</li>
          </ul>
        </div>
      </Card>

      {/* Processing Status */}
      {processingStage && (
        <Card title="Processing Status">
          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              processingStage.includes('Submitting') ? 'bg-blue-50' : 'bg-gray-50'
            }`}>
              <div className={processingStage.includes('Submitting') ? 'animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600' : ''}>
                {!processingStage.includes('Submitting') && <CheckCircle className="text-success-600" size={20} />}
              </div>
              <span className="text-sm font-medium">Submitted</span>
            </div>
            
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              processingStage.includes('review') ? 'bg-blue-50' : 'bg-gray-50'
            }`}>
              <div className={processingStage.includes('review') ? 'animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600' : ''}>
                {processingStage.includes('Processing') && <CheckCircle className="text-success-600" size={20} />}
              </div>
              <span className="text-sm font-medium">Under Review</span>
            </div>
            
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              processingStage.includes('Processing') ? 'bg-blue-50' : 'bg-gray-50'
            }`}>
              <div className={processingStage.includes('Processing') ? 'animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600' : ''}>
              </div>
              <span className="text-sm font-medium">Visa Stamping</span>
            </div>
          </div>
        </Card>
      )}

      {employee.finalization?.visaReceived && (
        <Card>
          <div className="text-center py-6">
            <CheckCircle className="mx-auto text-success-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Visa & Emirates ID Ready!</h3>
            <p className="text-gray-600 mb-4">
              The residence visa and Emirates ID have been generated successfully.
            </p>
            <p className="text-sm text-gray-500">
              Employee will be notified to upload the stamped visa page.
            </p>
          </div>
        </Card>
      )}

        {/* Actions */}
        <div className="flex gap-2 bg-white border border-neutral-300 rounded p-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')}>
            Back to Employees
          </Button>
          {!employee.finalization?.visaApplicationSubmitted && !employee.finalization?.visaReceived && (
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              icon={Send}
            >
              {isSubmitting ? 'Processing...' : 'Submit Visa Application'}
            </Button>
          )}
          {employee.finalization?.visaReceived && (
            <Button
              type="button"
              variant="success"
              onClick={() => navigate('/hr/employees')}
              icon={CheckCircle}
            >
              Done - Back to Employees
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaApplication;
