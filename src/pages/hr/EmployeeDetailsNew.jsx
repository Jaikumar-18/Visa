import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, FileText, CheckCircle, Clock, Download, Mail, Phone,
  Briefcase, MapPin, Check, Circle, Eye, X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const EmployeeDetailsNew = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, refreshEmployees } = useData();
  const employee = getEmployee(parseInt(id));
  const [viewingDocument, setViewingDocument] = useState(null);

  // Auto-refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshEmployees();
    }, 3000);

    return () => clearInterval(interval);
  }, [refreshEmployees]);

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
            Download Documents
          </Button>
        </div>
      </div>

      {/* Employee Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-6">
            {(employee.documents?.photo?.file || employee.passportPhoto) ? (
              <img
                src={employee.documents?.photo?.file || employee.passportPhoto}
                alt={employee.name}
                className="w-20 h-24 object-cover rounded-lg border-2 border-gray-300"
              />
            ) : (
              <div className="w-20 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 border-2 border-gray-300">
                <User size={40} />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Briefcase size={16} />
                  <span className="text-sm">{employee.jobTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span className="text-sm">{employee.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-gray-500">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span className="text-sm">{employee.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              employee.currentStage === 'completed' 
                ? 'bg-success-100 text-success-700' 
                : 'bg-primary-100 text-primary-700'
            }`}>
              {employee.currentStage}
            </span>
            <p className="text-sm text-gray-500 mt-2">
              Created: {new Date(employee.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-gray-900">{completedSteps}/{timelineSteps.length} Steps Completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{Math.round(progressPercentage)}% Complete</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <Card title="Application Timeline">
            <div className="space-y-6">
              {timelineSteps.map((step, index) => {
                const showPhaseLabel = index === 0 || timelineSteps[index - 1].phase !== step.phase;
                const isLastInPhase = index < timelineSteps.length - 1 && 
                                      timelineSteps[index + 1].phase !== step.phase;

                return (
                  <div key={index}>
                    {showPhaseLabel && (
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{step.phase} Phase</h3>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed ? 'bg-success-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {step.completed ? <Check size={20} /> : <Circle size={16} />}
                        </div>
                        {index < timelineSteps.length - 1 && !isLastInPhase && (
                          <div className={`w-0.5 h-12 ${step.completed ? 'bg-success-500' : 'bg-gray-300'}`}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                        {step.completed && (
                          <span className="text-xs text-success-600">✓ Completed</span>
                        )}
                      </div>
                    </div>

                    {isLastInPhase && index < timelineSteps.length - 1 && (
                      <div className="my-4 ml-5 border-t border-dashed border-gray-300"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Documents */}
          <Card title="Uploaded Documents">
            {employee.documents && Object.keys(employee.documents).length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(employee.documents).map(([key, doc]) => {
                  if (!doc || !doc.file) return null;
                  return (
                    <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="text-primary-600" size={24} />
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          doc.status === 'approved' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {doc.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 text-xs" 
                        icon={Eye}
                        onClick={() => setViewingDocument({ name: key, ...doc })}
                      >
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600">No documents uploaded yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Employee needs to upload documents to proceed
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Info & Actions */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card title="Personal Information">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Full Name</p>
                <p className="font-medium text-gray-900">
                  {employee.title} {employee.firstName} {employee.middleName} {employee.lastName}
                </p>
                {employee.firstNameArabic && (
                  <p className="text-sm text-gray-600 mt-1">
                    {employee.firstNameArabic} {employee.middleNameArabic} {employee.lastNameArabic}
                  </p>
                )}
              </div>
              {employee.motherName && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Mother's Name</p>
                  <p className="font-medium text-gray-900">{employee.motherName}</p>
                  {employee.motherNameArabic && (
                    <p className="text-sm text-gray-600">{employee.motherNameArabic}</p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Gender</p>
                  <p className="font-medium text-gray-900">{employee.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Marital Status</p>
                  <p className="font-medium text-gray-900">{employee.maritalStatus || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Qualification</p>
                <p className="font-medium text-gray-900">{employee.qualification || 'N/A'}</p>
              </div>
              {employee.religion && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Religion</p>
                    <p className="font-medium text-gray-900">{employee.religion}</p>
                  </div>
                  {employee.faith && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Faith</p>
                      <p className="font-medium text-gray-900">{employee.faith}</p>
                    </div>
                  )}
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase">Passport Number</p>
                <p className="font-medium text-gray-900">{employee.passportNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Nationality</p>
                <p className="font-medium text-gray-900">{employee.nationality || 'Not provided'}</p>
              </div>
            </div>
          </Card>

          {/* Employment Info */}
          <Card title="Employment Details">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Visa Type</p>
                <p className="font-medium text-gray-900">{employee.visaType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Salary</p>
                <p className="font-medium text-gray-900">AED {employee.salary}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Start Date</p>
                <p className="font-medium text-gray-900">{employee.startDate}</p>
              </div>
              {employee.dependentsVisa && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Dependents Visa</p>
                  <p className="font-medium text-gray-900">{employee.dependentsVisa}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Emergency Contact */}
          {employee.emergencyContactName && (
            <Card title="Emergency Contact">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Contact Name</p>
                  <p className="font-medium text-gray-900">{employee.emergencyContactName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Contact Number</p>
                  <p className="font-medium text-gray-900">{employee.emergencyContact}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Login Info */}
          <Card title="Login Credentials">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Email</p>
                <p className="font-medium text-gray-900">{employee.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Password</p>
                <code className="px-2 py-1 bg-gray-100 text-sm text-gray-800 rounded">{employee.password}</code>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2">
              {employee.preArrival?.documentsUploaded && !employee.preArrival?.hrReviewed ? (
                <Button variant="primary" onClick={() => navigate(`/hr/review/${employee.id}`)} className="w-full">
                  Review Documents
                </Button>
              ) : employee.inCountry?.arrivalUpdated && !employee.inCountry?.medicalAppointment?.status ? (
                <Button variant="primary" onClick={() => navigate(`/hr/book-medical/${employee.id}`)} className="w-full">
                  Book Medical
                </Button>
              ) : employee.inCountry?.biometricConfirmed && !employee.inCountry?.residenceVisaSubmitted ? (
                <Button variant="primary" onClick={() => navigate(`/hr/submit-visa/${employee.id}`)} className="w-full">
                  Submit Visa
                </Button>
              ) : employee.inCountry?.residenceVisaSubmitted && !employee.finalization?.contractInitiated ? (
                <Button variant="primary" onClick={() => navigate(`/hr/initiate-contract/${employee.id}`)} className="w-full">
                  Create Contract
                </Button>
              ) : employee.finalization?.contractSigned && !employee.finalization?.mohreSubmitted ? (
                <Button variant="primary" onClick={() => navigate(`/hr/mohre-submission/${employee.id}`)} className="w-full">
                  Submit MOHRE
                </Button>
              ) : employee.finalization?.mohreApproved && !employee.finalization?.visaReceived ? (
                <Button variant="primary" onClick={() => navigate(`/hr/visa-application/${employee.id}`)} className="w-full">
                  Apply Visa
                </Button>
              ) : employee.currentStage === 'completed' ? (
                <div className="text-center py-6">
                  <CheckCircle className="mx-auto text-success-600 mb-3" size={48} />
                  <p className="text-success-700 font-medium">All Steps Complete!</p>
                  <p className="text-sm text-gray-500 mt-1">No pending actions</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600 font-medium">Waiting for Employee</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {!employee.preArrival?.documentsUploaded 
                      ? 'Employee needs to upload documents'
                      : 'Employee needs to complete their tasks'}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Stats */}
          {/* <Card title="Statistics">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Days in Process</span>
                <span className="font-bold text-gray-900">
                  {(() => {
                    const days = Math.floor((Date.now() - new Date(employee.createdAt)) / (1000 * 60 * 60 * 24));
                    return days === 0 ? 'Today' : days;
                  })()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed Steps</span>
                <span className="font-bold text-success-600">{completedSteps}/{timelineSteps.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="font-bold text-primary-600">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </Card> */}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900 capitalize">
                  {viewingDocument.name.replace(/([A-Z])/g, ' $1')}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Uploaded: {new Date(viewingDocument.uploadedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setViewingDocument(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {viewingDocument.file.includes('image/') ? (
                <img
                  src={viewingDocument.file}
                  alt={viewingDocument.name}
                  className="w-full h-auto rounded-lg border border-gray-200"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="text-gray-400 mb-4" size={64} />
                  <p className="text-gray-600 mb-4">PDF Document</p>
                  <a
                    href={viewingDocument.file}
                    download={`${viewingDocument.name}.pdf`}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Download PDF
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  viewingDocument.status === 'approved' 
                    ? 'bg-success-100 text-success-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {viewingDocument.status || 'Pending'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setViewingDocument(null)}>
                  Close
                </Button>
                <Button variant="primary" icon={Download}>
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetailsNew;
