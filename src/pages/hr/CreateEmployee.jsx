import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { VISA_TYPES, DEPARTMENTS, STAGES } from '../../utils/constants';
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
  const { addEmployee } = useData();
  const [step, setStep] = useState(1); // 1: Terms, 2: Form
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create employee via API
      const result = await addEmployee(formData);
      
      // Show success with password
      toast.success(
        <div>
          <p className="font-semibold">Employee created successfully!</p>
          <p className="text-sm mt-1">Email: {result.email}</p>
          <p className="text-sm">Password: {result.password}</p>
          <p className="text-xs mt-2 text-amber-600">⚠️ Save this password - it won't be shown again!</p>
        </div>,
        { duration: 10000 }
      );
      
      setTimeout(() => {
        navigate('/hr/employees');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { label: 'Terms And Conditions' },
    { label: 'General Information' },
  ];

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1600px] mx-auto w-full overflow-hidden">

        {/* Progress Stepper */}
        <div className="bg-white border border-neutral-300 rounded-lg px-6 mb-3">
          <ProgressStepper steps={steps} currentStep={step} />
        </div>

        {/* Content Area - Scrollable */}
        <div className="bg-white rounded-lg border border-neutral-300 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {step === 1 && (
              <form onSubmit={handleTermsSubmit} className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-neutral-700" />
                  <h2 className="text-base font-semibold text-neutral-900">Step 1: Terms and Conditions</h2>
                </div>

                <div className="bg-neutral-50 rounded-lg p-4 mb-4 overflow-y-auto border border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Terms and Conditions</h3>
                  <div className="space-y-3 text-xs text-neutral-700 leading-relaxed">
                    <p>
                      By creating an employee account in the Visa Management Portal, you acknowledge and agree to the following terms:
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 pl-2">
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

                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-neutral-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="terms" className="text-xs text-neutral-700">
                    I accept the terms and conditions on behalf of the company
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => navigate('/hr/dashboard')}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Continue to Employee Details
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-5 h-5 text-neutral-700" />
                  <h2 className="text-base font-semibold text-neutral-900">Step 2: General Information</h2>
                </div>

                {/* Personal Information */}
                <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Personal Information</h3>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-700 mb-1 block">
                        Title <span className="text-red-600">*</span>
                      </label>
                      <select name="title" value={formData.title} onChange={handleInputChange} required
                        className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                      </select>
                    </div>
                    <Input label="First Name (English)" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                    <Input label="الاسم الأول (Arabic)" name="firstNameArabic" value={formData.firstNameArabic} onChange={handleInputChange} dir="rtl" labelDir="rtl" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input label="Middle Name (English)" name="middleName" value={formData.middleName} onChange={handleInputChange} />
                    <Input label="الاسم الأوسط (Arabic)" name="middleNameArabic" value={formData.middleNameArabic} onChange={handleInputChange} dir="rtl" labelDir="rtl" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input label="Last Name (English)" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    <Input label="اسم العائلة (Arabic)" name="lastNameArabic" value={formData.lastNameArabic} onChange={handleInputChange} dir="rtl" labelDir="rtl" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-700 mb-1 block">
                        Qualification <span className="text-red-600">*</span>
                      </label>
                      <select name="qualification" value={formData.qualification} onChange={handleInputChange} required
                        className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                        <option value="">Select</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Post Graduate">Post Graduate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="High School">High School</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-700 mb-1 block">
                        Gender <span className="text-red-600">*</span>
                      </label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} required
                        className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-700 mb-1 block">
                        Marital Status <span className="text-red-600">*</span>
                      </label>
                      <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} required
                        className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="employee@company.com" />
                    <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required placeholder="+971 XX XXX XXXX" />
                  </div>
                </div>

                {/* Company Details */}
                <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Company Details</h3>
                  <div className="grid grid-cols-3 gap-3">
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
                <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Employment Details</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} required placeholder="e.g. Software Engineer" />
                    <div>
                      <label className="text-xs font-medium text-neutral-700 mb-1 block">
                        Department <span className="text-red-600">*</span>
                      </label>
                      <select name="department" value={formData.department} onChange={handleInputChange} required
                        className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Salary (AED)" name="salary" type="number" value={formData.salary} onChange={handleInputChange} required placeholder="e.g. 15000" />
                    <Input label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} required />
                  </div>
                  <div className="mt-3">
                    <label className="text-xs font-medium text-neutral-700 mb-1 block">
                      Visa Type <span className="text-red-600">*</span>
                    </label>
                    <select name="visaType" value={formData.visaType} onChange={handleInputChange} required
                      className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                      <option value="">Select Visa Type</option>
                      {VISA_TYPES.map(visa => (
                        <option key={visa} value={visa}>{visa}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Creating Employee...' : 'Create Employee & Send Notification'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
