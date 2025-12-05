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
  const { getEmployee, workflow } = useData();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const loadEmployee = async () => {
      try {
        const data = await getEmployee(parseInt(id));
        setEmployee(data);
        
        // Pre-fill with data from employee
        setFormData({
          companyName: data.company_name || '',
          establishmentCardNumber: data.establishment_card_number || '',
          laborContractNumber: data.labor_contract_number || '',
          basicSalary: data.salary || '',
          housingAllowance: '',
          transportAllowance: '',
          otherAllowances: '',
          accommodationType: '',
          accommodationAddress: '',
          insuranceProvider: '',
          insurancePolicyNumber: '',
          insuranceExpiryDate: '',
        });
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Debug: Check token and user info
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('Token exists:', !!token);
      console.log('User data:', user ? JSON.parse(user) : null);
      
      await workflow.submitDISO(employee.id, {
        companyName: formData.companyName,
        establishmentCardNumber: formData.establishmentCardNumber,
        laborContractNumber: formData.laborContractNumber,
        basicSalary: formData.basicSalary,
        housingAllowance: formData.housingAllowance,
        transportAllowance: formData.transportAllowance,
        otherAllowances: formData.otherAllowances,
        accommodationType: formData.accommodationType,
        accommodationAddress: formData.accommodationAddress,
        insuranceProvider: formData.insuranceProvider,
        insurancePolicyNumber: formData.insurancePolicyNumber,
        insuranceExpiryDate: formData.insuranceExpiryDate,
      });

      toast.success('DISO Portal information saved successfully!');
      setTimeout(() => navigate('/hr/employees'), 1500);
    } catch (error) {
      console.error('Failed to save DISO info:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.response?.data?.message);
      toast.error(error.response?.data?.message || 'Failed to save DISO information');
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
            <h1 className="text-2xl font-semibold text-neutral-900">DISO Portal Information</h1>
            <p className="text-sm text-neutral-600">
              Fill additional information as per DISO Portal requirements for {employee.first_name} {employee.last_name}
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
              <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save DISO Information'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisoPortalInfo;
