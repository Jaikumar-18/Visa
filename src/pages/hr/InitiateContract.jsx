import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
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
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1200px] mx-auto p-4">
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Initiate Employment Contract</h1>
            <p className="text-xs text-neutral-500">Generate contract for {employee.name}</p>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Details */}
        <Card title="Employee Details">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{employee.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="font-medium text-gray-900">{employee.jobTitle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium text-gray-900">{employee.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium text-gray-900">AED {employee.salary}</p>
            </div>
          </div>
        </Card>

        {/* Contract Terms */}
        <Card title="Contract Terms" icon={FileText}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Contract Type <span className="text-primary-600">*</span>
              </label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Benefits & Allowances
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleInputChange}
              placeholder="List all benefits (medical insurance, flight tickets, etc.)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Additional Terms & Conditions
            </label>
            <textarea
              name="additionalTerms"
              value={formData.additionalTerms}
              onChange={handleInputChange}
              placeholder="Any additional terms or special conditions"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="4"
            />
          </div>
        </Card>

        <div className="flex gap-2 bg-white border border-neutral-300 rounded p-3">
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
  );
};

export default InitiateContract;
