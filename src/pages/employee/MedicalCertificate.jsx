import { useState, useEffect } from 'react';
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
  const { getEmployee, uploadDocument, workflow, addHRNotification } = useData();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [medicalCertificate, setMedicalCertificate] = useState(null);
  const [medicalReport, setMedicalReport] = useState(null);

  useEffect(() => {
    const loadEmployee = async () => {
      if (currentUser?.employeeId) {
        try {
          const data = await getEmployee(currentUser.employeeId);
          setEmployee(data);
        } catch (error) {
          console.error('Failed to load employee:', error);
          toast.error('Failed to load employee data');
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadEmployee();
  }, [currentUser?.employeeId, getEmployee]);

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

  const appointment = employee.medical_appointment_scheduled ? {
    center: 'Medical Center',
    location: 'Dubai',
    date: new Date().toLocaleDateString(),
    time: '10:00 AM'
  } : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!medicalCertificate) {
      toast.error('Please upload medical certificate');
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert base64 to File object for upload
      const medicalCertFile = await fetch(medicalCertificate).then(r => r.blob()).then(blob => new File([blob], 'medical_certificate.pdf', { type: blob.type }));
      await uploadDocument(medicalCertFile, currentUser.employeeId, 'medical_certificate');
      
      if (medicalReport) {
        const medicalReportFile = await fetch(medicalReport).then(r => r.blob()).then(blob => new File([blob], 'medical_report.pdf', { type: blob.type }));
        await uploadDocument(medicalReportFile, currentUser.employeeId, 'medical_report');
      }

      await workflow.uploadMedicalCert(currentUser.employeeId);

      // Notify HR
      await addHRNotification(
        `${employee.first_name} ${employee.last_name} (${employee.job_title}) has uploaded medical certificate.`,
        'success',
        currentUser.employeeId
      );

      toast.success('Medical certificate uploaded successfully!');
      setTimeout(() => navigate('/employee/dashboard'), 1500);
    } catch (error) {
      console.error('Failed to upload medical certificate:', error);
      toast.error(error.response?.data?.message || 'Failed to upload medical certificate');
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
              <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Submit Medical Certificate'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicalCertificate;
