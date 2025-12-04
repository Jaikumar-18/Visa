import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Briefcase, Calendar, MapPin, Heart, Globe,
  Users, AlertCircle, FileText, Download, ArrowLeft, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const MyProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee } = useData();
  const employee = getEmployee(currentUser?.id);

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <p className="text-center text-gray-600">Profile not found</p>
          <p className="text-center text-gray-500 text-sm mt-2">User ID: {currentUser?.id}</p>
        </Card>
      </div>
    );
  }

  const InfoRow = ({ icon: Icon, label, value, valueArabic }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="mt-1">
        <Icon size={18} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
        <p className="text-sm text-gray-900 font-medium mt-1">{value || 'Not provided'}</p>
        {valueArabic && (
          <p className="text-sm text-gray-600 mt-1 text-right" dir="rtl">{valueArabic}</p>
        )}
      </div>
    </div>
  );

  const SectionCard = ({ title, icon: Icon, children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Icon size={18} className="text-gray-700" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1400px] mx-auto p-4">
        {/* Header */}
        <div className="mb-3">
          <Button variant="secondary" onClick={() => navigate('/employee/dashboard')} icon={ArrowLeft}>
            Back to Dashboard
          </Button>
        </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {(employee.documents?.photo?.file || employee.passportPhoto) ? (
              <div className="relative">
                <img
                  src={employee.documents?.photo?.file || employee.passportPhoto}
                  alt={employee.name}
                  className="w-32 h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                />
                <div className="absolute -bottom-2 -right-2 bg-success-600 rounded-full p-1.5 border-2 border-white shadow-sm">
                  <CheckCircle size={20} className="text-white" />
                </div>
              </div>
            ) : (
              <div className="w-32 h-40 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                <User size={64} className="text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">
                {employee.firstName ? (
                  <>
                    {employee.title && `${employee.title} `}
                    {employee.firstName} {employee.middleName && `${employee.middleName} `}{employee.lastName}
                  </>
                ) : (
                  employee.name || 'Employee Name'
                )}
              </h1>
              {(employee.firstNameArabic || employee.middleNameArabic || employee.lastNameArabic) && (
                <p className="text-lg text-gray-600 mb-4" dir="rtl">
                  {employee.firstNameArabic} {employee.middleNameArabic && `${employee.middleNameArabic} `}{employee.lastNameArabic}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                  <Briefcase size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{employee.jobTitle}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                  <MapPin size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{employee.department}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                  <Calendar size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Joined: {employee.startDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={employee.currentStage === 'completed' ? 'success' : 'warning'}>
                  {employee.currentStage}
                </Badge>
                <span className="text-sm text-gray-600">
                  Employee ID: {employee.id}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="bg-white text-primary-600 hover:bg-gray-50" icon={Download}>
            Download Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <SectionCard title="Personal Information" icon={User}>
          <div className="space-y-1">
            <InfoRow 
              icon={User} 
              label="Full Name (English)" 
              value={employee.firstName 
                ? `${employee.title || ''} ${employee.firstName || ''} ${employee.middleName || ''} ${employee.lastName || ''}`.replace(/\s+/g, ' ').trim()
                : employee.name || 'Not provided'
              }
            />
            {(employee.firstNameArabic || employee.middleNameArabic || employee.lastNameArabic) && (
              <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                <div className="mt-1">
                  <User size={18} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">الاسم الكامل (Arabic)</p>
                  <p className="text-sm text-gray-900 font-medium mt-1 text-right" dir="rtl">
                    {employee.firstNameArabic || ''} {employee.middleNameArabic || ''} {employee.lastNameArabic || ''}
                  </p>
                </div>
              </div>
            )}
            {employee.motherName && (
              <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                <div className="mt-1">
                  <Users size={18} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">Mother's Name</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">{employee.motherName}</p>
                  {employee.motherNameArabic && (
                    <p className="text-sm text-gray-600 mt-1 text-right" dir="rtl">{employee.motherNameArabic}</p>
                  )}
                </div>
              </div>
            )}
            <InfoRow icon={User} label="Gender" value={employee.gender} />
            <InfoRow icon={Heart} label="Marital Status" value={employee.maritalStatus} />
            <InfoRow icon={FileText} label="Qualification" value={employee.qualification} />
            {employee.religion && (
              <InfoRow icon={Globe} label="Religion" value={employee.religion} />
            )}
            {employee.faith && (
              <InfoRow icon={Globe} label="Faith" value={employee.faith} />
            )}
          </div>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard title="Contact Information" icon={Phone}>
          <div className="space-y-1">
            <InfoRow icon={Mail} label="Email Address" value={employee.email} />
            <InfoRow icon={Phone} label="Phone Number" value={employee.phone} />
            {employee.emergencyContactName && (
              <>
                <div className="pt-4 pb-2">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <AlertCircle size={16} className="text-primary-600" />
                    Emergency Contact
                  </h3>
                </div>
                <InfoRow icon={User} label="Contact Name" value={employee.emergencyContactName} />
                <InfoRow icon={Phone} label="Contact Number" value={employee.emergencyContact} />
              </>
            )}
          </div>
        </SectionCard>

        {/* Employment Details */}
        <SectionCard title="Employment Details" icon={Briefcase}>
          <div className="space-y-1">
            <InfoRow icon={Briefcase} label="Job Title" value={employee.jobTitle} />
            <InfoRow icon={MapPin} label="Department" value={employee.department} />
            <InfoRow icon={Calendar} label="Start Date" value={employee.startDate} />
            <InfoRow icon={FileText} label="Salary" value={`AED ${employee.salary}`} />
            <InfoRow icon={FileText} label="Visa Type" value={employee.visaType} />
            {employee.dependentsVisa && (
              <InfoRow icon={Users} label="Dependents Visa on Hold" value={employee.dependentsVisa} />
            )}
          </div>
        </SectionCard>

        {/* Passport & Visa Information */}
        <SectionCard title="Passport & Visa Information" icon={FileText}>
          <div className="space-y-1">
            <InfoRow icon={FileText} label="Passport Number" value={employee.passportNumber} />
            <InfoRow icon={FileText} label="Passport Type" value={employee.passportType} />
            <InfoRow icon={Globe} label="Nationality" value={employee.presentNationality} />
            <InfoRow icon={Calendar} label="Date of Birth" value={employee.dateOfBirth} />
            <InfoRow icon={MapPin} label="Place of Birth" value={employee.placeOfBirthCity} valueArabic={employee.placeOfBirthCityArabic} />
            <InfoRow icon={Globe} label="Country of Birth" value={employee.countryOfBirth} valueArabic={employee.countryOfBirthArabic} />
            <InfoRow icon={Calendar} label="Passport Issue Date" value={employee.dateOfIssue} />
            <InfoRow icon={Calendar} label="Passport Expiry Date" value={employee.dateOfExpiry} />
            <InfoRow icon={MapPin} label="Place of Issue" value={employee.placeOfIssueCity} valueArabic={employee.placeOfIssueCityArabic} />
            <InfoRow icon={Globe} label="Country of Issue" value={employee.placeOfIssueCountry} valueArabic={employee.placeOfIssueCountryArabic} />
            {employee.previousNationality && (
              <InfoRow icon={Globe} label="Previous Nationality" value={employee.previousNationality} />
            )}
            {employee.visaNumber && (
              <InfoRow icon={FileText} label="Visa Number" value={employee.visaNumber} />
            )}
            {employee.emiratesId && (
              <InfoRow icon={FileText} label="Emirates ID" value={employee.emiratesId} />
            )}
          </div>
        </SectionCard>
      </div>

      {/* Arrival Information - Full Width */}
      {employee.inCountry?.arrivalUpdated && (
        <div className="mt-6">
          <SectionCard title="Arrival Information" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Arrival Date</p>
                <p className="text-sm text-gray-900 font-medium">{employee.inCountry.arrivalDetails?.arrivalDate || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Port of Entry</p>
                <p className="text-sm text-gray-900 font-medium">{employee.inCountry.arrivalDetails?.portOfEntry || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Flight Number</p>
                <p className="text-sm text-gray-900 font-medium">{employee.inCountry.arrivalDetails?.flightNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Current Location</p>
                <p className="text-sm text-gray-900 font-medium">{employee.inCountry.arrivalDetails?.currentLocation || 'Not provided'}</p>
              </div>
              {employee.inCountry.arrivalDetails?.hotelName && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Hotel Name</p>
                  <p className="text-sm text-gray-900 font-medium">{employee.inCountry.arrivalDetails.hotelName}</p>
                </div>
              )}
              {employee.inCountry.arrivalDetails?.contactNumberUAE && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Contact Number (UAE)</p>
                  <p className="text-sm text-gray-900 font-medium">{employee.inCountry.arrivalDetails.contactNumberUAE}</p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Documents Section */}
      {employee.documents && Object.keys(employee.documents).length > 0 && (
        <div className="mt-6">
          <SectionCard title="Uploaded Documents" icon={FileText}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(employee.documents).map(([key, doc]) => {
                if (!doc || !doc.file) return null;
                return (
                  <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="text-primary-600" size={24} />
                      <Badge variant={doc.status === 'approved' ? 'success' : 'warning'}>
                        {doc.status || 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 capitalize mb-2">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Account Information */}
      <div className="mt-6">
        <SectionCard title="Account Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Login Email</p>
              <p className="text-sm text-gray-900 font-medium">{employee.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Account Created</p>
              <p className="text-sm text-gray-900 font-medium">
                {new Date(employee.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Current Status</p>
              <Badge variant={employee.currentStage === 'completed' ? 'success' : 'warning'}>
                {employee.currentStage}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">Days in Process</p>
              <p className="text-sm text-gray-900 font-medium">
                {(() => {
                  const days = Math.floor((Date.now() - new Date(employee.createdAt)) / (1000 * 60 * 60 * 24));
                  return days === 0 ? 'Today' : `${days} ${days === 1 ? 'day' : 'days'}`;
                })()}
              </p>
            </div>
          </div>
        </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
