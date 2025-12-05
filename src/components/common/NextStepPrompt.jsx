import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from './Button';

const NextStepPrompt = ({ employee, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getNextStep = () => {
    if (userRole === 'hr') {
      // HR next steps (using flattened fields)
      if (employee.documents_uploaded && !employee.hr_reviewed) {
        return {
          label: 'Review Documents',
          path: `/hr/review/${employee.id}`,
          message: 'Employee has uploaded documents',
        };
      }
      if (employee.hr_reviewed && !employee.diso_info_completed) {
        return {
          label: 'Fill DISO Info',
          path: `/hr/diso-info/${employee.id}`,
          message: 'Complete DISO portal information',
        };
      }
      if (employee.arrival_updated && !employee.medical_appointment_scheduled) {
        return {
          label: 'Book Medical Appointment',
          path: `/hr/book-medical/${employee.id}`,
          message: 'Employee has arrived in UAE',
        };
      }
      if (employee.biometric_confirmed && !employee.residence_visa_submitted) {
        return {
          label: 'Submit Residence Visa',
          path: `/hr/submit-visa/${employee.id}`,
          message: 'Ready to submit residence visa',
        };
      }
      if (employee.residence_visa_submitted && !employee.contract_initiated) {
        return {
          label: 'Create Contract',
          path: `/hr/initiate-contract/${employee.id}`,
          message: 'Visa submitted, create employment contract',
        };
      }
      if (employee.contract_signed && !employee.mohre_submitted) {
        return {
          label: 'Submit to MOHRE',
          path: `/hr/mohre-submission/${employee.id}`,
          message: 'Contract signed, submit to MOHRE',
        };
      }
      if (employee.mohre_approved && !employee.visa_received) {
        return {
          label: 'Apply for Visa',
          path: `/hr/visa-application/${employee.id}`,
          message: 'MOHRE approved, apply for visa stamping',
        };
      }
    } else {
      // Employee next steps (using flattened fields)
      if (!employee.documents_uploaded) {
        return {
          label: 'Upload Documents',
          path: '/employee/upload-documents',
          message: 'Upload your documents to continue',
        };
      }
      if (employee.diso_info_completed && !employee.entry_permit_generated) {
        return {
          label: 'Download Entry Permit',
          path: '/employee/entry-permit',
          message: 'Your entry permit is ready',
        };
      }
      if (employee.entry_permit_generated && !employee.arrival_updated) {
        return {
          label: 'Update Arrival',
          path: '/employee/update-arrival',
          message: 'Update your arrival information',
        };
      }
      if (employee.medical_appointment_scheduled && !employee.medical_certificate_uploaded) {
        return {
          label: 'Upload Medical Certificate',
          path: '/employee/medical-certificate',
          message: 'Medical appointment scheduled',
        };
      }
      if (employee.medical_certificate_uploaded && !employee.biometric_confirmed) {
        return {
          label: 'Confirm Biometric',
          path: '/employee/biometric-confirmation',
          message: 'Confirm your biometric submission',
        };
      }
      if (employee.contract_initiated && !employee.contract_signed) {
        return {
          label: 'Sign Contract',
          path: '/employee/sign-contract',
          message: 'Your contract is ready for signature',
        };
      }
      if (employee.visa_received && !employee.stamped_visa_uploaded) {
        return {
          label: 'Upload Stamped Visa',
          path: '/employee/upload-stamped-visa',
          message: 'Your visa is ready! Upload stamped page',
        };
      }
    }
    return null;
  };

  const nextStep = getNextStep();

  // Don't show if no next step or if already on the next step page
  if (!nextStep || location.pathname === nextStep.path) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border-2 border-primary-600 p-4 max-w-sm z-50">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-medium text-gray-900 mb-1">Next Step</p>
          <p className="text-sm text-gray-600 mb-3">{nextStep.message}</p>
          <Button
            variant="primary"
            onClick={() => navigate(nextStep.path)}
            icon={ArrowRight}
            className="w-full"
          >
            {nextStep.label}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NextStepPrompt;
