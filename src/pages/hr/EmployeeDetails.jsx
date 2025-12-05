import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, FileText, Calendar, CheckCircle, Clock, 
  Eye, Upload, Send, FileCheck, Plane, Stethoscope, 
  Fingerprint, FileSignature, Download, Mail, Phone,
  IdCardLanyard, MapPin, CreditCard, Check, Circle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusCard from '../../components/common/StatusCard';
import toast from 'react-hot-toast';

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee } = useData();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await getEmployee(parseInt(id));
        setEmployee(data);

        // Load photo with authentication
        const photoDoc = data?.documents?.find(doc => 
          doc.document_type === 'photo' || 
          doc.document_type === 'passport_photo' ||
          doc.document_type === 'passport_size_photo'
        );
        
        if (photoDoc && photoDoc.mime_type?.startsWith('image/')) {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(
              `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/api/documents/${photoDoc.id}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            if (response.ok) {
              const blob = await response.blob();
              setPhotoUrl(URL.createObjectURL(blob));
            }
          } catch (err) {
            console.error('Failed to load photo:', err);
          }
        }
      } catch (error) {
        console.error('Failed to load employee:', error);
        toast.error('Failed to load employee data');
      } finally {
        setIsLoading(false);
      }
    };
    loadEmployee();

    // Cleanup blob URL
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [id, getEmployee]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <p className="text-center text-gray-600">Employee not found</p>
        </Card>
      </div>
    );
  }



  const timelineSteps = [
    { label: 'Documents Uploaded', completed: employee.documents_uploaded, phase: 'Pre-Arrival' },
    { label: 'HR Review', completed: employee.hr_reviewed, phase: 'Pre-Arrival' },
    { label: 'Entry Permit', completed: employee.entry_permit_generated, phase: 'Pre-Arrival' },
    { label: 'Arrival Updated', completed: employee.arrival_updated, phase: 'In-Country' },
    { label: 'Medical Exam', completed: employee.medical_certificate_uploaded, phase: 'In-Country' },
    { label: 'Biometric', completed: employee.biometric_confirmed, phase: 'In-Country' },
    { label: 'Contract Signed', completed: employee.contract_signed, phase: 'Finalization' },
    { label: 'MOHRE Approved', completed: employee.mohre_approved, phase: 'Finalization' },
    { label: 'Visa Received', completed: employee.visa_received, phase: 'Finalization' },
  ];

  const completedSteps = timelineSteps.filter(s => s.completed).length;
  const progressPercentage = (completedSteps / timelineSteps.length) * 100;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => navigate('/hr/employees')}>
          ← Back to Employees
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" icon={Download}>
            Download Report
          </Button>
          <Button variant="outline" icon={Download}>
            Download All Documents
          </Button>
        </div>
      </div>

      {/* Employee Header Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 mb-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`${employee.first_name} ${employee.last_name}`}
                className="w-24 h-32 object-cover rounded-lg border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary-600">
                <User size={48} />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{employee.first_name} {employee.last_name}</h1>
              <div className="flex items-center gap-4 text-primary-100">
                <div className="flex items-center gap-2">
                  <IdCardLanyard size={18} />
                  <span>{employee.job_title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{employee.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-primary-100">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span className="text-sm">{employee.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              employee.current_stage === 'completed' 
                ? 'bg-success-500' 
                : 'bg-white text-primary-600'
            }`}>
              {employee.current_stage}
            </span>
            <p className="text-sm text-primary-100 mt-2">
              Created: {new Date(employee.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-bold">{completedSteps}/{timelineSteps.length} Steps</span>
          </div>
          <div className="w-full bg-primary-800 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatusCard
          icon={User}
          label="Visa Type"
          value={employee.visa_type}
          bgColor="bg-primary-100"
          iconColor="text-primary-600"
        />
        <StatusCard
          icon={Calendar}
          label="Created"
          value={new Date(employee.created_at).toLocaleDateString()}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatusCard
          icon={FileText}
          label="Status"
          value={employee.status || 'Active'}
          bgColor="bg-success-100"
          iconColor="text-success-600"
        />
        <StatusCard
          icon={Clock}
          label="Days in Process"
          value={(() => {
            const days = Math.floor((Date.now() - new Date(employee.created_at)) / (1000 * 60 * 60 * 24));
            return days === 0 ? 'Today' : days;
          })()}
          bgColor="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>

      {/* Action Items */}
      <Card title="Action Items">
        <div className="space-y-3">
          {/* Review Documents */}
          {employee.documents_uploaded && !employee.hr_reviewed && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-primary-900">Review Documents</p>
                  <p className="text-sm text-primary-700">Employee has uploaded documents for review</p>
                </div>
              </div>
              <Button variant="primary" onClick={() => navigate(`/hr/review/${employee.id}`)}>
                Review Now
              </Button>
            </div>
          )}

          {/* DISO Portal Info */}
          {employee.hr_reviewed && !employee.diso_info_completed && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-primary-900">Fill DISO Portal Information</p>
                  <p className="text-sm text-primary-700">Complete additional information for government portal</p>
                </div>
              </div>
              <Button variant="primary" onClick={() => navigate(`/hr/diso-info/${employee.id}`)}>
                Fill Info
              </Button>
            </div>
          )}

          {/* Book Medical */}
          {employee.arrival_updated && !employee.medical_appointment_scheduled && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Stethoscope className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-primary-900">Book Medical Appointment</p>
                  <p className="text-sm text-primary-700">Employee has arrived, schedule medical examination</p>
                </div>
              </div>
              <Button variant="primary" onClick={() => navigate(`/hr/book-medical/${employee.id}`)}>
                Book Now
              </Button>
            </div>
          )}

          {/* Submit Residence Visa */}
          {employee.biometric_confirmed && !employee.residence_visa_submitted && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Send className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-primary-900">Submit Residence Visa Application</p>
                  <p className="text-sm text-primary-700">All documents ready, submit for processing</p>
                </div>
              </div>
              <Button variant="primary" onClick={() => navigate(`/hr/submit-visa/${employee.id}`)}>
                Submit
              </Button>
            </div>
          )}

          {/* Initiate Contract */}
          {employee.residence_visa_submitted && !employee.contract_initiated && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileSignature className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-primary-900">Initiate Employment Contract</p>
                  <p className="text-sm text-primary-700">Generate and send contract for signature</p>
                </div>
              </div>
              <Button variant="primary" onClick={() => navigate(`/hr/initiate-contract/${employee.id}`)}>
                Create Contract
              </Button>
            </div>
          )}

          {/* Submit to MOHRE */}
          {employee.contract_signed && !employee.mohre_submitted && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Send className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-primary-900">Submit to MOHRE</p>
                  <p className="text-sm text-primary-700">Submit contract for MOHRE approval</p>
                </div>
              </div>
              <Button variant="primary" onClick={() => navigate(`/hr/mohre-submission/${employee.id}`)}>
                Submit
              </Button>
            </div>
          )}

          {/* Apply for Visa */}
          {employee.mohre_approved && !employee.visa_application_submitted && (
            <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-primary-900">Apply for Visa Stamping</p>
                  <p className="text-sm text-primary-700">Submit visa application to ICP/GDRFA</p>
                </div>
              </div>
              <Button variant="primary" onClick={() => navigate(`/hr/visa-application/${employee.id}`)}>
                Apply
              </Button>
            </div>
          )}

          {/* Waiting states */}
          {!employee.documents_uploaded && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-600">Waiting for employee to upload documents</p>
            </div>
          )}

          {employee.contract_initiated && !employee.contract_signed && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">Waiting for employee to sign contract</p>
            </div>
          )}

          {employee.current_stage === 'completed' && (
            <div className="p-4 bg-success-50 border border-success-200 rounded-lg text-center">
              <CheckCircle className="mx-auto text-success-600 mb-2" size={32} />
              <p className="font-medium text-success-900">Process Complete!</p>
            </div>
          )}
        </div>
      </Card>

      {/* Employee Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card title="Personal Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{employee.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{employee.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Passport Number</p>
              <p className="font-medium text-gray-900">{employee.passport_number || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium text-gray-900">{employee.present_nationality || 'Not provided'}</p>
            </div>
          </div>
        </Card>

        <Card title="Employment Details">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="font-medium text-gray-900">{employee.job_title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium text-gray-900">{employee.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium text-gray-900">AED {employee.salary}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium text-gray-900">{employee.start_date}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetails;
