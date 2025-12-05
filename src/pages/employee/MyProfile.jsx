import { useState, useEffect } from 'react';
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
import toast from 'react-hot-toast';

const MyProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee } = useData();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const loadEmployee = async () => {
      if (currentUser?.employeeId) {
        try {
          console.log('MyProfile: Loading employee data for ID:', currentUser.employeeId);
          const data = await getEmployee(currentUser.employeeId);
          console.log('MyProfile: Employee data received:', data);
          console.log('MyProfile: Passport Number:', data?.passport_number);
          console.log('MyProfile: Documents:', data?.documents);
          console.log('MyProfile: PassportDetails object:', data?.passportDetails);
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
          console.error('MyProfile: Failed to load employee:', error);
          toast.error('Failed to load profile data');
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadEmployee();

    // Cleanup blob URL
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [currentUser?.employeeId, getEmployee]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <p className="text-center text-gray-600">Profile not found</p>
          <p className="text-center text-gray-500 text-sm mt-2">User ID: {currentUser?.employeeId}</p>
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
              {photoUrl ? (
                <div className="relative">
                  <img
                    src={photoUrl}
                    alt={employee.first_name}
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
                {employee.first_name ? (
                  <>
                    {employee.title && `${employee.title} `}
                    {employee.first_name} {employee.middle_name && `${employee.middle_name} `}{employee.last_name}
                  </>
                ) : (
                  'Employee Name'
                )}
                </h2>
                {(employee.first_name_arabic || employee.middle_name_arabic || employee.last_name_arabic) && (
                  <p className="text-sm text-neutral-600 mb-2" dir="rtl">
                    {employee.first_name_arabic} {employee.middle_name_arabic && `${employee.middle_name_arabic} `}{employee.last_name_arabic}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-2 py-1 rounded">
                    <IdCardLanyard size={14} className="text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-900">{employee.job_title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-2 py-1 rounded">
                    <MapPin size={14} className="text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-900">{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-2 py-1 rounded">
                    <Calendar size={14} className="text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-900">Joined: {employee.start_date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={employee.current_stage === 'completed' ? 'success' : 'warning'}>
                    {employee.current_stage}
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
              value={employee.first_name 
                ? `${employee.title || ''} ${employee.first_name || ''} ${employee.middle_name || ''} ${employee.last_name || ''}`.replace(/\s+/g, ' ').trim()
                : 'Not provided'
              }
            />
            {(employee.first_name_arabic || employee.middle_name_arabic || employee.last_name_arabic) && (
              <div className="flex items-start gap-2 py-2 border-b border-neutral-100">
                <div className="mt-0.5">
                  <User size={14} className="text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 font-medium">الاسم الكامل (Arabic)</p>
                  <p className="text-xs text-neutral-900 font-medium mt-0.5 text-right" dir="rtl">
                    {employee.first_name_arabic || ''} {employee.middle_name_arabic || ''} {employee.last_name_arabic || ''}
                  </p>
                </div>
              </div>
            )}
            {employee.mother_name && (
              <div className="flex items-start gap-2 py-2 border-b border-neutral-100">
                <div className="mt-0.5">
                  <Users size={14} className="text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 font-medium">Mother's Name</p>
                  <p className="text-xs text-neutral-900 font-medium mt-0.5">{employee.mother_name}</p>
                  {employee.mother_name_arabic && (
                    <p className="text-xs text-neutral-600 mt-0.5 text-right" dir="rtl">{employee.mother_name_arabic}</p>
                  )}
                </div>
              </div>
            )}
            <InfoRow icon={User} label="Gender" value={employee.gender} />
            <InfoRow icon={Heart} label="Marital Status" value={employee.marital_status} />
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
            {employee.emergency_contact_name && (
              <>
                <div className="pt-2 pb-1">
                  <h4 className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-neutral-600" />
                    Emergency Contact
                  </h4>
                </div>
                <InfoRow icon={User} label="Contact Name" value={employee.emergency_contact_name} />
                <InfoRow icon={Phone} label="Contact Number" value={employee.emergency_contact} />
              </>
            )}
          </div>
        </SectionCard>

        {/* Employment Details */}
        <SectionCard title="Employment Details" icon={IdCardLanyard}>
          <div className="space-y-1">
            <InfoRow icon={IdCardLanyard} label="Job Title" value={employee.job_title} />
            <InfoRow icon={MapPin} label="Department" value={employee.department} />
            <InfoRow icon={Calendar} label="Start Date" value={employee.start_date} />
            <InfoRow icon={FileText} label="Salary" value={`AED ${employee.salary}`} />
            <InfoRow icon={FileText} label="Visa Type" value={employee.visa_type} />
            {employee.dependents_visa && (
              <InfoRow icon={Users} label="Dependents Visa on Hold" value={employee.dependents_visa} />
            )}
          </div>
        </SectionCard>

        {/* Passport & Visa Information */}
        <SectionCard title="Passport & Visa Information" icon={FileText}>
          <div className="space-y-1">
            <InfoRow icon={FileText} label="Passport Number" value={employee.passport_number} />
            <InfoRow icon={FileText} label="Passport Type" value={employee.passport_type} />
            <InfoRow icon={Globe} label="Nationality" value={employee.present_nationality} />
            <InfoRow icon={Calendar} label="Date of Birth" value={employee.date_of_birth} />
            <InfoRow icon={MapPin} label="Place of Birth" value={employee.place_of_birth_city} valueArabic={employee.place_of_birth_city_arabic} />
            <InfoRow icon={Globe} label="Country of Birth" value={employee.country_of_birth} valueArabic={employee.country_of_birth_arabic} />
            <InfoRow icon={Calendar} label="Passport Issue Date" value={employee.date_of_issue} />
            <InfoRow icon={Calendar} label="Passport Expiry Date" value={employee.date_of_expiry} />
            <InfoRow icon={MapPin} label="Place of Issue" value={employee.place_of_issue_city} valueArabic={employee.place_of_issue_city_arabic} />
            <InfoRow icon={Globe} label="Country of Issue" value={employee.place_of_issue_country} valueArabic={employee.place_of_issue_country_arabic} />
            {employee.previous_nationality && (
              <InfoRow icon={Globe} label="Previous Nationality" value={employee.previous_nationality} />
            )}
            {employee.visa_number && (
              <InfoRow icon={FileText} label="Visa Number" value={employee.visa_number} />
            )}
            {employee.emirates_id && (
              <InfoRow icon={FileText} label="Emirates ID" value={employee.emirates_id} />
            )}
          </div>
        </SectionCard>
      </div>

          {/* Arrival Information - Full Width */}
          {employee.arrival_updated && employee.arrival_date && (
            <SectionCard title="Arrival Information" icon={MapPin} className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-neutral-500 font-medium mb-1">Arrival Date</p>
                  <p className="text-xs text-neutral-900 font-medium">{employee.arrival_date || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium mb-1">Port of Entry</p>
                  <p className="text-xs text-neutral-900 font-medium">{employee.port_of_entry || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium mb-1">Flight Number</p>
                  <p className="text-xs text-neutral-900 font-medium">{employee.flight_number || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium mb-1">Current Location</p>
                  <p className="text-xs text-neutral-900 font-medium">{employee.current_location || 'Not provided'}</p>
                </div>
                {employee.hotel_name && (
                  <div>
                    <p className="text-xs text-neutral-500 font-medium mb-1">Hotel Name</p>
                    <p className="text-xs text-neutral-900 font-medium">{employee.hotel_name}</p>
                  </div>
                )}
                {employee.contact_number_uae && (
                  <div>
                    <p className="text-xs text-neutral-500 font-medium mb-1">Contact Number (UAE)</p>
                    <p className="text-xs text-neutral-900 font-medium">{employee.contact_number_uae}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Documents Section */}
          {employee.documents && employee.documents.length > 0 && (
            <SectionCard title="Uploaded Documents" icon={FileText} className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {employee.documents.map((doc) => (
                  <div key={doc.id} className="border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="text-neutral-600" size={18} />
                      <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'}>
                        {doc.status || 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-xs font-medium text-neutral-900 capitalize mb-1">
                      {doc.document_type?.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-neutral-500 mb-1">
                      {doc.file_name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
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
                  {new Date(employee.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium mb-1">Current Status</p>
                <Badge variant={employee.current_stage === 'completed' ? 'success' : 'warning'}>
                  {employee.current_stage}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium mb-1">Days in Process</p>
                <p className="text-xs text-neutral-900 font-medium">
                  {(() => {
                    const days = Math.floor((Date.now() - new Date(employee.created_at)) / (1000 * 60 * 60 * 24));
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

