import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { VISA_TYPES, DEPARTMENTS, STAGES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ProgressStepper from '../../components/common/ProgressStepper';
import toast from 'react-hot-toast';

// English to Arabic transliteration map
const englishToArabicMap = {
  'a': 'ا', 'b': 'ب', 'c': 'ك', 'd': 'د', 'e': 'ي', 'f': 'ف', 'g': 'ج',
  'h': 'ه', 'i': 'ي', 'j': 'ج', 'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن',
  'o': 'و', 'p': 'ب', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت', 'u': 'و',
  'v': 'ف', 'w': 'و', 'x': 'كس', 'y': 'ي', 'z': 'ز',
  'aa': 'ا', 'ee': 'ي', 'oo': 'و', 'ou': 'و', 'ai': 'اي', 'ay': 'اي',
  'sh': 'ش', 'ch': 'ش', 'th': 'ث', 'kh': 'خ', 'dh': 'ذ', 'gh': 'غ',
  'ph': 'ف', 'ah': 'ه', 'eh': 'ه'
};

// Arabic to English transliteration map
const arabicToEnglishMap = {
  'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
  'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'o', 'ي': 'i', 'ى': 'a', 'ة': 'h', 'ء': 'a'
};

// Transliterate English to Arabic
const transliterateToArabic = (text) => {
  if (!text) return '';
  let result = '';
  let i = 0;
  const lowerText = text.toLowerCase();
  
  while (i < lowerText.length) {
    // Check for two-character combinations first
    const twoChar = lowerText.substring(i, i + 2);
    if (englishToArabicMap[twoChar]) {
      result += englishToArabicMap[twoChar];
      i += 2;
    } else {
      // Single character
      const char = lowerText[i];
      result += englishToArabicMap[char] || char;
      i++;
    }
  }
  
  return result;
};

// Transliterate Arabic to English
const transliterateToEnglish = (text) => {
  if (!text) return '';
  let result = '';
  
  for (let char of text) {
    if (arabicToEnglishMap[char]) {
      result += arabicToEnglishMap[char];
    } else if (char === ' ') {
      result += ' ';
    }
  }
  
  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const CreateEmployee = () => {
  const navigate = useNavigate();
  const { addEmployee, addNotification } = useData();
  const [step, setStep] = useState(1); // 1: Terms, 2: Form
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info (filled by HR)
    title: '',
    firstName: '',
    firstNameArabic: '',
    middleName: '',
    middleNameArabic: '',
    lastName: '',
    lastNameArabic: '',
    email: '',
    phone: '',
    gender: '',
    maritalStatus: '',
    qualification: '',
    // Company Details (filled by HR)
    companyName: '',
    establishmentCardNumber: '',
    laborContractNumber: '',
    // Job Info (filled by HR)
    jobTitle: '',
    department: '',
    salary: '',
    visaType: '',
    startDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updates = { [name]: value };

    // Auto-translate name fields
    if (name === 'firstName') {
      updates.firstNameArabic = value ? transliterateToArabic(value) : '';
    } else if (name === 'firstNameArabic') {
      updates.firstName = value ? transliterateToEnglish(value) : '';
    } else if (name === 'middleName') {
      updates.middleNameArabic = value ? transliterateToArabic(value) : '';
    } else if (name === 'middleNameArabic') {
      updates.middleName = value ? transliterateToEnglish(value) : '';
    } else if (name === 'lastName') {
      updates.lastNameArabic = value ? transliterateToArabic(value) : '';
    } else if (name === 'lastNameArabic') {
      updates.lastName = value ? transliterateToEnglish(value) : '';
    }

    setFormData({
      ...formData,
      ...updates,
    });
  };

  const handleTermsSubmit = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error('Please accept terms and conditions');
      return;
    }
    setStep(2);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Generate password
    const password = 'emp' + Math.random().toString(36).slice(-6);
    
    // Create employee object
    const newEmployee = {
      ...formData,
      name: `${formData.firstName} ${formData.middleName || ''} ${formData.lastName}`.replace(/\s+/g, ' ').trim(),
      password,
      currentStage: STAGES.PRE_ARRIVAL,
      status: 'pending-documents',
      preArrival: {
        termsAcceptedByHR: true,
        termsAcceptedAt: new Date().toISOString(),
        documentsUploaded: false,
        hrReviewed: false,
        entryPermitGenerated: false,
      },
      inCountry: {
        arrivalUpdated: false,
        medicalAppointment: {},
        biometricConfirmed: false,
      },
      finalization: {
        contractInitiated: false,
        contractSigned: false,
        mohreApproved: false,
        visaReceived: false,
      },
      notifications: [],
      documents: {},
    };

    // Add employee
    const created = addEmployee(newEmployee);
    
    // Add notification to employee
    addNotification(
      created.id,
      `Welcome! Your account has been created. Login with email: ${created.email} and password: ${password}`,
      'success'
    );

    toast.success(`Employee created! Password: ${password}`);
    
    setTimeout(() => {
      navigate('/hr/employees');
    }, 2000);
  };

  const steps = [
    { label: 'Terms And Conditions' },
    { label: 'General Information' },
  ];

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1200px] mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Create Employee</h1>
            <p className="text-xs text-neutral-500">Complete the following steps to create a new employee</p>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white border border-neutral-300 rounded px-6 mb-3">
          <ProgressStepper steps={steps} currentStep={step} />
        </div>

      {step === 1 && (
        <Card title="Step 1: Terms and Conditions" icon={CheckCircle}>
          <form onSubmit={handleTermsSubmit}>
            <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  By creating an employee account in the Visa Management Portal, you acknowledge and agree to the following terms:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>All information provided must be accurate and complete.</li>
                  <li>The company will process visa applications in accordance with UAE immigration laws.</li>
                  <li>Employee data will be handled securely and confidentially.</li>
                  <li>The employee must provide all required documents within specified timeframes.</li>
                  <li>The company reserves the right to cancel the application if false information is provided.</li>
                  <li>Processing times may vary based on government procedures.</li>
                  <li>The employee must comply with all UAE laws and regulations.</li>
                  <li>Medical examinations and biometric submissions are mandatory.</li>
                  <li>The employee must maintain valid travel documents throughout the process.</li>
                  <li>Any changes to personal information must be reported immediately.</li>
                </ol>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I accept the terms and conditions on behalf of the company
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => navigate('/hr/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Continue to Employee Details
              </Button>
            </div>
          </form>
        </Card>
      )}

      {step === 2 && (
        <Card title="Step 2: General Information" icon={UserPlus}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Title <span className="text-primary-600">*</span>
                  </label>
                  <select name="title" value={formData.title} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
                <Input label="First Name (English)" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                <Input label="الاسم الأول (Arabic)" name="firstNameArabic" value={formData.firstNameArabic} onChange={handleInputChange} dir="rtl" labelDir="rtl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input label="Middle Name (English)" name="middleName" value={formData.middleName} onChange={handleInputChange} />
                <Input label="الاسم الأوسط (Arabic)" name="middleNameArabic" value={formData.middleNameArabic} onChange={handleInputChange} dir="rtl" labelDir="rtl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input label="Last Name (English)" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                <Input label="اسم العائلة (Arabic)" name="lastNameArabic" value={formData.lastNameArabic} onChange={handleInputChange} dir="rtl" labelDir="rtl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Qualification <span className="text-primary-600">*</span>
                  </label>
                  <select name="qualification" value={formData.qualification} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="High School">High School</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Gender <span className="text-primary-600">*</span>
                  </label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Marital Status <span className="text-primary-600">*</span>
                  </label>
                  <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="employee@company.com" />
                <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required placeholder="+971 XX XXX XXXX" />
              </div>
            </div>

            {/* Company Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. ABC Technologies LLC"
                />
                <Input
                  label="Establishment Card Number"
                  name="establishmentCardNumber"
                  value={formData.establishmentCardNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. EST-123456"
                />
                <Input
                  label="Labor Contract Number"
                  name="laborContractNumber"
                  value={formData.laborContractNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. LC-2025-001"
                />
              </div>
            </div>

            {/* Employment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} required placeholder="e.g. Software Engineer" />
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Department <span className="text-primary-600">*</span>
                  </label>
                  <select name="department" value={formData.department} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <Input label="Salary (AED)" name="salary" type="number" value={formData.salary} onChange={handleInputChange} required placeholder="e.g. 15000" />
                <Input label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Visa Type <span className="text-primary-600">*</span>
                  </label>
                  <select name="visaType" value={formData.visaType} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select Visa Type</option>
                    {VISA_TYPES.map(visa => (
                      <option key={visa} value={visa}>{visa}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" variant="primary">
                Create Employee & Send Notification
              </Button>
            </div>
          </form>
        </Card>
      )}
      </div>
    </div>
  );
};

export default CreateEmployee;
