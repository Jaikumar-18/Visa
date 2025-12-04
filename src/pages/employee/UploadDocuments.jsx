import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload as UploadIcon, Loader, CheckCircle, Search, FileSearch, Type, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FileUpload from '../../components/common/FileUpload';
import WorkflowStepper from '../../components/common/WorkflowStepper';
import toast from 'react-hot-toast';
import Tesseract from 'tesseract.js';

const UploadDocuments = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, updateEmployee, addNotification, addHRNotification } = useData();
  const employee = getEmployee(currentUser.id);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Details (filled by Employee)
    motherName: '',
    motherNameArabic: '',
    religion: '',
    faith: '',
    languagesKnown: '',
    dependentsVisa: '',
    // Passport Details
    passportNumber: '',
    passportType: '',
    dateOfIssue: '',
    dateOfExpiry: '',
    placeOfIssueCountry: '',
    placeOfIssueCountryArabic: '',
    placeOfIssueCity: '',
    placeOfIssueCityArabic: '',
    dateOfBirth: '',
    countryOfBirth: '',
    countryOfBirthArabic: '',
    placeOfBirthCity: '',
    placeOfBirthCityArabic: '',
    presentNationality: '',
    previousNationality: '',
    // Address Details
    address: '',
    emergencyContact: '',
    emergencyContactName: '',
  });

  const [documents, setDocuments] = useState({
    passport: null,
    photo: null,
    certificates: null,
    employmentLetter: null,
    other: null,
  });

  useEffect(() => {
    // Only load data once when component mounts or employee ID changes
    if (employee && employee.id) {
      setFormData({
        // Personal Details
        motherName: employee.motherName || '',
        motherNameArabic: employee.motherNameArabic || '',
        religion: employee.religion || '',
        faith: employee.faith || '',
        languagesKnown: employee.languagesKnown || '',
        dependentsVisa: employee.dependentsVisa || '',
        // Passport Details
        passportNumber: employee.passportNumber || '',
        passportType: employee.passportType || '',
        dateOfIssue: employee.dateOfIssue || '',
        dateOfExpiry: employee.dateOfExpiry || '',
        placeOfIssueCountry: employee.placeOfIssueCountry || '',
        placeOfIssueCountryArabic: employee.placeOfIssueCountryArabic || '',
        placeOfIssueCity: employee.placeOfIssueCity || '',
        placeOfIssueCityArabic: employee.placeOfIssueCityArabic || '',
        dateOfBirth: employee.dateOfBirth || '',
        countryOfBirth: employee.countryOfBirth || '',
        countryOfBirthArabic: employee.countryOfBirthArabic || '',
        placeOfBirthCity: employee.placeOfBirthCity || '',
        placeOfBirthCityArabic: employee.placeOfBirthCityArabic || '',
        presentNationality: employee.presentNationality || '',
        previousNationality: employee.previousNationality || '',
        // Address Details
        address: employee.address || '',
        emergencyContact: employee.emergencyContact || '',
        emergencyContactName: employee.emergencyContactName || '',
      });
      setDocuments(employee.documents || {
        passport: null,
        photo: null,
        certificates: null,
        employmentLetter: null,
        other: null,
      });
    }
  }, [employee?.id]); // Only run when employee ID changes, not on every render

  // Arabic transliteration maps (same as CreateEmployee) - MUST BE BEFORE handleInputChange
  const englishToArabicMap = {
    'a': 'ا', 'b': 'ب', 'c': 'ك', 'd': 'د', 'e': 'ي', 'f': 'ف', 'g': 'ج',
    'h': 'ه', 'i': 'ي', 'j': 'ج', 'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن',
    'o': 'و', 'p': 'ب', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت', 'u': 'و',
    'v': 'ف', 'w': 'و', 'x': 'كس', 'y': 'ي', 'z': 'ز',
    'aa': 'ا', 'ee': 'ي', 'oo': 'و', 'ou': 'و', 'ai': 'اي', 'ay': 'اي',
    'sh': 'ش', 'ch': 'ش', 'th': 'ث', 'kh': 'خ', 'dh': 'ذ', 'gh': 'غ',
    'ph': 'ف', 'ah': 'ه', 'eh': 'ه'
  };

  const arabicToEnglishMap = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ب': 'b', 'ت': 't', 'ث': 'th',
    'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'o', 'ي': 'i', 'ى': 'a', 'ة': 'h', 'ء': 'a'
  };

  const transliterateToArabic = (text) => {
    if (!text) return '';
    let result = '';
    let i = 0;
    const lowerText = text.toLowerCase();
    
    while (i < lowerText.length) {
      const twoChar = lowerText.substring(i, i + 2);
      if (englishToArabicMap[twoChar]) {
        result += englishToArabicMap[twoChar];
        i += 2;
      } else {
        const char = lowerText[i];
        result += englishToArabicMap[char] || char;
        i++;
      }
    }
    return result;
  };

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
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  // Handle input changes with Arabic auto-translation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updates = { [name]: value };

    // Auto-translate mother's name fields
    if (name === 'motherName') {
      updates.motherNameArabic = value ? transliterateToArabic(value) : '';
    } else if (name === 'motherNameArabic') {
      updates.motherName = value ? transliterateToEnglish(value) : '';
    }
    // Auto-translate city fields
    else if (name === 'placeOfIssueCity') {
      updates.placeOfIssueCityArabic = value ? transliterateToArabic(value) : '';
    } else if (name === 'placeOfIssueCityArabic') {
      updates.placeOfIssueCity = value ? transliterateToEnglish(value) : '';
    } else if (name === 'placeOfBirthCity') {
      updates.placeOfBirthCityArabic = value ? transliterateToArabic(value) : '';
    } else if (name === 'placeOfBirthCityArabic') {
      updates.placeOfBirthCity = value ? transliterateToEnglish(value) : '';
    }
    // Auto-translate country fields (from dropdown)
    else if (name === 'placeOfIssueCountry') {
      updates.placeOfIssueCountryArabic = value ? (countryToArabicMap[value] || '') : '';
    } else if (name === 'countryOfBirth') {
      updates.countryOfBirthArabic = value ? (countryToArabicMap[value] || '') : '';
    }

    setFormData({
      ...formData,
      ...updates,
    });
  };

  // Country to Arabic mapping
  const countryToArabicMap = {
    'India': 'الهند',
    'Pakistan': 'باكستان',
    'Bangladesh': 'بنغلاديش',
    'Philippines': 'الفلبين',
    'Egypt': 'مصر',
    'Nepal': 'نيبال',
    'Sri Lanka': 'سريلانكا',
    'Indonesia': 'إندونيسيا',
    'Thailand': 'تايلاند',
    'Vietnam': 'فيتنام',
    'China': 'الصين',
    'Japan': 'اليابان',
    'South Korea': 'كوريا الجنوبية',
    'United States': 'الولايات المتحدة',
    'United Kingdom': 'المملكة المتحدة',
    'Canada': 'كندا',
    'Australia': 'أستراليا',
    'Other': 'أخرى'
  };

  // Country code to country name mapping
  const countryCodeMap = {
    'IND': { country: 'India', nationality: 'Indian' },
    'PAK': { country: 'Pakistan', nationality: 'Pakistani' },
    'BGD': { country: 'Bangladesh', nationality: 'Bangladeshi' },
    'PHL': { country: 'Philippines', nationality: 'Filipino' },
    'EGY': { country: 'Egypt', nationality: 'Egyptian' },
    'NPL': { country: 'Nepal', nationality: 'Nepalese' },
    'LKA': { country: 'Sri Lanka', nationality: 'Sri Lankan' },
    'IDN': { country: 'Indonesia', nationality: 'Indonesian' },
    'THA': { country: 'Thailand', nationality: 'Thai' },
    'VNM': { country: 'Vietnam', nationality: 'Vietnamese' },
    'CHN': { country: 'China', nationality: 'Chinese' },
    'JPN': { country: 'Japan', nationality: 'Japanese' },
    'KOR': { country: 'South Korea', nationality: 'Korean' },
    'USA': { country: 'United States', nationality: 'American' },
    'GBR': { country: 'United Kingdom', nationality: 'British' },
    'CAN': { country: 'Canada', nationality: 'Canadian' },
    'AUS': { country: 'Australia', nationality: 'Australian' },
    'NZL': { country: 'New Zealand', nationality: 'New Zealander' },
    'ZAF': { country: 'South Africa', nationality: 'South African' },
    'KEN': { country: 'Kenya', nationality: 'Kenyan' },
    'NGA': { country: 'Nigeria', nationality: 'Nigerian' },
    'ETH': { country: 'Ethiopia', nationality: 'Ethiopian' },
    'UGA': { country: 'Uganda', nationality: 'Ugandan' },
    'SAU': { country: 'Saudi Arabia', nationality: 'Saudi' },
    'ARE': { country: 'United Arab Emirates', nationality: 'Emirati' },
    'JOR': { country: 'Jordan', nationality: 'Jordanian' },
    'LBN': { country: 'Lebanon', nationality: 'Lebanese' },
    'SYR': { country: 'Syria', nationality: 'Syrian' },
    'IRQ': { country: 'Iraq', nationality: 'Iraqi' },
    'IRN': { country: 'Iran', nationality: 'Iranian' },
    'TUR': { country: 'Turkey', nationality: 'Turkish' },
    'DEU': { country: 'Germany', nationality: 'German' },
    'FRA': { country: 'France', nationality: 'French' },
    'ITA': { country: 'Italy', nationality: 'Italian' },
    'ESP': { country: 'Spain', nationality: 'Spanish' },
    'RUS': { country: 'Russia', nationality: 'Russian' },
    'BRA': { country: 'Brazil', nationality: 'Brazilian' },
    'MEX': { country: 'Mexico', nationality: 'Mexican' },
    'ARG': { country: 'Argentina', nationality: 'Argentinian' },
  };

  // Helper function to get country info from code
  const getCountryInfo = (code) => {
    return countryCodeMap[code] || { country: code, nationality: code };
  };

  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD
  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
    const match = dateStr.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
    if (match) {
      const [, day, month, year] = match;
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const extractPassportData = async (imageBase64) => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      const result = await Tesseract.recognize(
        imageBase64,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setScanProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      const text = result.data.text;
      console.log('Extracted text:', text);

      // Parse passport data from text
      const extracted = {};

      // Extract passport number (usually 8-9 alphanumeric characters)
      const passportMatch = text.match(/[A-Z]{1,2}[0-9]{6,8}/);
      if (passportMatch) extracted.passportNumber = passportMatch[0];

      // Extract passport type
      const typeMatch = text.match(/Type[:\s]+([A-Z]+)/i);
      if (typeMatch) {
        const type = typeMatch[1].toUpperCase();
        if (type === 'P' || type.includes('REGULAR')) extracted.passportType = 'Regular';
      }

      // Extract place of issue (city)
      const placeOfIssueMatch = text.match(/Place\s+of\s+[Ii]ssue[:\s]+([A-Z\s]+)/i);
      if (placeOfIssueMatch) {
        const place = placeOfIssueMatch[1].trim().split(/\s{2,}/)[0]; // Get first part before multiple spaces
        extracted.placeOfIssueCity = place;
      }

      // Alternative: Look for capitalized words that might be cities (generic approach)
      if (!extracted.placeOfIssueCity) {
        // Look for sequences of capital letters that might be city names
        const capitalWords = text.match(/\b[A-Z]{3,}(?:\s+[A-Z]{3,})*\b/g);
        if (capitalWords && capitalWords.length > 0) {
          // Filter out common passport words AND country names
          const excludeWords = [
            'PASSPORT', 'REPUBLIC', 'TYPE', 'CODE', 'SURNAME', 'GIVEN', 'NAME', 
            'NATIONALITY', 'DATE', 'BIRTH', 'PLACE', 'ISSUE', 'SEX', 'INDIAN',
            // Country names to exclude
            'INDIA', 'PAKISTAN', 'BANGLADESH', 'PHILIPPINES', 'EGYPT', 'NEPAL',
            'LANKA', 'INDONESIA', 'THAILAND', 'VIETNAM', 'CHINA', 'JAPAN', 
            'KOREA', 'UNITED', 'STATES', 'KINGDOM', 'CANADA', 'AUSTRALIA',
            'ZEALAND', 'AFRICA', 'KENYA', 'NIGERIA', 'ETHIOPIA', 'UGANDA',
            'SAUDI', 'ARABIA', 'EMIRATES', 'JORDAN', 'LEBANON', 'SYRIA',
            'IRAQ', 'IRAN', 'TURKEY', 'GERMANY', 'FRANCE', 'ITALY', 'SPAIN',
            'RUSSIA', 'BRAZIL', 'MEXICO', 'ARGENTINA'
          ];
          const cities = capitalWords.filter(word => 
            !excludeWords.some(exclude => word.includes(exclude)) && 
            word.length >= 4 && 
            word.length <= 30
          );
          if (cities.length > 0) {
            // Take the first reasonable city name found
            extracted.placeOfIssueCity = cities[0];
          }
        }
      }

      // Extract place of birth (generic approach)
      const placeOfBirthMatch = text.match(/Place\s+of\s+[Bb]irth[:\s]+([A-Z\s,]+)/i);
      if (placeOfBirthMatch) {
        const birthPlace = placeOfBirthMatch[1].trim().split(/\s{2,}|,/)[0];
        extracted.placeOfBirthCity = birthPlace.trim();
      }

      // Alternative: Look for location patterns (works for many countries)
      if (!extracted.placeOfBirthCity) {
        // Common city/location suffixes across different countries
        const locationMatch = text.match(/([A-Z][A-Za-z\s]+(?:NAGAR|ABAD|PUR|VILLE|CITY|TOWN|BURG|POLIS|GRAD))/i);
        if (locationMatch) {
          const location = locationMatch[0].trim();
          // Make sure it's not a country name
          const countryNames = ['INDIA', 'PAKISTAN', 'BANGLADESH', 'PHILIPPINES', 'EGYPT'];
          if (!countryNames.some(country => location.includes(country))) {
            extracted.placeOfBirthCity = location;
          }
        }
      }

      // Extract dates (DD/MM/YYYY or DD-MM-YYYY format) - store temporarily
      const dateMatches = text.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/g);
      let tempDates = {};
      if (dateMatches && dateMatches.length >= 1) {
        // Try to identify which date is which based on position or context
        if (dateMatches.length >= 3) {
          tempDates.dateOfBirth = convertDateFormat(dateMatches[0]);
          tempDates.dateOfIssue = convertDateFormat(dateMatches[1]);
          tempDates.dateOfExpiry = convertDateFormat(dateMatches[2]);
        } else if (dateMatches.length === 2) {
          tempDates.dateOfIssue = convertDateFormat(dateMatches[0]);
          tempDates.dateOfExpiry = convertDateFormat(dateMatches[1]);
        }
      }

      // Extract nationality from common patterns
      const nationalityMatch = text.match(/Nationality[:\s]+([A-Z]+)/i);
      if (nationalityMatch) {
        const nat = nationalityMatch[1].toUpperCase();
        // Try to match with country codes
        const countryInfo = getCountryInfo(nat);
        if (countryInfo) {
          extracted.presentNationality = countryInfo.nationality;
          extracted.placeOfIssueCountry = countryInfo.country;
          extracted.countryOfBirth = countryInfo.country;
        }
      }

      // Extract country code (more reliable)
      const countryCodeMatch = text.match(/Country\s+Code[:\s]+([A-Z]{3})/i);
      if (countryCodeMatch) {
        const code = countryCodeMatch[1].toUpperCase();
        const countryInfo = getCountryInfo(code);
        extracted.presentNationality = countryInfo.nationality;
        extracted.placeOfIssueCountry = countryInfo.country;
        extracted.countryOfBirth = countryInfo.country;
      }

      // Extract MRZ (Machine Readable Zone) if present - MOST RELIABLE
      const mrzLines = text.split('\n').filter(line => line.match(/^[A-Z0-9<]+$/));
      if (mrzLines.length >= 2) {
        const mrz = mrzLines.join('');
        
        // Parse MRZ format for nationality and country (works for all countries)
        const mrzPassport = mrz.match(/P<([A-Z]{3})/);
        if (mrzPassport) {
          const countryCode = mrzPassport[1].toUpperCase();
          const countryInfo = getCountryInfo(countryCode);
          
          extracted.presentNationality = countryInfo.nationality;
          extracted.placeOfIssueCountry = countryInfo.country;
          extracted.countryOfBirth = countryInfo.country;
          extracted.passportType = 'Regular'; // P type is regular passport
        }
        
        // Extract passport number from MRZ (more reliable)
        const mrzNumber = mrz.match(/([A-Z][0-9]{7})[0-9]/);
        if (mrzNumber) {
          extracted.passportNumber = mrzNumber[1];
        }

        // Extract DOB and Expiry from MRZ (YYMMDD format) - most reliable
        const mrzData = mrz.match(/([0-9]{6})[0-9]M([0-9]{6})/);
        if (mrzData) {
          const dob = mrzData[1];
          const year = parseInt(dob.substring(0, 2)) > 50 ? '19' + dob.substring(0, 2) : '20' + dob.substring(0, 2);
          extracted.dateOfBirth = `${year}-${dob.substring(2, 4)}-${dob.substring(4, 6)}`;
          
          const expiry = mrzData[2];
          const expYear = parseInt(expiry.substring(0, 2)) > 50 ? '19' + expiry.substring(0, 2) : '20' + expiry.substring(0, 2);
          extracted.dateOfExpiry = `${expYear}-${expiry.substring(2, 4)}-${expiry.substring(4, 6)}`;
        }

        // Try to extract issue date from MRZ or calculate it (usually 10 years before expiry)
        if (extracted.dateOfExpiry && !tempDates.dateOfIssue) {
          const expiryDate = new Date(extracted.dateOfExpiry);
          const issueDate = new Date(expiryDate);
          issueDate.setFullYear(issueDate.getFullYear() - 10);
          const year = issueDate.getFullYear();
          const month = String(issueDate.getMonth() + 1).padStart(2, '0');
          const day = String(issueDate.getDate()).padStart(2, '0');
          tempDates.dateOfIssue = `${year}-${month}-${day}`;
        }
      }

      // Merge temp dates with extracted (MRZ takes priority)
      const finalData = { ...tempDates, ...extracted };

      // Auto-translate extracted city names to Arabic
      if (finalData.placeOfIssueCity) {
        finalData.placeOfIssueCityArabic = transliterateToArabic(finalData.placeOfIssueCity);
      }
      if (finalData.placeOfBirthCity) {
        finalData.placeOfBirthCityArabic = transliterateToArabic(finalData.placeOfBirthCity);
      }
      // Auto-translate extracted country names to Arabic
      if (finalData.placeOfIssueCountry) {
        finalData.placeOfIssueCountryArabic = countryToArabicMap[finalData.placeOfIssueCountry] || '';
      }
      if (finalData.countryOfBirth) {
        finalData.countryOfBirthArabic = countryToArabicMap[finalData.countryOfBirth] || '';
      }

      // Update form with extracted data
      setFormData(prev => ({
        ...prev,
        ...finalData
      }));

      // Show success animation
      setScanComplete(true);
      
      // Hide success animation after 1.5 seconds
      setTimeout(() => {
        setScanComplete(false);
        setIsScanning(false);
        setScanProgress(0);
        toast.success('Passport data extracted! Please verify and complete remaining fields.');
      }, 1500);
      
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Failed to extract passport data. Please fill manually.');
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const handleFileChange = async (field, base64, fileName) => {
    setDocuments({
      ...documents,
      [field]: { file: base64, fileName, uploadedAt: new Date().toISOString(), status: 'pending' },
    });

    // If passport is uploaded, trigger OCR
    if (field === 'passport' && base64) {
      await extractPassportData(base64);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update employee with documents and basic info
    updateEmployee(currentUser.id, {
      ...formData,
      documents,
      preArrival: {
        ...employee.preArrival,
        documentsUploaded: true,
        documentsUploadedAt: new Date().toISOString(),
      },
      status: 'pending-review',
    });

    // Notify employee
    addNotification(
      currentUser.id,
      'Documents uploaded successfully. Waiting for HR review.',
      'success'
    );

    // Notify HR
    addHRNotification(
      `${employee.name} has uploaded documents for review.`,
      'info',
      currentUser.id
    );

    toast.success('Documents uploaded successfully!');
    setTimeout(() => navigate('/employee/dashboard'), 1000);
  };

  const workflowSteps = [
    { label: 'Upload Documents' },
    { label: 'Update Arrival' },
    { label: 'Medical Test' },
    { label: 'Biometric Submission' },
    { label: 'Residence Visa' },
    { label: 'Sign Contract' },
    { label: 'MOHRE & Visa' },
    { label: 'Upload Stamped Visa' },
  ];

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-neutral-900">Upload Documents</h1>
          <p className="text-sm text-neutral-600">Upload supporting documents and fill basic information</p>
        </div>

        {/* Workflow Stepper */}
        <div className="bg-white border border-neutral-300 rounded-lg px-6 mb-3">
          <WorkflowStepper steps={workflowSteps} currentStep={1} />
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3 pb-3">
        {/* Step 1: Personal Information */}
        <Card title="Step 1: Personal Information" icon={FileText}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Mother's Name (English)"
              name="motherName"
              value={formData.motherName}
              onChange={handleInputChange}
              required
              placeholder="Full name"
            />
            <Input
              label="اسم الأم (Arabic)"
              name="motherNameArabic"
              value={formData.motherNameArabic}
              onChange={handleInputChange}
              dir="rtl"
              labelDir="rtl"
            />
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Religion <span className="text-primary-600">*</span>
              </label>
              <select
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select</option>
                <option value="Islam">Islam</option>
                <option value="Christianity">Christianity</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Input
              label="Faith"
              name="faith"
              value={formData.faith}
              onChange={handleInputChange}
              placeholder="e.g. Sunni, Catholic"
            />
            
            <Input
              label="Languages Known"
              name="languagesKnown"
              value={formData.languagesKnown}
              onChange={handleInputChange}
              placeholder="e.g. English, Arabic, Hindi"
            />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Do you want Dependents visa on hold?
              </label>
              <select
                name="dependentsVisa"
                value={formData.dependentsVisa}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Step 2: Supporting Documents - Upload First */}
        <Card title="Step 2: Supporting Documents" icon={UploadIcon}>
          <div className="space-y-4">
            {/* Passport Copy - Full Width */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Upload Passport First
                  </p>
                  <p className="text-xs text-blue-700">
                    We'll automatically extract your passport details to save you time
                  </p>
                </div>
              </div>
              <FileUpload
                label="Passport Copy"
                accept="image/*,.pdf"
                value={documents.passport?.file}
                onChange={(base64, fileName) => handleFileChange('passport', base64, fileName)}
                required
              />
            </div>

            {/* Other Documents - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                label="Passport Size Photo"
                accept="image/*"
                value={documents.photo?.file}
                onChange={(base64, fileName) => handleFileChange('photo', base64, fileName)}
                required
              />
              <FileUpload
                label="Educational Certificates"
                accept="image/*,.pdf"
                value={documents.certificates?.file}
                onChange={(base64, fileName) => handleFileChange('certificates', base64, fileName)}
                required
              />
              <FileUpload
                label="Previous Employment Letter"
                accept="image/*,.pdf"
                value={documents.employmentLetter?.file}
                onChange={(base64, fileName) => handleFileChange('employmentLetter', base64, fileName)}
              />
              <FileUpload
                label="Other Documents (Optional)"
                accept="image/*,.pdf"
                value={documents.other?.file}
                onChange={(base64, fileName) => handleFileChange('other', base64, fileName)}
              />
            </div>
          </div>
        </Card>

        {/* Passport Scanning Modal Overlay */}
        {isScanning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-fadeIn">
              <div className="text-center">
                {!scanComplete ? (
                  <>
                    {/* Animated Scanner Icon */}
                    <div className="relative mx-auto w-24 h-24 mb-6">
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                      <div className="relative flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
                        <Loader className="animate-spin text-blue-600" size={40} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Scanning Passport
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Please wait while we extract information from your passport...
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-lg font-semibold text-blue-600 mt-3">
                        {scanProgress}% Complete
                      </p>
                    </div>

                    {/* Status Messages with Icons */}
                    <div className="text-sm text-gray-600 space-y-2">
                      {scanProgress < 30 && (
                        <div className="flex items-center justify-center gap-2">
                          <Search className="text-blue-600" size={18} />
                          <p>Reading passport image...</p>
                        </div>
                      )}
                      {scanProgress >= 30 && scanProgress < 60 && (
                        <div className="flex items-center justify-center gap-2">
                          <FileSearch className="text-blue-600" size={18} />
                          <p>Extracting text data...</p>
                        </div>
                      )}
                      {scanProgress >= 60 && scanProgress < 90 && (
                        <div className="flex items-center justify-center gap-2">
                          <Type className="text-blue-600" size={18} />
                          <p>Processing information...</p>
                        </div>
                      )}
                      {scanProgress >= 90 && (
                        <div className="flex items-center justify-center gap-2">
                          <Check className="text-blue-600" size={18} />
                          <p>Almost done...</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Success Animation */}
                    <div className="relative mx-auto w-24 h-24 mb-6">
                      <div className="absolute inset-0 border-4 border-success-200 rounded-full animate-ping"></div>
                      <div className="relative flex items-center justify-center w-24 h-24 bg-success-100 rounded-full animate-fadeIn">
                        <CheckCircle className="text-success-600" size={50} strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Success Title */}
                    <h3 className="text-xl font-bold text-success-600 mb-2">
                      Scan Complete!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Passport information extracted successfully
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Employee Passport and Residency Details */}
        <Card title="Step 3: Employee Passport and Residency Details" icon={FileText}>
          {documents.passport && !isScanning && (
            <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="text-success-600" size={20} />
              <p className="text-sm text-success-800">
                Passport scanned! Please verify the auto-filled data below and complete remaining fields.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Passport Number"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleInputChange}
              required
              placeholder="e.g. A12345678"
            />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Passport Type <span className="text-primary-600">*</span>
              </label>
              <select
                name="passportType"
                value={formData.passportType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">--None--</option>
                <option value="Regular">Regular</option>
                <option value="Diplomatic">Diplomatic</option>
                <option value="Official">Official</option>
                <option value="Service">Service</option>
              </select>
            </div>
            
            <Input
              label="Date of Issue"
              name="dateOfIssue"
              type="date"
              value={formData.dateOfIssue}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Date of Expiry"
              name="dateOfExpiry"
              type="date"
              value={formData.dateOfExpiry}
              onChange={handleInputChange}
              required
            />

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Place of Issue Country <span className="text-primary-600">*</span>
              </label>
              <select
                name="placeOfIssueCountry"
                value={formData.placeOfIssueCountry}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">--None--</option>
                <option value="India">India</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Philippines">Philippines</option>
                <option value="Egypt">Egypt</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Input
              label="Place of Issue Country (Arabic)"
              name="placeOfIssueCountryArabic"
              value={formData.placeOfIssueCountryArabic}
              onChange={handleInputChange}
              dir="rtl"
              labelDir="rtl"
            />

            <Input
              label="Place of Issue City"
              name="placeOfIssueCity"
              value={formData.placeOfIssueCity}
              onChange={handleInputChange}
              required
              placeholder="e.g. Mumbai"
            />
            <Input
              label="Place of Issue City (Arabic)"
              name="placeOfIssueCityArabic"
              value={formData.placeOfIssueCityArabic}
              onChange={handleInputChange}
              dir="rtl"
              labelDir="rtl"
            />

            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
            <div></div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Country of Birth <span className="text-primary-600">*</span>
              </label>
              <select
                name="countryOfBirth"
                value={formData.countryOfBirth}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">--None--</option>
                <option value="India">India</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Philippines">Philippines</option>
                <option value="Egypt">Egypt</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Input
              label="Country of Birth (Arabic)"
              name="countryOfBirthArabic"
              value={formData.countryOfBirthArabic}
              onChange={handleInputChange}
              dir="rtl"
              labelDir="rtl"
            />

            <Input
              label="Place of Birth City"
              name="placeOfBirthCity"
              value={formData.placeOfBirthCity}
              onChange={handleInputChange}
              required
              placeholder="e.g. Delhi"
            />
            <Input
              label="Place of Birth City (Arabic)"
              name="placeOfBirthCityArabic"
              value={formData.placeOfBirthCityArabic}
              onChange={handleInputChange}
              dir="rtl"
              labelDir="rtl"
            />

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Present Nationality <span className="text-primary-600">*</span>
              </label>
              <select
                name="presentNationality"
                value={formData.presentNationality}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">--None--</option>
                <option value="Indian">Indian</option>
                <option value="Pakistani">Pakistani</option>
                <option value="Bangladeshi">Bangladeshi</option>
                <option value="Filipino">Filipino</option>
                <option value="Egyptian">Egyptian</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Previous Nationality
              </label>
              <select
                name="previousNationality"
                value={formData.previousNationality}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">--None--</option>
                <option value="Indian">Indian</option>
                <option value="Pakistani">Pakistani</option>
                <option value="Bangladeshi">Bangladeshi</option>
                <option value="Filipino">Filipino</option>
                <option value="Egyptian">Egyptian</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Step 4: Address Details */}
        <Card title="Step 4: Address Details" icon={FileText}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Current Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Full address"
              />
            </div>
            <Input
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
              required
              placeholder="Full name"
            />
            <Input
              label="Emergency Contact Number"
              name="emergencyContact"
              type="tel"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              required
              placeholder="+971 XX XXX XXXX"
            />
          </div>
        </Card>



            {/* Submit Buttons */}
            <div className="bg-white border border-neutral-300 rounded-lg p-3 flex gap-2 sticky bottom-0">
              <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Documents
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;
