import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const InitiateContract = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, updateEmployee, addNotification } = useData();
  const employee = getEmployee(parseInt(id));

  const [formData, setFormData] = useState({
    contractType: 'limited',
    duration: '2',
    probationPeriod: '6',
    noticePeriod: '30',
    workingHours: '8',
    annualLeave: '30',
    benefits: '',
    additionalTerms: '',
  });

  if (!employee) {
    return <div>Employee not found</div>;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const contractData = {
      ...formData,
      employeeName: employee.name,
      jobTitle: employee.jobTitle,
      department: employee.department,
      salary: employee.salary,
      generatedAt: new Date().toISOString(),
      status: 'pending-signature',
    };

    updateEmployee(employee.id, {
      finalization: {
        ...employee.finalization,
        contractInitiated: true,
        contractData,
        contractInitiatedAt: new Date().toISOString(),
      },
      currentStage: 'finalization',
    });

    // Notify employee
    addNotification(
      employee.id,
      'Your employment contract is ready for review and signature.',
      'info'
    );

    toast.success('Contract sent to employee for signature!');
    setTimeout(() => navigate(`/hr/employee/${employee.id}`), 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Initiate Employment Contract</h1>
            <p className="text-sm text-neutral-600">Generate contract for {employee.name}</p>
          </div>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Employee Details */}
            <div className="bg-white border border-neutral-300 rounded-lg p-3">
              <h2 className="text-sm font-semibold text-neutral-900 mb-2">Employee Details</h2>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-neutral-500">Name</p>
                  <p className="text-xs font-medium text-neutral-900">{employee.name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Job Title</p>
                  <p className="text-xs font-medium text-neutral-900">{employee.jobTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Department</p>
                  <p className="text-xs font-medium text-neutral-900">{employee.department}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Salary</p>
                  <p className="text-xs font-medium text-neutral-900">AED {employee.salary}</p>
                </div>
              </div>
            </div>

            {/* Contract Terms */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Contract Terms</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-700 mb-1 block">
                    Contract Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="contractType"
                    value={formData.contractType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="limited">Limited Contract</option>
                    <option value="unlimited">Unlimited Contract</option>
                  </select>
                </div>
                <Input
                  label="Duration (Years)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="5"
                />
                <Input
                  label="Probation Period (Months)"
                  name="probationPeriod"
                  type="number"
                  value={formData.probationPeriod}
                  onChange={handleInputChange}
                  required
                  min="3"
                  max="6"
                />
                <Input
                  label="Notice Period (Days)"
                  name="noticePeriod"
                  type="number"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  required
                  min="30"
                  max="90"
                />
                <Input
                  label="Working Hours per Day"
                  name="workingHours"
                  type="number"
                  value={formData.workingHours}
                  onChange={handleInputChange}
                  required
                  min="8"
                  max="9"
                />
                <Input
                  label="Annual Leave Days"
                  name="annualLeave"
                  type="number"
                  value={formData.annualLeave}
                  onChange={handleInputChange}
                  required
                  min="22"
                  max="30"
                />
              </div>

              <div className="mt-3">
                <label className="text-xs font-medium text-neutral-700 mb-1 block">
                  Benefits & Allowances
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  placeholder="List all benefits (medical insurance, flight tickets, etc.)"
                  className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="2"
                />
              </div>

              <div className="mt-3">
                <label className="text-xs font-medium text-neutral-700 mb-1 block">
                  Additional Terms & Conditions
                </label>
                <textarea
                  name="additionalTerms"
                  value={formData.additionalTerms}
                  onChange={handleInputChange}
                  placeholder="Any additional terms or special conditions"
                  className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={Send}>
                Generate & Send Contract
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InitiateContract;
