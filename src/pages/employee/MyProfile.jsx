import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, IdCardLanyard, Calendar, MapPin, Heart, Globe,
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
    <div className="flex items-start gap-2 py-2 border-b border-neutral-100 last:border-0">
      <div className="mt-0.5">
        <Icon size={14} className="text-neutral-600" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-neutral-500 font-medium">{label}</p>
        <p className="text-xs text-neutral-900 font-medium mt-0.5">{value || 'Not provided'}</p>
        {valueArabic && (
          <p className="text-xs text-neutral-600 mt-0.5 text-right" dir="rtl">{valueArabic}</p>
        )}
      </div>
    </div>
  );

  const SectionCard = ({ title, icon: Icon, children, className = '' }) => (
    <div className={`bg-white border border-neutral-300 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-neutral-50 border-b border-neutral-300 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-neutral-700" />
          <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">My Profile</h1>
            <p className="text-sm text-neutral-600">View and manage your personal information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/employee/dashboard')} icon={ArrowLeft}>
              Back to Dashboard
            </Button>
            <Button variant="outline" icon={Download}>
              Download Profile
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-3">
          {/* Profile Header Card */}
          <div className="bg-white border border-neutral-300 rounded-lg p-4">
            <div className="flex items-start gap-4">
              {(employee.documents?.photo?.file || employee.passportPhoto) ? (
                <div className="relative">
                  <img
                    src={employee.documents?.photo?.file || employee.passportPhoto}
                    alt={employee.name}
                    className="w-24 h-32 object-cover rounded-lg border-2 border-neutral-300"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-success-600 rounded-full p-1 border-2 border-white">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-24 h-32 bg-neutral-100 rounded-lg flex items-center justify-center border-2 border-neutral-300">
                  <User size={48} className="text-neutral-400" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1 text-neutral-900">
                {employee.firstName ? (
                  <>
                    {employee.title && `${employee.title} `}
                    {employee.firstName} {employee.middleName && `${employee.middleName} `}{employee.lastName}
                  </>
                ) : (
                  employee.name || 'Employee Name'
                )}
                </h2>
                {(employee.firstNameArabic || employee.middleNameArabic || employee.lastNameArabic) && (
                  <p className="text-sm text-neutral-600 mb-2" dir="rtl">
                    {employee.firstNameArabic} {employee.middleNameArabic && `${employee.middleNameArabic} `}{employee.lastNameArabic}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-2 py-1 rounded">
                    <IdCardLanyard size={14} className="text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-900">{employee.jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-2 py-1 rounded">
                    <MapPin size={14} className="text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-900">{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-2 py-1 rounded">
                    <Calendar size={14} className="text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-900">Joined: {employee.startDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={employee.currentStage === 'completed' ? 'success' : 'warning'}>
                    {employee.currentStage}
                  </Badge>
                  <span className="text-xs text-neutral-600">
                    ID: {employee.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
              <div className="flex items-start gap-2 py-2 border-b border-neutral-100">
                <div className="mt-0.5">
                  <User size={14} className="text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 font-medium">الاسم الكامل (Arabic)</p>
                  <p className="text-xs text-neutral-900 font-medium mt-0.5 text-right" dir="rtl">
                    {employee.firstNameArabic || ''} {employee.middleNameArabic || ''} {employee.lastNameArabic || ''}
                  </p>
                </div>
              </div>
            )}
            {employee.motherName && (
              <div className="flex items-start gap-2 py-2 border-b border-neutral-100">
                <div className="mt-0.5">
                  <Users size={14} className="text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 font-medium">Mother's Name</p>
                  <p className="text-xs text-neutral-900 font-medium mt-0.5">{employee.motherName}</p>
                  {employee.motherNameArabic && (
                    <p className="text-xs text-neutral-600 mt-0.5 text-right" dir="rtl">{employee.motherNameArabic}</p>
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
                <div className="pt-2 pb-1">
                  <h4 className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-neutral-600" />
                    Emergency Contact
                  </h4>
                </div>
                <InfoRow icon={User} label="Contact Name" value={employee.emergencyContactName} />
                <InfoRow icon={Phone} label="Contact Number" value={employee.emergencyContact} />
              </>
            )}
          </div>
        </SectionCard>

        {/* Employment Details */}
        <SectionCard title="Employment Details" icon={IdCardLanyard}>
          <div className="space-y-1">
            <InfoRow icon={IdCardLanyard} label="Job Title" value={employee.jobTitle} />
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
            <SectionCard title="Arrival Information" icon={MapPin} className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-neutral-500 font-medium mb-1">Arrival Date</p>
                  <p className="text-xs text-neutral-900 font-medium">{employee.inCountry.arrivalDetails?.arrivalDate || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium mb-1">Port of Entry</p>
                  <p className="text-xs text-neutral-900 font-medium">{employee.inCountry.arrivalDetails?.portOfEntry || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium mb-1">Flight Number</p>
                  <p className="text-xs text-neutral-900 font-medium">{employee.inCountry.arrivalDetails?.flightNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium mb-1">Current Location</p>
                  <p className="text-xs text-neutral-900 font-medium">{employee.inCountry.arrivalDetails?.currentLocation || 'Not provided'}</p>
                </div>
                {employee.inCountry.arrivalDetails?.hotelName && (
                  <div>
                    <p className="text-xs text-neutral-500 font-medium mb-1">Hotel Name</p>
                    <p className="text-xs text-neutral-900 font-medium">{employee.inCountry.arrivalDetails.hotelName}</p>
                  </div>
                )}
                {employee.inCountry.arrivalDetails?.contactNumberUAE && (
                  <div>
                    <p className="text-xs text-neutral-500 font-medium mb-1">Contact Number (UAE)</p>
                    <p className="text-xs text-neutral-900 font-medium">{employee.inCountry.arrivalDetails.contactNumberUAE}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Documents Section */}
          {employee.documents && Object.keys(employee.documents).length > 0 && (
            <SectionCard title="Uploaded Documents" icon={FileText} className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(employee.documents).map(([key, doc]) => {
                  if (!doc || !doc.file) return null;
                  return (
                    <div key={key} className="border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="text-neutral-600" size={18} />
                        <Badge variant={doc.status === 'approved' ? 'success' : 'warning'}>
                          {doc.status || 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-xs font-medium text-neutral-900 capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {/* Account Information */}
          <SectionCard title="Account Information" icon={User} className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-neutral-500 font-medium mb-1">Login Email</p>
                <p className="text-xs text-neutral-900 font-medium">{employee.email}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium mb-1">Account Created</p>
                <p className="text-xs text-neutral-900 font-medium">
                  {new Date(employee.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium mb-1">Current Status</p>
                <Badge variant={employee.currentStage === 'completed' ? 'success' : 'warning'}>
                  {employee.currentStage}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium mb-1">Days in Process</p>
                <p className="text-xs text-neutral-900 font-medium">
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

