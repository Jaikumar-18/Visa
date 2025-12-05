import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { MEDICAL_CENTERS } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const BookMedicalAppointment = () => {
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

  const [formData, setFormData] = useState({
    medicalCenter: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
  });

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
      const selectedCenter = MEDICAL_CENTERS.find(c => c.id === parseInt(formData.medicalCenter));

      await workflow.bookMedical(employee.id, {
        center: selectedCenter.name,
        location: selectedCenter.location,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        notes: formData.notes,
      });

      // Notify employee
      await addNotification(
        employee.id,
        `Medical appointment scheduled at ${selectedCenter.name} on ${formData.appointmentDate} at ${formData.appointmentTime}`,
        'info'
      );

      toast.success('Medical appointment booked successfully!');
      setTimeout(() => navigate('/hr/employees'), 1500);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
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
            <h1 className="text-2xl font-semibold text-neutral-900">Book Medical Appointment</h1>
            <p className="text-sm text-neutral-600">Schedule medical examination for {employee.first_name} {employee.last_name}</p>
          </div>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Appointment Details */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-neutral-700" />
                <h2 className="text-sm font-semibold text-neutral-900">Appointment Details</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-neutral-700 mb-1 block">
                    Medical Center <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="medicalCenter"
                    value={formData.medicalCenter}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="">Select Medical Center</option>
                    {MEDICAL_CENTERS.map(center => (
                      <option key={center.id} value={center.id}>
                        {center.name} - {center.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                  <label className="text-xs font-medium text-neutral-700 mb-1 block">
                    Notes/Instructions
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any special instructions for the employee..."
                    className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white border border-neutral-300 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">Required Documents</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-900 mb-2">
                  Employee should bring the following:
                </p>
                <ul className="list-disc list-inside text-xs text-blue-800 space-y-1">
                  <li>Original Passport</li>
                  <li>Entry Permit</li>
                  <li>2 Passport size photographs</li>
                  <li>Previous medical reports (if any)</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookMedicalAppointment;
