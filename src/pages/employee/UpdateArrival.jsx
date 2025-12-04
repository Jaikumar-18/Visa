import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import WorkflowStepper from '../../components/common/WorkflowStepper';
import toast from 'react-hot-toast';

const UpdateArrival = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, updateEmployee, addHRNotification } = useData();
  const employee = getEmployee(currentUser.id);

  const [formData, setFormData] = useState({
    arrivalDate: '',
    portOfEntry: '',
    flightNumber: '',
    currentLocation: '',
    hotelName: '',
    contactNumberUAE: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateEmployee(currentUser.id, {
      inCountry: {
        ...employee.inCountry,
        arrivalUpdated: true,
        arrivalDate: formData.arrivalDate,
        arrivalDetails: formData,
        arrivalUpdatedAt: new Date().toISOString(),
      },
      currentStage: 'in-country',
      status: 'arrived',
    });

    // Notify HR
    addHRNotification(
      `${employee.name} (${employee.jobTitle}) has arrived in UAE on ${formData.arrivalDate}. Medical appointment needs to be scheduled.`,
      'info',
      currentUser.id
    );

    toast.success('Arrival information updated successfully!');
    setTimeout(() => navigate('/employee/dashboard'), 1000);
  };

  const workflowSteps = [
    { label: 'Upload Documents' },
    { label: 'Update Arrival' },
    { label: 'Medical Test' },
    { label: 'Biometric Submission' },
    { label: 'Residence Visa' },
    { label: 'Sign Contract' },
    { label: 'MOHRE & Visa' },
    { label: 'Upload Stamped Visa' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Update Arrival in UAE</h1>
        <p className="text-gray-600 mt-1">Confirm your arrival details</p>
      </div>

      <WorkflowStepper steps={workflowSteps} currentStep={2} />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Card title="Arrival Information" icon={Plane}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Arrival Date"
              name="arrivalDate"
              type="date"
              value={formData.arrivalDate}
              onChange={handleInputChange}
              required
            />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Port of Entry <span className="text-primary-600">*</span>
              </label>
              <select
                name="portOfEntry"
                value={formData.portOfEntry}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Port</option>
                <option value="Dubai International Airport">Dubai International Airport</option>
                <option value="Abu Dhabi International Airport">Abu Dhabi International Airport</option>
                <option value="Sharjah International Airport">Sharjah International Airport</option>
                <option value="Al Maktoum International Airport">Al Maktoum International Airport</option>
              </select>
            </div>
            <Input
              label="Flight Number"
              name="flightNumber"
              value={formData.flightNumber}
              onChange={handleInputChange}
              required
              placeholder="e.g. EK524"
            />
            <Input
              label="Contact Number in UAE"
              name="contactNumberUAE"
              type="tel"
              value={formData.contactNumberUAE}
              onChange={handleInputChange}
              required
              placeholder="+971 XX XXX XXXX"
            />
          </div>
        </Card>

        <Card title="Current Location" icon={MapPin}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Current Location/Area"
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleInputChange}
              required
              placeholder="e.g. Dubai Marina"
            />
            <Input
              label="Hotel/Accommodation Name"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleInputChange}
              required
              placeholder="e.g. Marriott Hotel"
            />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Confirm Arrival
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateArrival;
