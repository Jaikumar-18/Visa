import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useState, useEffect } from 'react';

const EmployeeList = () => {
  const navigate = useNavigate();
  const { employees, refreshEmployees } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  // Auto-refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshEmployees();
    }, 3000);

    return () => clearInterval(interval);
  }, [refreshEmployees]);

  const filteredEmployees = employees
    .filter(emp => {
      // Search filter
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Stage filter
      const matchesStage = stageFilter === 'all' || emp.currentStage === stageFilter;
      
      // Action filter
      let matchesAction = true;
      if (actionFilter === 'needs-review') {
        matchesAction = emp.preArrival?.documentsUploaded && !emp.preArrival?.hrReviewed;
      } else if (actionFilter === 'needs-diso') {
        matchesAction = emp.preArrival?.hrReviewed && !emp.preArrival?.disoInfoCompleted;
      } else if (actionFilter === 'needs-medical') {
        matchesAction = emp.inCountry?.arrivalUpdated && !emp.inCountry?.medicalAppointment?.status;
      } else if (actionFilter === 'waiting-employee') {
        // Exclude completed employees from waiting list
        const isCompleted = emp.currentStage === 'completed' && emp.finalization?.stampedVisaUploaded;
        matchesAction = !isCompleted && (
          !emp.preArrival?.documentsUploaded || 
          (emp.preArrival?.disoInfoCompleted && !emp.inCountry?.arrivalUpdated) ||
          (emp.inCountry?.medicalAppointment?.status && !emp.inCountry?.medicalCertificateUploaded) ||
          (emp.inCountry?.medicalCertificateUploaded && !emp.inCountry?.biometricConfirmed) ||
          (emp.finalization?.contractInitiated && !emp.finalization?.contractSigned) ||
          (emp.finalization?.visaReceived && !emp.finalization?.stampedVisaUploaded)
        );
      } else if (actionFilter === 'completed') {
        matchesAction = emp.currentStage === 'completed' && emp.finalization?.stampedVisaUploaded;
      }
      
      return matchesSearch && matchesStage && matchesAction;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

  const getStageColor = (stage) => {
    const colors = {
      'pre-arrival': 'bg-amber-100 text-amber-700',
      'in-country': 'bg-blue-100 text-blue-700',
      'finalization': 'bg-purple-100 text-purple-700',
      'completed': 'bg-success-100 text-success-700',
    };
    return colors[stage] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1400px] mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">All Employees</h1>
            <p className="text-xs text-neutral-500">Manage all employee visa applications</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-neutral-300 rounded overflow-hidden">
          <div className="p-3 border-b border-neutral-300">
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search Bar - Smaller */}
              <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Stage Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-neutral-600 whitespace-nowrap">Stage:</label>
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                >
                  <option value="all">All Stages</option>
                  <option value="pre-arrival">Pre Arrival</option>
                  <option value="in-country">In Country</option>
                  <option value="finalization">Finalization</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Action Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-neutral-600 whitespace-nowrap">Action:</label>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                >
                  <option value="all">All Actions</option>
                  <option value="needs-review">Needs Review</option>
                  <option value="needs-diso">Needs DISO</option>
                  <option value="needs-medical">Needs Medical</option>
                  <option value="waiting-employee">Waiting Employee</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="ml-auto text-xs text-neutral-500">
                {filteredEmployees.length} of {employees.length} employees
              </div>
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-neutral-400 mb-3" size={40} />
              <p className="text-sm text-neutral-600">No employees found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-100 border-b border-neutral-300">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Email</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Job Title</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Visa Type</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Stage</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Password</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide min-w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-neutral-50">
                      <td className="px-3 py-2.5">
                        <button
                          onClick={() => navigate(`/hr/employee/${employee.id}`)}
                          className="text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline"
                        >
                          {employee.name}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-neutral-600">{employee.email}</td>
                      <td className="px-3 py-2.5 text-xs text-neutral-600">{employee.jobTitle}</td>
                      <td className="px-3 py-2.5 text-xs text-neutral-600">{employee.visaType}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                          employee.currentStage === 'completed' 
                            ? 'bg-success-600 text-white' 
                            : employee.currentStage === 'in-country'
                            ? 'bg-neutral-600 text-white'
                            : 'bg-neutral-400 text-white'
                        }`}>
                          {employee.currentStage === 'pre-arrival' ? 'PRE ARRIVAL' : 
                           employee.currentStage === 'in-country' ? 'IN COUNTRY' : 'COMPLETED'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <code className="px-2 py-0.5 bg-neutral-100 text-xs text-neutral-800 rounded border border-neutral-300">{employee.password}</code>
                      </td>
                      <td className="px-3 py-2.5 min-w-[180px]">
                        <div className="flex gap-1.5 flex-wrap items-center">
                          {/* Review Documents */}
                          {employee.preArrival?.documentsUploaded && !employee.preArrival?.hrReviewed && (
                            <Button
                              variant="primary"
                              onClick={() => navigate(`/hr/review/${employee.id}`)}
                              icon={Eye}
                            >
                              Review
                            </Button>
                          )}
                          
                          {/* DISO Info */}
                          {employee.preArrival?.hrReviewed && !employee.preArrival?.disoInfoCompleted && (
                            <Button
                              variant="primary"
                              onClick={() => navigate(`/hr/diso-info/${employee.id}`)}
                            >
                              DISO
                            </Button>
                          )}
                          
                          {/* Book Medical */}
                          {employee.inCountry?.arrivalUpdated && !employee.inCountry?.medicalAppointment?.status && (
                            <Button
                              variant="primary"
                              onClick={() => navigate(`/hr/book-medical/${employee.id}`)}
                            >
                              Medical
                            </Button>
                          )}
                          
                          {/* Submit Visa */}
                          {employee.inCountry?.biometricConfirmed && !employee.inCountry?.residenceVisaSubmitted && (
                            <Button
                              variant="primary"
                              onClick={() => navigate(`/hr/submit-visa/${employee.id}`)}
                            >
                              Submit Visa
                            </Button>
                          )}
                          
                          {/* Initiate Contract */}
                          {employee.inCountry?.residenceVisaSubmitted && !employee.finalization?.contractInitiated && (
                            <Button
                              variant="primary"
                              onClick={() => navigate(`/hr/initiate-contract/${employee.id}`)}
                            >
                              Contract
                            </Button>
                          )}
                          
                          {/* Submit to MOHRE */}
                          {employee.finalization?.contractSigned && !employee.finalization?.mohreSubmitted && (
                            <Button
                              variant="primary"
                              onClick={() => navigate(`/hr/mohre-submission/${employee.id}`)}
                            >
                              MOHRE
                            </Button>
                          )}
                          
                          {/* Apply for Visa */}
                          {employee.finalization?.mohreApproved && !employee.finalization?.visaReceived && (
                            <Button
                              variant="primary"
                              onClick={() => navigate(`/hr/visa-application/${employee.id}`)}
                            >
                              Apply Visa
                            </Button>
                          )}
                          
                          {/* Waiting states - Show only ONE status at a time */}
                          {/* Check in reverse order (most complete first) to avoid overlaps */}
                          
                          {/* Completed */}
                          {employee.currentStage === 'completed' && employee.finalization?.stampedVisaUploaded ? (
                            <span className="inline-block text-xs text-success-600 font-semibold whitespace-nowrap">✓ Completed</span>
                          ) : 
                          /* After visa received, waiting for stamped visa upload */
                          employee.finalization?.visaReceived && !employee.finalization?.stampedVisaUploaded ? (
                            <span className="inline-block text-xs text-success-600 whitespace-nowrap">Waiting for stamped visa upload...</span>
                          ) : 
                          /* After MOHRE submitted, waiting for approval */
                          employee.finalization?.mohreSubmitted && !employee.finalization?.mohreApproved ? (
                            <span className="inline-block text-xs text-purple-600 whitespace-nowrap">Waiting for MOHRE approval...</span>
                          ) : 
                          /* After contract initiated, waiting for signature */
                          employee.finalization?.contractInitiated && !employee.finalization?.contractSigned ? (
                            <span className="inline-block text-xs text-amber-600 whitespace-nowrap">Waiting for contract signature...</span>
                          ) : 
                          /* After medical uploaded, waiting for biometric */
                          employee.inCountry?.medicalCertificateUploaded && !employee.inCountry?.biometricConfirmed ? (
                            <span className="inline-block text-xs text-blue-600 whitespace-nowrap">Waiting for biometric confirmation...</span>
                          ) : 
                          /* After medical booked, waiting for certificate */
                          employee.inCountry?.medicalAppointment?.status && !employee.inCountry?.medicalCertificateUploaded ? (
                            <span className="inline-block text-xs text-blue-600 whitespace-nowrap">Waiting for medical certificate...</span>
                          ) : 
                          /* After DISO completed, waiting for arrival */
                          employee.preArrival?.disoInfoCompleted && !employee.inCountry?.arrivalUpdated ? (
                            <span className="inline-block text-xs text-blue-600 whitespace-nowrap">Waiting for arrival update...</span>
                          ) : 
                          /* Waiting for documents */
                          !employee.preArrival?.documentsUploaded ? (
                            <span className="inline-block text-xs text-neutral-500 whitespace-nowrap">Waiting for documents...</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
