import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileCheck, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const SubmitResidenceVisa = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, updateEmployee, addNotification } = useData();
  const employee = getEmployee(parseInt(id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!employee) {
    return <div>Employee not found</div>;
  }

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      updateEmployee(employee.id, {
        inCountry: {
          ...employee.inCountry,
          residenceVisaSubmitted: true,
          residenceVisaSubmittedAt: new Date().toISOString(),
          residenceVisaStatus: 'processing',
        },
      });

      // Notify employee
      addNotification(
        employee.id,
        'Your Residence Visa and Emirates ID application has been submitted. Processing in progress.',
        'info'
      );

      toast.success('Residence Visa application submitted successfully!');
      setIsSubmitting(false);
      setTimeout(() => navigate('/hr/employees'), 1000);
    }, 2000);
  };

  const documents = [
    { name: 'Passport Copy', status: employee.documents?.passport?.status },
    { name: 'Passport Photo', status: employee.documents?.photo?.status },
    { name: 'Medical Certificate', status: employee.inCountry?.medicalCertificate ? 'completed' : 'pending' },
    { name: 'Biometric Confirmation', status: employee.inCountry?.biometricConfirmed ? 'completed' : 'pending' },
  ];

  const allDocumentsReady = documents.every(doc => 
    doc.status === 'approved' || doc.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1000px] mx-auto p-4">
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Submit Residence Visa Application</h1>
            <p className="text-xs text-neutral-500">
              Review and submit for {employee.name}
            </p>
          </div>
        </div>

      {/* Employee Summary */}
      <Card title="Employee Information">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{employee.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Passport Number</p>
            <p className="font-medium text-gray-900">{employee.passportNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nationality</p>
            <p className="font-medium text-gray-900">{employee.nationality}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Visa Type</p>
            <p className="font-medium text-gray-900">{employee.visaType}</p>
          </div>
        </div>
      </Card>

      {/* Document Checklist */}
      <Card title="Document Checklist" icon={FileCheck}>
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">{doc.name}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                doc.status === 'approved' || doc.status === 'completed'
                  ? 'bg-success-100 text-success-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {doc.status === 'approved' || doc.status === 'completed' ? 'Ready' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Submission Details */}
      <Card title="Submission Details">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-blue-900 mb-2">What will be submitted:</p>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Application for UAE Residence Visa</li>
            <li>Application for Emirates ID</li>
            <li>All supporting documents</li>
            <li>Medical fitness certificate</li>
            <li>Biometric data confirmation</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-900 mb-2">Processing Time:</p>
          <p className="text-sm text-amber-800">
            Typical processing time is 3-5 business days. You will be notified once approved.
          </p>
        </div>
      </Card>

        {/* Action Buttons */}
        <div className="flex gap-2 bg-white border border-neutral-300 rounded p-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={!allDocumentsReady || isSubmitting}
            icon={Send}
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Processing'}
          </Button>
        </div>

        {!allDocumentsReady && (
          <p className="text-xs text-primary-600 mt-2 px-3">
            * All documents must be ready before submission
          </p>
        )}
      </div>
    </div>
  );
};

export default SubmitResidenceVisa;
