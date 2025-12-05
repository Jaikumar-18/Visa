import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileCheck, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const SubmitResidenceVisa = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, workflow, addNotification } = useData();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await getEmployee(parseInt(id));
        setEmployee(data);
      } catch (error) {
        console.error('Failed to load employee:', error);
        toast.error('Failed to load employee data');
      } finally {
        setIsLoading(false);
      }
    };
    loadEmployee();
  }, [id, getEmployee]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-sm text-neutral-900 font-medium">Employee not found</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await workflow.submitResidenceVisa(employee.id);

      // Notify employee
      await addNotification(
        employee.id,
        'Your Residence Visa and Emirates ID application has been submitted. Processing in progress.',
        'info'
      );

      toast.success('Residence Visa application submitted successfully!');
      setTimeout(() => navigate('/hr/employees'), 1500);
    } catch (error) {
      console.error('Failed to submit visa:', error);
      toast.error(error.response?.data?.message || 'Failed to submit residence visa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const documents = [
    { name: 'Passport Copy', status: employee.documents_uploaded ? 'completed' : 'pending' },
    { name: 'Passport Photo', status: employee.documents_uploaded ? 'completed' : 'pending' },
    { name: 'Medical Certificate', status: employee.medical_certificate_uploaded ? 'completed' : 'pending' },
    { name: 'Biometric Confirmation', status: employee.biometric_confirmed ? 'completed' : 'pending' },
  ];

  const allDocumentsReady = documents.every(doc => doc.status === 'completed');

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Submit Residence Visa Application</h1>
            <p className="text-sm text-neutral-600">
              Review and submit for {employee.name}
            </p>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {/* Employee Summary */}
          <div className="bg-white border border-neutral-300 rounded-lg p-3">
            <h2 className="text-sm font-semibold text-neutral-900 mb-2">Employee Information</h2>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-neutral-500">Name</p>
                <p className="text-xs font-medium text-neutral-900">{employee.first_name} {employee.last_name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Passport Number</p>
                <p className="text-xs font-medium text-neutral-900">{employee.passport_number}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Nationality</p>
                <p className="text-xs font-medium text-neutral-900">{employee.present_nationality}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Visa Type</p>
                <p className="text-xs font-medium text-neutral-900">{employee.visa_type}</p>
              </div>
            </div>
          </div>

          {/* Document Checklist */}
          <div className="bg-white border border-neutral-300 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="w-5 h-5 text-neutral-700" />
              <h2 className="text-sm font-semibold text-neutral-900">Document Checklist</h2>
            </div>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                  <span className="text-xs text-neutral-900">{doc.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === 'approved' || doc.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {doc.status === 'approved' || doc.status === 'completed' ? 'Ready' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white border border-neutral-300 rounded-lg p-3">
            <h2 className="text-sm font-semibold text-neutral-900 mb-2">Submission Details</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-blue-900 mb-1.5">What will be submitted:</p>
              <ul className="list-disc list-inside text-xs text-blue-800 space-y-0.5">
                <li>Application for UAE Residence Visa</li>
                <li>Application for Emirates ID</li>
                <li>All supporting documents</li>
                <li>Medical fitness certificate</li>
                <li>Biometric data confirmation</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-900 mb-1">Processing Time:</p>
              <p className="text-xs text-amber-800">
                Typical processing time is 3-5 business days. You will be notified once approved.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
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
          <p className="text-xs text-red-600">
            * All documents must be ready before submission
          </p>
        )}
      </div>
    </div>
  );
};

export default SubmitResidenceVisa;
