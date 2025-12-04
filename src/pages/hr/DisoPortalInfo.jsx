import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
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
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">DISO Portal Information</h1>
            <p className="text-sm text-neutral-600">
              Fill additional information as per DISO Portal requirements for {employee.name}
            </p>
          </div>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Company Details */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Company Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Salary Breakdown */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Salary Breakdown</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Accommodation Details */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">Accommodation Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-700 mb-1 block">
                    Accommodation Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="accommodationType"
                    value={formData.accommodationType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
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
            </div>

            {/* Insurance Information */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">Insurance Information</h2>
              <div className="grid grid-cols-3 gap-3">
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
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
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
    </div>
  );
};

export default DisoPortalInfo;
