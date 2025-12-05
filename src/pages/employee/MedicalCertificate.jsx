import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Calendar, ExternalLink, Map } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MEDICAL_CENTERS } from '../../utils/constants';
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
          toast.error('Failed to Load Employee Data');
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

  // Get actual medical appointment from employee data
  const appointment = employee.medicalAppointments && employee.medicalAppointments.length > 0 
    ? employee.medicalAppointments[0] 
    : null;

  // Find center info from constants
  const centerInfo = appointment 
    ? MEDICAL_CENTERS.find(center => center.name === appointment.center)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!medicalCertificate) {
      toast.error('Please Upload Medical Certificate');
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

      toast.success('Medical Certificate Uploaded Successfully!');
      setTimeout(() => navigate('/employee/dashboard'), 1500);
    } catch (error) {
      console.error('Failed to upload medical certificate:', error);
      toast.error(error.response?.data?.message || 'Failed to Upload Medical Certificate');
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
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Side - Details */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Medical Center</p>
                      <p className="text-sm font-semibold text-neutral-900">{appointment.center}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Date & Time</p>
                      <p className="text-xs font-medium text-neutral-900">
                        {new Date(appointment.appointment_date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs font-medium text-neutral-900">
                        {appointment.appointment_time}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Status</p>
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {appointment.status === 'completed' ? 'Completed' : 'Scheduled'}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-neutral-500 mb-2">Location</p>
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-neutral-900">
                          {centerInfo ? centerInfo.address : `${appointment.center}, ${appointment.location}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Map */}
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Map</p>
                    <div className="relative w-50 h-50 rounded-lg overflow-hidden border border-neutral-300 cursor-pointer group"
                      onClick={() => {
                        const mapsUrl = centerInfo 
                          ? centerInfo.googleMapsUrl 
                          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.center + ' ' + appointment.location)}`;
                        window.open(mapsUrl, '_blank');
                      }}
                    >
                      <iframe
                        title="Medical Center Location"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(centerInfo ? centerInfo.address : `${appointment.center}, ${appointment.location}`)}&zoom=15`}
                      />
                      
                      {/* Overlay with click hint */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-2 rounded-lg shadow-lg">
                          <p className="text-xs font-medium text-neutral-900 flex items-center gap-1">
                            <ExternalLink size={12} />
                            Click to open in Google Maps
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions - Full Width Below */}
                  {appointment.notes && (
                    <div className="col-span-2">
                      <p className="text-xs text-neutral-500 mb-1">Instructions</p>
                      <p className="text-xs text-neutral-900 bg-amber-50 border border-amber-200 rounded p-2">
                        {appointment.notes}
                      </p>
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
