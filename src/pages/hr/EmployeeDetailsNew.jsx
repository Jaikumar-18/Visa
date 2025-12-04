import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, FileText, CheckCircle, Clock, Download,
  IdCardLanyard, MapPin, Check, Circle, Eye, X
} from 'lucide-react';
import { useData } from '../../context/DataContext';

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

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-6 max-w-[1600px] mx-auto w-full overflow-hidden">
        {/* Employee Header Card */}
        <div className="bg-white rounded-lg border border-neutral-300 p-3 mb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2">
            <button onClick={() => navigate('/hr/employees')} className="p-1 hover:bg-neutral-100 rounded transition-colors" title="Back to Employees">
              <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {(employee.documents?.photo?.file || employee.passportPhoto) ? (
              <img src={employee.documents?.photo?.file || employee.passportPhoto} alt={employee.name} className="w-12 h-16 object-cover rounded border border-neutral-300" />
            ) : (
              <div className="w-12 h-16 bg-neutral-100 rounded flex items-center justify-center text-neutral-400 border border-neutral-300">
                <User size={18} />
              </div>
            )}
            <div>
              <h1 className="text-base font-semibold text-neutral-900">{employee.name}</h1>
              <div className="flex items-center gap-2 text-neutral-600 text-[10px] mt-0.5">
                <div className="flex items-center gap-0.5">
                  <IdCardLanyard size={10} />
                  <span>{employee.jobTitle}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <MapPin size={10} />
                  <span>{employee.department}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${employee.currentStage === 'completed' ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-700'}`}>
              {employee.currentStage === 'pre-arrival' ? 'Pre-Arrival' : employee.currentStage === 'in-country' ? 'In-Country' : 'Completed'}
            </span>
            <button className="p-1 hover:bg-neutral-100 rounded transition-colors" title="Download Report">
              <Download className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Horizontal Timeline */}
        <div className="pt-3 border-t border-neutral-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-700">Application Timeline</span>
            <span className="text-xs font-semibold text-neutral-900">{completedSteps}/{timelineSteps.length} Steps</span>
          </div>
          <div className="flex items-center justify-between">
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500 text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                    {step.completed ? <Check size={12} /> : <Circle size={8} />}
                  </div>
                  <p className={`text-[10px] mt-1 text-center max-w-[70px] leading-tight ${step.completed ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
                    {step.label}
                  </p>
                </div>
                {index < timelineSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${step.completed && timelineSteps[index + 1].completed ? 'bg-green-500' : 'bg-neutral-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0 mt-4">
          {/* Left Column - Documents */}
          <div className="col-span-2 bg-white rounded-lg border border-neutral-300 p-4 overflow-auto">
            <h2 className="text-sm font-semibold text-neutral-900 mb-3">Uploaded Documents</h2>
            {employee.documents && Object.keys(employee.documents).length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(employee.documents).map(([key, doc]) => {
                  if (!doc || !doc.file) return null;
                  return (
                    <div key={key} className="border border-neutral-300 rounded-lg p-3 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="text-neutral-600" size={18} />
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${doc.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-700'}`}>
                          {doc.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-neutral-900 capitalize mb-2">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <button onClick={() => setViewingDocument({ name: key, ...doc })} className="w-full px-2 py-1 bg-neutral-100 border border-neutral-300 rounded text-[10px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="mx-auto text-neutral-400 mb-2" size={32} />
                <p className="text-sm text-neutral-600">No documents uploaded yet</p>
              </div>
            )}
          </div>

          {/* Right Column - Info & Actions */}
          <div className="bg-white rounded-lg border border-neutral-300 p-4 overflow-auto">
            <h2 className="text-sm font-semibold text-neutral-900 mb-3">Employee Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-neutral-500 uppercase">Full Name</p>
                <p className="text-xs font-medium text-neutral-900">{employee.title} {employee.firstName} {employee.middleName} {employee.lastName}</p>
                {employee.firstNameArabic && <p className="text-xs text-neutral-600">{employee.firstNameArabic} {employee.middleNameArabic} {employee.lastNameArabic}</p>}
              </div>
              {employee.motherName && (
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase">Mother's Name</p>
                  <p className="text-xs font-medium text-neutral-900">{employee.motherName}</p>
                  {employee.motherNameArabic && <p className="text-xs text-neutral-600">{employee.motherNameArabic}</p>}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase">Gender</p>
                  <p className="text-xs font-medium text-neutral-900">{employee.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase">Marital Status</p>
                  <p className="text-xs font-medium text-neutral-900">{employee.maritalStatus || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase">Qualification</p>
                <p className="text-xs font-medium text-neutral-900">{employee.qualification || 'N/A'}</p>
              </div>
              {employee.religion && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase">Religion</p>
                    <p className="text-xs font-medium text-neutral-900">{employee.religion}</p>
                  </div>
                  {employee.faith && (
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase">Faith</p>
                      <p className="text-xs font-medium text-neutral-900">{employee.faith}</p>
                    </div>
                  )}
                </div>
              )}
              <div>
                <p className="text-[10px] text-neutral-500 uppercase">Passport Number</p>
                <p className="text-xs font-medium text-neutral-900">{employee.passportNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase">Nationality</p>
                <p className="text-xs font-medium text-neutral-900">{employee.nationality || 'Not provided'}</p>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <p className="text-[10px] text-neutral-500 uppercase">Visa Type</p>
                <p className="text-xs font-medium text-neutral-900">{employee.visaType}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase">Salary</p>
                <p className="text-xs font-medium text-neutral-900">AED {employee.salary}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase">Start Date</p>
                <p className="text-xs font-medium text-neutral-900">{employee.startDate}</p>
              </div>
              {employee.dependentsVisa && (
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase">Dependents Visa</p>
                  <p className="text-xs font-medium text-neutral-900">{employee.dependentsVisa}</p>
                </div>
              )}
              {employee.emergencyContactName && (
                <div className="pt-2 border-t border-neutral-200">
                  <p className="text-[10px] text-neutral-500 uppercase">Emergency Contact</p>
                  <p className="text-xs font-medium text-neutral-900">{employee.emergencyContactName}</p>
                  <p className="text-xs text-neutral-600">{employee.emergencyContact}</p>
                </div>
              )}
              <div className="pt-2 border-t border-neutral-200">
                <p className="text-[10px] text-neutral-500 uppercase">Login Email</p>
                <p className="text-xs font-medium text-neutral-900">{employee.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase">Login Password</p>
                <code className="px-2 py-0.5 bg-neutral-100 text-xs text-neutral-700 rounded border border-neutral-300">{employee.password}</code>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <p className="text-xs font-semibold text-neutral-900 mb-2">Quick Actions</p>
                {employee.preArrival?.documentsUploaded && !employee.preArrival?.hrReviewed ? (
                  <button onClick={() => navigate(`/hr/review/${employee.id}`)} className="w-full px-2 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Review Documents
                  </button>
                ) : employee.inCountry?.arrivalUpdated && !employee.inCountry?.medicalAppointment?.status ? (
                  <button onClick={() => navigate(`/hr/book-medical/${employee.id}`)} className="w-full px-2 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Book Medical
                  </button>
                ) : employee.inCountry?.biometricConfirmed && !employee.inCountry?.residenceVisaSubmitted ? (
                  <button onClick={() => navigate(`/hr/submit-visa/${employee.id}`)} className="w-full px-2 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Submit Visa
                  </button>
                ) : employee.inCountry?.residenceVisaSubmitted && !employee.finalization?.contractInitiated ? (
                  <button onClick={() => navigate(`/hr/initiate-contract/${employee.id}`)} className="w-full px-2 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Create Contract
                  </button>
                ) : employee.finalization?.contractSigned && !employee.finalization?.mohreSubmitted ? (
                  <button onClick={() => navigate(`/hr/mohre-submission/${employee.id}`)} className="w-full px-2 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Submit MOHRE
                  </button>
                ) : employee.finalization?.mohreApproved && !employee.finalization?.visaReceived ? (
                  <button onClick={() => navigate(`/hr/visa-application/${employee.id}`)} className="w-full px-2 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Apply Visa
                  </button>
                ) : employee.currentStage === 'completed' ? (
                  <div className="text-center py-3">
                    <CheckCircle className="mx-auto text-green-600 mb-1" size={24} />
                    <p className="text-xs text-green-700 font-medium">All Steps Complete!</p>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <Clock className="mx-auto text-neutral-400 mb-1" size={24} />
                    <p className="text-xs text-neutral-600 font-medium">Waiting for Employee</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                <button onClick={() => setViewingDocument(null)} className="px-3 py-1.5 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium text-neutral-700">
                  Close
                </button>
                <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetailsNew;
