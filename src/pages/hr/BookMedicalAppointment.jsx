import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { MEDICAL_CENTERS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const BookMedicalAppointment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, updateEmployee, addNotification } = useData();
  const employee = getEmployee(parseInt(id));

  const [formData, setFormData] = useState({
    medicalCenter: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
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

    const selectedCenter = MEDICAL_CENTERS.find(c => c.id === parseInt(formData.medicalCenter));

    updateEmployee(employee.id, {
      inCountry: {
        ...employee.inCountry,
        medicalAppointment: {
          center: selectedCenter.name,
          location: selectedCenter.location,
          date: formData.appointmentDate,
          time: formData.appointmentTime,
          notes: formData.notes,
          status: 'scheduled',
          bookedAt: new Date().toISOString(),
        },
      },
    });

    // Notify employee
    addNotification(
      employee.id,
      `Medical appointment scheduled at ${selectedCenter.name} on ${formData.appointmentDate} at ${formData.appointmentTime}`,
      'info'
    );

    toast.success('Medical appointment booked successfully!');
    setTimeout(() => navigate('/hr/employees'), 1000);
  };

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1000px] mx-auto p-4">
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Book Medical Appointment</h1>
            <p className="text-xs text-neutral-500">Schedule medical examination for {employee.name}</p>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Appointment Details" icon={Calendar}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Medical Center <span className="text-primary-600">*</span>
              </label>
              <select
                name="medicalCenter"
                value={formData.medicalCenter}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Medical Center</option>
                {MEDICAL_CENTERS.map(center => (
                  <option key={center.id} value={center.id}>
                    {center.name} - {center.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Appointment Date"
                name="appointmentDate"
                type="date"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
              <Input
                label="Appointment Time"
                name="appointmentTime"
                type="time"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Notes/Instructions
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any special instructions for the employee..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="4"
              />
            </div>
          </div>
        </Card>

        <Card title="Required Documents">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Employee should bring the following:
            </p>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Original Passport</li>
              <li>Entry Permit</li>
              <li>2 Passport size photographs</li>
              <li>Previous medical reports (if any)</li>
            </ul>
          </div>
        </Card>

        <div className="flex gap-2 bg-white border border-neutral-300 rounded p-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Book Appointment
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default BookMedicalAppointment;
