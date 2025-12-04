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

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee } = useData();
  const employee = getEmployee(parseInt(id));

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <p className="text-center text-gray-600">Employee not found</p>
        </Card>
      </div>
    );
  }

  const getStageColor = (stage) => {
    const colors = {
      'pre-arrival': 'bg-amber-100 text-amber-700',
      'in-country': 'bg-blue-100 text-blue-700',
      'finalization': 'bg-purple-100 text-purple-700',
      'completed': 'bg-success-100 text-success-700',
    };
    return colors[stage] || 'bg-gray-100 text-gray-700';
  };

  const timelineSteps = [
    { label: 'Documents Uploaded', completed: employee.preArrival?.documentsUploaded, phase: 'Pre-Arrival' },
    { label: 'HR Review', completed: employee.preArrival?.hrReviewed, phase: 'Pre-Arrival' },
    { label: 'Entry Permit', completed: employee.preArrival?.entryPermitGenerated, phase: 'Pre-Arrival' },
    { label: 'Arrival Updated', completed: employee.inCountry?.arrivalUpdated, phase: 'In-Country' },
    { label: 'Medical Exam', completed: employee.inCountry?.medicalCertificate, phase: 'In-Country' },
    { label: 'Biometric', completed: employee.inCountry?.biometricConfirmed, phase: 'In-Country' },
    { label: 'Contract Signed', completed: employee.finalization?.contractSigned, phase: 'Finalization' },
    { label: 'MOHRE Approved', completed: employee.finalization?.mohreApproved, phase: 'Finalization' },
    { label: 'Visa Received', completed: employee.finalization?.visaReceived, phase: 'Finalization' },
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
            {(employee.documents?.photo?.file || employee.passportPhoto) ? (
              <img
                src={employee.documents?.photo?.file || employee.passportPhoto}
                alt={employee.name}
                className="w-24 h-32 object-cover rounded-lg border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary-600">
                <User size={48} />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{employee.name}</h1>
              <div className="flex items-center gap-4 text-primary-100">
                <div className="flex items-center gap-2">
                  <IdCardLanyard size={18} />
                  <span>{employee.jobTitle}</span>
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
              employee.currentStage === 'completed' 
                ? 'bg-success-500' 
                : 'bg-white text-primary-600'
            }`}>
              {employee.currentStage}
            </span>
            <p className="text-sm text-primary-100 mt-2">
              Created: {new Date(employee.createdAt).toLocaleDateString()}
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
          value={employee.visaType}
          bgColor="bg-primary-100"
          iconColor="text-primary-600"
        />
        <StatusCard
          icon={Calendar}
          label="Created"
          value={new Date(employee.createdAt).toLocaleDateString()}
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
            const days = Math.floor((Date.now() - new Date(employee.createdAt)) / (1000 * 60 * 60 * 24));
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
          {employee.preArrival?.documentsUploaded && !employee.preArrival?.hrReviewed && (
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
          {employee.preArrival?.hrReviewed && !employee.preArrival?.disoInfoCompleted && (
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
          {employee.inCountry?.arrivalUpdated && !employee.inCountry?.medicalAppointment?.status && (
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
          {employee.inCountry?.biometricConfirmed && !employee.inCountry?.residenceVisaSubmitted && (
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
          {employee.inCountry?.residenceVisaSubmitted && !employee.finalization?.contractInitiated && (
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
          {employee.finalization?.contractSigned && !employee.finalization?.mohreSubmitted && (
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
          {employee.finalization?.mohreApproved && !employee.finalization?.visaApplicationSubmitted && (
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
          {!employee.preArrival?.documentsUploaded && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-600">Waiting for employee to upload documents</p>
            </div>
          )}

          {employee.finalization?.contractInitiated && !employee.finalization?.contractSigned && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">Waiting for employee to sign contract</p>
            </div>
          )}

          {employee.currentStage === 'completed' && (
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
              <p className="font-medium text-gray-900">{employee.passportNumber || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium text-gray-900">{employee.nationality || 'Not provided'}</p>
            </div>
          </div>
        </Card>

        <Card title="Employment Details">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="font-medium text-gray-900">{employee.jobTitle}</p>
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
              <p className="font-medium text-gray-900">{employee.startDate}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetails;
