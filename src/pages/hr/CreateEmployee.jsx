import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useCompany } from '../../context/CompanyContext';
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
  const { selectedCompany } = useCompany();
  const [step, setStep] = useState(1); // 1: Terms, 2: Generic Info, 3: Employee Details
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Employee Basic Info
    title: '',
    firstName: '',
    firstNameArabic: '',
    middleName: '',
    middleNameArabic: '',
    lastName: '',
    lastNameArabic: '',
    email: '',
    phone: '',
    // Company Details
    companyName: '',
    establishmentCardNumber: '',
    laborContractNumber: '',
    // HR Details
    hrName: '',
    hrPhone: '',
    hrEmail: '',
    serviceType: '',
    submittedBy: '',
    submittedUserDesignation: '',
    // Employment Details
    jobTitle: '',
    department: '',
    salary: '',
    visaType: '',
    startDate: '',
  });

  // Auto-fill company details when company is selected
  useEffect(() => {
    if (selectedCompany) {
      setFormData(prev => ({
        ...prev,
        companyName: selectedCompany.company_name || '',
        establishmentCardNumber: selectedCompany.establishment_card_number || '',
        laborContractNumber: selectedCompany.labor_contract_number || '',
      }));
    }
  }, [selectedCompany]);

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
      toast.error('Please Accept Terms and Conditions');
      return;
    }
    setStep(2);
  };

  const handleGenericInfoSubmit = (e) => {
    e.preventDefault();
    
    // Validation for Generic Information (Company & HR Details)
    if (!formData.companyName || !formData.establishmentCardNumber || !formData.laborContractNumber ||
        !formData.hrName || !formData.hrPhone || !formData.hrEmail || !formData.serviceType || 
        !formData.submittedBy || !formData.submittedUserDesignation) {
      toast.error('Please Provide All Required Company and HR Details');
      return;
    }
    
    setStep(3);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for Employee Details (Personal Information & Employment)
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
        !formData.jobTitle || !formData.department || !formData.salary || !formData.visaType || !formData.startDate) {
      toast.error('Please Provide All Required Employee Details');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Add default values for fields that employee will fill later
      const employeeData = {
        ...formData,
        gender: 'Male', // Default value, employee will update
        maritalStatus: 'Single', // Default value, employee will update
        qualification: 'Graduate', // Default value, employee will update
      };
      
      // Create employee via API
      const result = await addEmployee(employeeData);
      
      // Show success with email notification info
      toast.success(
        <div>
          <p className="font-semibold">Employee Created Successfully!</p>
          <p className="text-xs mt-1">Welcome Email Sent to {formData.email}</p>
        </div>,
        { duration: 3000 }
      );
      
      setTimeout(() => {
        navigate('/hr/employees');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to Create Employee');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { label: 'Terms And Conditions' },
    { label: 'Generic Information' },
    { label: 'Employee Details' },
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
                    Continue to Company & HR Details
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleGenericInfoSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-5 h-5 text-neutral-700" />
                  <h2 className="text-base font-semibold text-neutral-900">Step 2: Generic Information</h2>
                </div>

                {/* Company Details */}
                <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                    Company Details
                    {selectedCompany && (
                      <span className="ml-2 text-xs text-green-600 font-normal">(Auto-filled from selected company)</span>
                    )}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      disabled={!!selectedCompany}
                      placeholder="e.g. ABC Technologies LLC"
                    />
                    <Input
                      label="Establishment Card Number"
                      name="establishmentCardNumber"
                      value={formData.establishmentCardNumber}
                      onChange={handleInputChange}
                      required
                      disabled={!!selectedCompany}
                      placeholder="e.g. EST-123456"
                    />
                    <Input
                      label="Labor Contract Number"
                      name="laborContractNumber"
                      value={formData.laborContractNumber}
                      onChange={handleInputChange}
                      required
                      disabled={!!selectedCompany}
                      placeholder="e.g. LC-2025-001"
                    />
                  </div>
                </div>

                {/* HR Details */}
                <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">HR Details</h3>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <Input label="HR Name" name="hrName" value={formData.hrName} onChange={handleInputChange} required placeholder="e.g. John Smith" />
                    <Input label="HR Phone Number" name="hrPhone" type="tel" value={formData.hrPhone} onChange={handleInputChange} required placeholder="+971 XX XXX XXXX" />
                    <Input label="HR Email" name="hrEmail" type="email" value={formData.hrEmail} onChange={handleInputChange} required placeholder="hr@company.com" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input label="Service Type" name="serviceType" value={formData.serviceType} onChange={handleInputChange} required placeholder="e.g. New Employment Residency Visa" />
                    <Input label="Submitted By" name="submittedBy" value={formData.submittedBy} onChange={handleInputChange} required placeholder="e.g. Portal User" />
                    <Input label="Submitted User Designation" name="submittedUserDesignation" value={formData.submittedUserDesignation} onChange={handleInputChange} required placeholder="e.g. HR Manager" />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary">
                    Continue to Employee Details
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-5 h-5 text-neutral-700" />
                  <h2 className="text-base font-semibold text-neutral-900">Step 3: Employee Details</h2>
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

                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Last Name (English)" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    <Input label="اسم العائلة (Arabic)" name="lastNameArabic" value={formData.lastNameArabic} onChange={handleInputChange} dir="rtl" labelDir="rtl" />
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
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
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
