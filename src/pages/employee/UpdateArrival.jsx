import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
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
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-neutral-900">Update Arrival in UAE</h1>
          <p className="text-sm text-neutral-600">Confirm your arrival details</p>
        </div>

        {/* Workflow Stepper */}
        <div className="bg-white border border-neutral-300 rounded-lg px-6 mb-3">
          <WorkflowStepper steps={workflowSteps} currentStep={2} />
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Plane className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Arrival Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Arrival Date"
                  name="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={handleInputChange}
                  required
                />
                <div>
                  <label className="text-xs font-medium text-neutral-700 mb-1 block">
                    Port of Entry <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="portOfEntry"
                    value={formData.portOfEntry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
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
            </div>

            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Current Location</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/employee/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm Arrival
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateArrival;
