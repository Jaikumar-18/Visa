import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import FileUpload from '../../components/common/FileUpload';
import WorkflowStepper from '../../components/common/WorkflowStepper';
import toast from 'react-hot-toast';

const UploadStampedVisa = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, updateEmployee, addNotification } = useData();
  const employee = getEmployee(currentUser.id);
  const [stampedVisa, setStampedVisa] = useState(null);

  if (!employee) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!stampedVisa) {
      toast.error('Please upload stamped visa');
      return;
    }

    updateEmployee(currentUser.id, {
      finalization: {
        ...employee.finalization,
        stampedVisaUploaded: true,
        stampedVisaFile: stampedVisa,
        stampedVisaUploadedAt: new Date().toISOString(),
      },
      currentStage: 'completed',
      status: 'completed',
    });

    addNotification(
      currentUser.id,
      'Congratulations! Your visa process is complete.',
      'success'
    );

    toast.success('Process Complete! Welcome to UAE!');
    setTimeout(() => navigate('/employee/dashboard'), 2000);
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
        <h1 className="text-3xl font-bold text-gray-900">Upload Stamped Visa</h1>
        <p className="text-gray-600 mt-1">Final step - Upload your stamped passport page</p>
      </div>

      <WorkflowStepper steps={workflowSteps} currentStep={8} />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Visa Ready */}
        <Card>
          <div className="text-center py-6">
            <CheckCircle className="mx-auto text-success-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Visa is Ready!</h3>
            <p className="text-gray-600 mb-4">
              Your residence visa and Emirates ID have been approved and generated.
            </p>
          </div>
        </Card>

        {/* Download Documents */}
        <Card title="Download Your Documents" icon={Download}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-primary-600" size={32} />
                <div>
                  <p className="font-medium text-gray-900">Residence Visa</p>
                  <p className="text-sm text-gray-600">Valid for 2 years</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Download Visa
              </Button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-primary-600" size={32} />
                <div>
                  <p className="font-medium text-gray-900">Emirates ID</p>
                  <p className="text-sm text-gray-600">ID Number: 784-XXXX-XXXXXXX-X</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Download Emirates ID
              </Button>
            </div>
          </div>
        </Card>

        {/* Upload Stamped Visa */}
        <Card title="Upload Stamped Passport Page" icon={FileText}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-blue-900 mb-2">Instructions:</p>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Take your passport to the immigration office for visa stamping</li>
              <li>Once stamped, scan or photograph the visa page clearly</li>
              <li>Upload the stamped page here to complete the process</li>
              <li>Ensure the visa stamp is clearly visible</li>
            </ul>
          </div>

          <FileUpload
            label="Stamped Visa Page"
            accept="image/*,.pdf"
            onChange={(base64, fileName) => setStampedVisa(base64)}
            required
          />
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')}>
            Upload Later
          </Button>
          <Button type="submit" variant="success" icon={CheckCircle}>
            Complete Process
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadStampedVisa;
