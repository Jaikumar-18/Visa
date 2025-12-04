import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
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
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-neutral-900">Upload Stamped Visa</h1>
          <p className="text-sm text-neutral-600">Final step - Upload your stamped passport page</p>
        </div>

        {/* Workflow Stepper */}
        <div className="bg-white border border-neutral-300 rounded-lg px-6 mb-3">
          <WorkflowStepper steps={workflowSteps} currentStep={8} />
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Visa Ready */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="text-center py-4">
                <CheckCircle className="mx-auto text-green-600 mb-3" size={40} />
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Your Visa is Ready!</h3>
                <p className="text-xs text-neutral-600">
                  Your residence visa and Emirates ID have been approved and generated.
                </p>
              </div>
            </div>

            {/* Download Documents */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Download className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Download Your Documents</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="text-red-600" size={24} />
                    <div>
                      <p className="text-xs font-medium text-neutral-900">Residence Visa</p>
                      <p className="text-xs text-neutral-600">Valid for 2 years</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Download Visa
                  </Button>
                </div>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="text-red-600" size={24} />
                    <div>
                      <p className="text-xs font-medium text-neutral-900">Emirates ID</p>
                      <p className="text-xs text-neutral-600">ID Number: 784-XXXX-XXXXXXX-X</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Download Emirates ID
                  </Button>
                </div>
              </div>
            </div>

            {/* Upload Stamped Visa */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Upload Stamped Passport Page</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs font-medium text-blue-900 mb-1.5">Instructions:</p>
                <ul className="list-disc list-inside text-xs text-blue-800 space-y-0.5">
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
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')}>
                Upload Later
              </Button>
              <Button type="submit" variant="success" icon={CheckCircle}>
                Complete Process
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadStampedVisa;
