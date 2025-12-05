import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FileUpload from '../../components/common/FileUpload';
import WorkflowStepper from '../../components/common/WorkflowStepper';
import toast from 'react-hot-toast';

const BiometricConfirmation = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, workflow, uploadDocument, addHRNotification } = useData();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadEmployee = async () => {
      if (currentUser?.employeeId) {
        try {
          const data = await getEmployee(currentUser.employeeId);
          setEmployee(data);
        } catch (error) {
          console.error('Failed to load employee:', error);
          toast.error('Failed to Load Employee Data');
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadEmployee();
  }, [currentUser?.employeeId, getEmployee]);

  const [formData, setFormData] = useState({
    submissionDate: '',
    location: '',
    referenceNumber: '',
  });

  const [receipt, setReceipt] = useState(null);

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
          <p className="text-sm text-neutral-900 font-medium">Employee data not found</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (receipt) {
        const receiptFile = await fetch(receipt).then(r => r.blob()).then(blob => new File([blob], 'biometric_receipt.pdf', { type: blob.type }));
        await uploadDocument(receiptFile, currentUser.employeeId, 'biometric_receipt');
      }

      await workflow.confirmBiometric(currentUser.employeeId, {
        submissionDate: formData.submissionDate,
        location: formData.location,
        referenceNumber: formData.referenceNumber,
      });

      // Notify HR
      await addHRNotification(
        `${employee.first_name} ${employee.last_name} (${employee.job_title}) has confirmed biometric submission. Ready for residence visa processing.`,
        'success',
        currentUser.employeeId
      );

      toast.success('Biometric Confirmation Submitted Successfully!');
      setTimeout(() => navigate('/employee/dashboard'), 1500);
    } catch (error) {
      console.error('Failed to confirm biometric:', error);
      toast.error(error.response?.data?.message || 'Failed to Confirm Biometric');
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-2xl font-semibold text-neutral-900">Biometric Confirmation</h1>
          <p className="text-sm text-neutral-600">Confirm your biometric submission details</p>
        </div>

        {/* Workflow Stepper */}
        <div className="bg-white border border-neutral-300 rounded-lg px-6 mb-3">
          <WorkflowStepper steps={workflowSteps} currentStep={4} />
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Fingerprint className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Biometric Submission Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Submission Date"
                  name="submissionDate"
                  type="date"
                  value={formData.submissionDate}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
                <div>
                  <label className="text-xs font-medium text-neutral-700 mb-1 block">
                    Submission Location <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="">Select Location</option>
                    <option value="GDRFA Dubai">GDRFA Dubai</option>
                    <option value="GDRFA Abu Dhabi">GDRFA Abu Dhabi</option>
                    <option value="GDRFA Sharjah">GDRFA Sharjah</option>
                    <option value="ICP Center Dubai">ICP Center Dubai</option>
                    <option value="ICP Center Abu Dhabi">ICP Center Abu Dhabi</option>
                  </select>
                </div>
                <Input
                  label="Reference Number"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. BIO-2025-123456"
                />
              </div>
            </div>

            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Upload Receipt (Optional)</h2>
              </div>
              <FileUpload
                label="Biometric Receipt"
                accept="image/*,.pdf"
                onChange={(base64, fileName) => setReceipt(base64)}
              />
              <p className="text-xs text-neutral-500 mt-2">
                Upload the receipt or confirmation slip from the biometric center
              </p>
            </div>

            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">What Happens Next?</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-900 mb-2">Next Steps:</p>
                <ol className="list-decimal list-inside text-xs text-blue-800 space-y-1">
                  <li>HR will review your biometric submission confirmation</li>
                  <li>HR will submit documents for Residence Visa and Emirates ID</li>
                  <li>Processing typically takes 3-5 business days</li>
                  <li>You will be notified once your visa is ready</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Confirm Biometric Submission'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BiometricConfirmation;
