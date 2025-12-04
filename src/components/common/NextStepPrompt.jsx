import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from './Button';

const NextStepPrompt = ({ employee, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getNextStep = () => {
    if (userRole === 'hr') {
      // HR next steps
      if (employee.preArrival?.documentsUploaded && !employee.preArrival?.hrReviewed) {
        return {
          label: 'Review Documents',
          path: `/hr/review/${employee.id}`,
          message: 'Employee has uploaded documents',
        };
      }
      if (employee.inCountry?.arrivalUpdated && !employee.inCountry?.medicalAppointment?.status) {
        return {
          label: 'Book Medical Appointment',
          path: `/hr/book-medical/${employee.id}`,
          message: 'Employee has arrived in UAE',
        };
      }
      if (employee.inCountry?.biometricConfirmed && !employee.inCountry?.residenceVisaSubmitted) {
        return {
          label: 'Submit Residence Visa',
          path: `/hr/submit-visa/${employee.id}`,
          message: 'Ready to submit residence visa',
        };
      }
      if (employee.inCountry?.residenceVisaSubmitted && !employee.finalization?.contractInitiated) {
        return {
          label: 'Create Contract',
          path: `/hr/initiate-contract/${employee.id}`,
          message: 'Visa submitted, create employment contract',
        };
      }
      if (employee.finalization?.contractSigned && !employee.finalization?.mohreSubmitted) {
        return {
          label: 'Submit to MOHRE',
          path: `/hr/mohre-submission/${employee.id}`,
          message: 'Contract signed, submit to MOHRE',
        };
      }
      if (employee.finalization?.mohreApproved && !employee.finalization?.visaReceived) {
        return {
          label: 'Apply for Visa',
          path: `/hr/visa-application/${employee.id}`,
          message: 'MOHRE approved, apply for visa stamping',
        };
      }
    } else {
      // Employee next steps
      if (!employee.preArrival?.documentsUploaded) {
        return {
          label: 'Upload Documents',
          path: '/employee/upload-documents',
          message: 'Upload your documents to continue',
        };
      }
      if (employee.preArrival?.disoInfoCompleted && !employee.preArrival?.entryPermitGenerated) {
        return {
          label: 'Download Entry Permit',
          path: '/employee/entry-permit',
          message: 'Your entry permit is ready',
        };
      }
      if (employee.preArrival?.entryPermitGenerated && !employee.inCountry?.arrivalUpdated) {
        return {
          label: 'Update Arrival',
          path: '/employee/update-arrival',
          message: 'Update your arrival information',
        };
      }
      if (employee.inCountry?.medicalAppointment?.status === 'scheduled' && !employee.inCountry?.medicalCertificate) {
        return {
          label: 'Upload Medical Certificate',
          path: '/employee/medical-certificate',
          message: 'Medical appointment scheduled',
        };
      }
      if (employee.inCountry?.medicalCertificate && !employee.inCountry?.biometricConfirmed) {
        return {
          label: 'Confirm Biometric',
          path: '/employee/biometric-confirmation',
          message: 'Confirm your biometric submission',
        };
      }
      if (employee.finalization?.contractInitiated && !employee.finalization?.contractSigned) {
        return {
          label: 'Sign Contract',
          path: '/employee/sign-contract',
          message: 'Your contract is ready for signature',
        };
      }
      if (employee.finalization?.visaReceived && !employee.finalization?.stampedVisaUploaded) {
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
