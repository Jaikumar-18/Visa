import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FileUpload from '../../components/common/FileUpload';
import WorkflowStepper from '../../components/common/WorkflowStepper';
import toast from 'react-hot-toast';

const BiometricConfirmation = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, updateEmployee, addHRNotification } = useData();
  const employee = getEmployee(currentUser.id);

  const [formData, setFormData] = useState({
    submissionDate: '',
    location: '',
    referenceNumber: '',
  });

  const [receipt, setReceipt] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateEmployee(currentUser.id, {
      inCountry: {
        ...employee.inCountry,
        biometricConfirmed: true,
        biometricDetails: {
          ...formData,
          receipt: receipt,
          confirmedAt: new Date().toISOString(),
        },
      },
    });

    // Notify HR
    addHRNotification(
      `${employee.name} (${employee.jobTitle}) has confirmed biometric submission. Ready for residence visa processing.`,
      'success',
      currentUser.id
    );

    toast.success('Biometric confirmation submitted successfully!');
    setTimeout(() => navigate('/employee/dashboard'), 1000);
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
      <div className="max-w-[1200px] mx-auto p-4">
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Biometric Confirmation</h1>
            <p className="text-xs text-neutral-500">Confirm your biometric submission details</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-300 rounded px-6 mb-3">
          <WorkflowStepper steps={workflowSteps} currentStep={4} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
        <Card title="Biometric Submission Details" icon={Fingerprint}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Submission Location <span className="text-primary-600">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
        </Card>

        <Card title="Upload Receipt (Optional)" icon={FileText}>
          <FileUpload
            label="Biometric Receipt"
            accept="image/*,.pdf"
            onChange={(base64, fileName) => setReceipt(base64)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload the receipt or confirmation slip from the biometric center
          </p>
        </Card>

        <Card title="What Happens Next?">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-3">Next Steps:</p>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-2">
              <li>HR will review your biometric submission confirmation</li>
              <li>HR will submit documents for Residence Visa and Emirates ID</li>
              <li>Processing typically takes 3-5 business days</li>
              <li>You will be notified once your visa is ready</li>
            </ol>
          </div>
        </Card>

          <div className="flex gap-2 bg-white border border-neutral-300 rounded p-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Biometric Submission
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BiometricConfirmation;
