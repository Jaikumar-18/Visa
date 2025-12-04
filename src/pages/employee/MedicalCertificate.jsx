import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Medical Certificate</h1>
        <p className="text-gray-600 mt-1">Upload your medical examination certificate</p>
      </div>

      <WorkflowStepper steps={workflowSteps} currentStep={3} />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Appointment Details */}
        {appointment && (
          <Card title="Medical Appointment Details" icon={Calendar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Medical Center</p>
                <p className="font-medium text-gray-900">{appointment.center}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <p className="font-medium text-gray-900">{appointment.location}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {appointment.date} at {appointment.time}
                </p>
              </div>
              {appointment.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Instructions</p>
                  <p className="text-gray-900">{appointment.notes}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Upload Documents */}
        <Card title="Upload Medical Documents" icon={FileText}>
          <div className="space-y-6">
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

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-900 mb-2">Important:</p>
            <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
              <li>Ensure the certificate is clear and readable</li>
              <li>Certificate must be stamped by the medical center</li>
              <li>All pages should be included if multiple pages</li>
              <li>File format: PDF or clear image (JPG/PNG)</li>
            </ul>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit Medical Certificate
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MedicalCertificate;
