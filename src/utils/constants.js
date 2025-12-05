export const VISA_TYPES = [
  'Employment Visa',
  'Investor Visa',
  'Golden Visa',
  'Mission Visa',
  'Student Visa',
];

export const DEPARTMENTS = [
  'IT',
  'Finance',
  'HR',
  'Operations',
  'Sales',
  'Marketing',
  'Engineering',
];

export const MEDICAL_CENTERS = [
  { 
    id: 1, 
    name: 'Ahalia Hospital Mussafah', 
    location: 'Musaffah, Abu Dhabi',
    address: 'Ahalia Hospital Mussafah, Musaffah, 2419 Abu Dhabi',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ahalia+Hospital+Mussafah+Abu+Dhabi'
  },
  { 
    id: 2, 
    name: 'Burjeel Medical City', 
    location: 'Mohamed Bin Zayed City, Abu Dhabi',
    address: 'Burjeel Medical City, 28th St - Mohamed Bin Zayed City - Abu Dhabi, Abu Dhabi 92510',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Burjeel+Medical+City+Abu+Dhabi'
  },
  { 
    id: 3, 
    name: 'Heart Beat Medical Center', 
    location: 'Mushrif Area, Abu Dhabi',
    address: 'Heart Beat Medical Center & One Day Surgery, Plot 103, Mushrif Area - Sheikh Rashid Bin Saeed St, Abu Dhabi 31757',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Heart+Beat+Medical+Center+Abu+Dhabi'
  },
  { 
    id: 4, 
    name: 'NMC Clinic', 
    location: 'Electra Street, Abu Dhabi',
    address: 'NMC Clinic, Electra Street, Abu Dhabi',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=NMC+Clinic+Electra+Street+Abu+Dhabi'
  },
];

export const STAGES = {
  PRE_ARRIVAL: 'pre-arrival',
  IN_COUNTRY: 'in-country',
  FINALIZATION: 'finalization',
  COMPLETED: 'completed',
};

export const DOCUMENT_TYPES = {
  PASSPORT: 'passport',
  PHOTO: 'photo',
  CERTIFICATES: 'certificates',
  EMPLOYMENT_LETTER: 'employmentLetter',
  MEDICAL_CERTIFICATE: 'medicalCertificate',
  BIOMETRIC_RECEIPT: 'biometricReceipt',
  STAMPED_VISA: 'stampedVisa',
};
