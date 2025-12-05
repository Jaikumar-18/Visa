import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Send, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const VisaApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, workflow, addNotification } = useData();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await getEmployee(parseInt(id));
        setEmployee(data);
      } catch (error) {
        console.error('Failed to load employee:', error);
        toast.error('Failed to Load Employee Data');
      } finally {
        setIsLoading(false);
      }
    };
    loadEmployee();
  }, [id, getEmployee]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-sm text-neutral-900 font-medium">Employee not found</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setProcessingStage('Submitting application...');
    
    try {
      await workflow.applyVisa(employee.id);

      await addNotification(
        employee.id,
        'Your residence visa and Emirates ID are ready! Please upload the stamped visa page.',
        'success'
      );

      setProcessingStage('');
      toast.success('Visa & Emirates ID Generated Successfully! Employee Notified.');
      setTimeout(() => navigate('/hr/employees'), 1500);
    } catch (error) {
      console.error('Failed to apply for visa:', error);
      toast.error(error.response?.data?.message || 'Failed to Apply for Visa');
      setProcessingStage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Visa Application</h1>
            <p className="text-sm text-neutral-600">
              Apply for Residence Visa Stamping through ICP/GDRFA
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
                <p className="text-xs font-medium text-neutral-900">{employee.first_name} {employee.last_name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Passport Number</p>
                <p className="text-xs font-medium text-neutral-900">{employee.passport_number}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Nationality</p>
                <p className="text-xs font-medium text-neutral-900">{employee.present_nationality}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Visa Type</p>
                <p className="text-xs font-medium text-neutral-900">{employee.visa_type}</p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white border border-neutral-300 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-neutral-700" />
              <h2 className="text-sm font-semibold text-neutral-900">Application Details</h2>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3 space-y-1.5 mb-3">
              <div className="flex justify-between">
                <span className="text-xs text-neutral-600">MOHRE Approval:</span>
                <span className="text-xs font-medium text-green-600">✓ Approved</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-neutral-600">Residence Visa Submitted:</span>
                <span className="text-xs font-medium text-green-600">✓ Yes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-neutral-600">Biometric Data:</span>
                <span className="text-xs font-medium text-green-600">✓ Confirmed</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-900 mb-1.5">Application includes:</p>
              <ul className="list-disc list-inside text-xs text-blue-800 space-y-0.5">
                <li>Residence Visa stamping request</li>
                <li>Emirates ID generation</li>
                <li>Biometric data linkage</li>
                <li>MOHRE approved contract</li>
              </ul>
            </div>
          </div>

          {/* Processing Status */}
          {processingStage && (
            <div className="bg-white border border-neutral-300 rounded-lg p-3">
              <h2 className="text-sm font-semibold text-neutral-900 mb-2">Processing Status</h2>
              <div className="space-y-2">
                <div className={`flex items-center gap-2 p-2 rounded-lg ${
                  processingStage.includes('Submitting') ? 'bg-blue-50' : 'bg-neutral-50'
                }`}>
                  <div className={processingStage.includes('Submitting') ? 'animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600' : ''}>
                    {!processingStage.includes('Submitting') && <CheckCircle className="text-green-600" size={16} />}
                  </div>
                  <span className="text-xs font-medium">Submitted</span>
                </div>
                
                <div className={`flex items-center gap-2 p-2 rounded-lg ${
                  processingStage.includes('review') ? 'bg-blue-50' : 'bg-neutral-50'
                }`}>
                  <div className={processingStage.includes('review') ? 'animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600' : ''}>
                    {processingStage.includes('Processing') && <CheckCircle className="text-green-600" size={16} />}
                  </div>
                  <span className="text-xs font-medium">Under Review</span>
                </div>
                
                <div className={`flex items-center gap-2 p-2 rounded-lg ${
                  processingStage.includes('Processing') ? 'bg-blue-50' : 'bg-neutral-50'
                }`}>
                  <div className={processingStage.includes('Processing') ? 'animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600' : ''}>
                  </div>
                  <span className="text-xs font-medium">Visa Stamping</span>
                </div>
              </div>
            </div>
          )}

          {employee.visa_received && (
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="text-center py-4">
                <CheckCircle className="mx-auto text-green-600 mb-3" size={40} />
                <h3 className="text-base font-bold text-neutral-900 mb-2">Visa & Emirates ID Ready!</h3>
                <p className="text-xs text-neutral-600 mb-2">
                  The residence visa and Emirates ID have been generated successfully.
                </p>
                <p className="text-xs text-neutral-500">
                  Employee will be notified to upload the stamped visa page.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')}>
            Back to Employees
          </Button>
          {!employee.visa_received && (
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
          {employee.visa_received && (
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
