import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../../components/common/Button';
import FileUpload from '../../components/common/FileUpload';
import WorkflowStepper from '../../components/common/WorkflowStepper';
import toast from 'react-hot-toast';

const MedicalCertificate = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, updateEmployee, addHRNotification } = useData();
  const employee = getEmployee(currentUser.id);

  const [medicalCertificate, setMedicalCertificate] = useState(null);
  const [medicalReport, setMedicalReport] = useState(null);

  if (!employee) {
    return <div>Loading...</div>;
  }

  const appointment = employee.inCountry?.medicalAppointment;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!medicalCertificate) {
      toast.error('Please upload medical certificate');
      return;
    }

    updateEmployee(currentUser.id, {
      inCountry: {
        ...employee.inCountry,
        medicalAppointment: {
          ...appointment,
          status: 'completed',
          completedAt: new Date().toISOString(),
        },
        medicalCertificate: {
          file: medicalCertificate,
          uploadedAt: new Date().toISOString(),
          status: 'pending-review',
        },
        medicalReport: medicalReport ? {
          file: medicalReport,
          uploadedAt: new Date().toISOString(),
        } : null,
      },
    });

    // Notify HR
    addHRNotification(
      `${employee.name} (${employee.jobTitle}) has uploaded medical certificate. Awaiting HR review.`,
      'success',
      currentUser.id
    );

    toast.success('Medical certificate uploaded successfully!');
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
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-neutral-900">Medical Certificate</h1>
          <p className="text-sm text-neutral-600">Upload your medical examination certificate</p>
        </div>

        {/* Workflow Stepper */}
        <div className="bg-white border border-neutral-300 rounded-lg px-6 mb-3">
          <WorkflowStepper steps={workflowSteps} currentStep={3} />
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Appointment Details */}
            {appointment && (
              <div className="bg-white border border-neutral-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-neutral-700" />
                  <h2 className="text-sm font-semibold text-neutral-900">Medical Appointment Details</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-500">Medical Center</p>
                    <p className="text-xs font-medium text-neutral-900">{appointment.center}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-neutral-400" />
                      <p className="text-xs font-medium text-neutral-900">{appointment.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Date & Time</p>
                    <p className="text-xs font-medium text-neutral-900">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  {appointment.notes && (
                    <div className="col-span-2">
                      <p className="text-xs text-neutral-500">Instructions</p>
                      <p className="text-xs text-neutral-900">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upload Documents */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Upload Medical Documents</h2>
              </div>
              <div className="space-y-4">
                <FileUpload
                  label="Medical Certificate"
                  accept="image/*,.pdf"
                  onChange={(base64, fileName) => setMedicalCertificate(base64)}
                  required
                />
                <FileUpload
                  label="Medical Report (Optional)"
                  accept="image/*,.pdf"
                  onChange={(base64, fileName) => setMedicalReport(base64)}
                />
              </div>

              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs font-medium text-amber-900 mb-1.5">Important:</p>
                <ul className="list-disc list-inside text-xs text-amber-800 space-y-0.5">
                  <li>Ensure the certificate is clear and readable</li>
                  <li>Certificate must be stamped by the medical center</li>
                  <li>All pages should be included if multiple pages</li>
                  <li>File format: PDF or clear image (JPG/PNG)</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Medical Certificate
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicalCertificate;
