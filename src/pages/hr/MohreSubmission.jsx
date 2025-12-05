import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileCheck, Send, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const MohreSubmission = () => {
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
      await workflow.submitMOHRE(employee.id);

      await addNotification(
        employee.id,
        'Your contract has been approved by MOHRE. Visa application will proceed.',
        'success'
      );

      toast.success('MOHRE submission successful!');
      setTimeout(() => navigate(`/hr/visa-application/${employee.id}`), 1500);
    } catch (error) {
      console.error('Failed to submit to MOHRE:', error);
      toast.error(error.response?.data?.message || 'Failed to submit to MOHRE');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">MOHRE Submission</h1>
            <p className="text-sm text-neutral-600">
              Submit employment contract to Ministry of Human Resources & Emiratisation
            </p>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {/* Employee Info */}
          <div className="bg-white border border-neutral-300 rounded-lg p-3">
            <h2 className="text-sm font-semibold text-neutral-900 mb-2">Employee Information</h2>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-neutral-500">Name</p>
                <p className="text-xs font-medium text-neutral-900">{employee.first_name} {employee.last_name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Job Title</p>
                <p className="text-xs font-medium text-neutral-900">{employee.job_title}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Salary</p>
                <p className="text-xs font-medium text-neutral-900">AED {employee.salary}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Contract Status</p>
                <p className="text-xs font-medium text-green-600">Signed</p>
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="bg-white border border-neutral-300 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="w-5 h-5 text-neutral-700" />
              <h2 className="text-sm font-semibold text-neutral-900">Contract Summary</h2>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-xs text-neutral-600">Contract Status:</span>
                <span className="text-xs font-medium text-green-600">
                  {employee.contract_signed ? 'Signed' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-neutral-600">Job Title:</span>
                <span className="text-xs font-medium text-neutral-900">
                  {employee.job_title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-neutral-600">Salary:</span>
                <span className="text-xs font-medium text-neutral-900">
                  AED {employee.salary}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Info */}
          <div className="bg-white border border-neutral-300 rounded-lg p-3">
            <h2 className="text-sm font-semibold text-neutral-900 mb-2">MOHRE Submission</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-blue-900 mb-1.5">What will be submitted:</p>
              <ul className="list-disc list-inside text-xs text-blue-800 space-y-0.5">
                <li>Signed employment contract</li>
                <li>Employee passport copy</li>
                <li>Company establishment card</li>
                <li>Labor contract details</li>
                <li>Salary breakdown</li>
              </ul>
            </div>

            {employee.mohre_approved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <p className="text-xs font-medium text-green-900">MOHRE Approved!</p>
                    <p className="text-xs text-green-700">Contract approved by MOHRE</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')}>
            Cancel
          </Button>
          {!employee.mohre_submitted && (
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              icon={Send}
            >
              {isSubmitting ? 'Submitting...' : 'Submit to MOHRE'}
            </Button>
          )}
          {employee.mohre_approved && (
            <Button
              type="button"
              variant="success"
              onClick={() => navigate(`/hr/visa-application/${employee.id}`)}
              icon={CheckCircle}
            >
              Proceed to Visa Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MohreSubmission;
