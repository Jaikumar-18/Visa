import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const DisoPortalInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, updateEmployee } = useData();
  const employee = getEmployee(parseInt(id));

  const [formData, setFormData] = useState({
    companyName: '',
    establishmentCardNumber: '',
    laborContractNumber: '',
    basicSalary: '',
    housingAllowance: '',
    transportAllowance: '',
    otherAllowances: '',
    accommodationType: '',
    accommodationAddress: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '',
  });

  useEffect(() => {
    // Only load data once when component mounts or employee ID changes
    if (employee && employee.id) {
      // Auto-fill from employee data if disoPortalInfo doesn't exist
      if (employee.disoPortalInfo) {
        setFormData(employee.disoPortalInfo);
      } else {
        // Pre-fill with data from CreateEmployee
        setFormData({
          companyName: employee.companyName || '', // Auto-fill from CreateEmployee
          establishmentCardNumber: employee.establishmentCardNumber || '', // Auto-fill from CreateEmployee
          laborContractNumber: employee.laborContractNumber || '', // Auto-fill from CreateEmployee
          basicSalary: employee.salary || '', // Auto-fill from CreateEmployee
          housingAllowance: '',
          transportAllowance: '',
          otherAllowances: '',
          accommodationType: '',
          accommodationAddress: '',
          insuranceProvider: '',
          insurancePolicyNumber: '',
          insuranceExpiryDate: '',
        });
      }
    }
  }, [employee?.id]); // Only run when employee ID changes

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

    updateEmployee(employee.id, {
      disoPortalInfo: formData,
      preArrival: {
        ...employee.preArrival,
        disoInfoCompleted: true,
        disoInfoCompletedAt: new Date().toISOString(),
      },
    });

    toast.success('DISO Portal information saved successfully!');
    setTimeout(() => navigate('/hr/employees'), 1000);
  };

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1200px] mx-auto p-4">
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">DISO Portal Information</h1>
            <p className="text-xs text-neutral-500">
              Fill additional information as per DISO Portal requirements for {employee.name}
            </p>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Details */}
        <Card title="Company Details" icon={Building2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              placeholder="e.g. ABC Technologies LLC"
            />
            <Input
              label="Establishment Card Number"
              name="establishmentCardNumber"
              value={formData.establishmentCardNumber}
              onChange={handleInputChange}
              required
              placeholder="e.g. EST-123456"
            />
            <Input
              label="Labor Contract Number"
              name="laborContractNumber"
              value={formData.laborContractNumber}
              onChange={handleInputChange}
              required
              placeholder="e.g. LC-2025-001"
            />
          </div>
        </Card>

        {/* Salary Breakdown */}
        <Card title="Salary Breakdown" icon={FileText}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Basic Salary (AED)"
              name="basicSalary"
              type="number"
              value={formData.basicSalary}
              onChange={handleInputChange}
              required
              placeholder="e.g. 8000"
            />
            <Input
              label="Housing Allowance (AED)"
              name="housingAllowance"
              type="number"
              value={formData.housingAllowance}
              onChange={handleInputChange}
              required
              placeholder="e.g. 4000"
            />
            <Input
              label="Transport Allowance (AED)"
              name="transportAllowance"
              type="number"
              value={formData.transportAllowance}
              onChange={handleInputChange}
              required
              placeholder="e.g. 2000"
            />
            <Input
              label="Other Allowances (AED)"
              name="otherAllowances"
              type="number"
              value={formData.otherAllowances}
              onChange={handleInputChange}
              placeholder="e.g. 1000"
            />
          </div>
        </Card>

        {/* Accommodation Details */}
        <Card title="Accommodation Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Accommodation Type <span className="text-primary-600">*</span>
              </label>
              <select
                name="accommodationType"
                value={formData.accommodationType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Type</option>
                <option value="company-provided">Company Provided</option>
                <option value="self-arranged">Self Arranged</option>
                <option value="shared">Shared Accommodation</option>
              </select>
            </div>
            <Input
              label="Accommodation Address"
              name="accommodationAddress"
              value={formData.accommodationAddress}
              onChange={handleInputChange}
              required
              placeholder="Full address in UAE"
            />
          </div>
        </Card>

        {/* Insurance Information */}
        <Card title="Insurance Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Insurance Provider"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleInputChange}
              required
              placeholder="e.g. Dubai Insurance"
            />
            <Input
              label="Policy Number"
              name="insurancePolicyNumber"
              value={formData.insurancePolicyNumber}
              onChange={handleInputChange}
              required
              placeholder="e.g. POL-123456"
            />
            <Input
              label="Expiry Date"
              name="insuranceExpiryDate"
              type="date"
              value={formData.insuranceExpiryDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </Card>

        <div className="flex gap-2 bg-white border border-neutral-300 rounded p-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save DISO Information
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default DisoPortalInfo;
