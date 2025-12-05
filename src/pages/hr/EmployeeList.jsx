import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

const EmployeeList = () => {
  const navigate = useNavigate();
  const { employees, refreshEmployees } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Force refresh on mount
  useEffect(() => {
    console.log('EmployeeList mounted - forcing refresh');
    refreshEmployees();
  }, []);

  // Log employees when they change
  useEffect(() => {
    console.log('EmployeeList: Total employees loaded:', employees.length);
    const needsReview = employees.filter(e => e.documents_uploaded && !e.hr_reviewed);
    console.log('EmployeeList: Employees needing review:', needsReview.length);
    if (needsReview.length > 0) {
      console.log('EmployeeList: Employees needing review:', needsReview.map(e => ({
        id: e.id,
        name: `${e.first_name} ${e.last_name}`,
        status: e.status
      })));
    }
  }, [employees]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshEmployees();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshEmployees]);

  // Reload data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshEmployees();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshEmployees]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stageFilter, actionFilter]);

  const filteredEmployees = employees
    .filter(emp => {
      // Build full name from database fields
      const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
      const email = (emp.email || '').toLowerCase();
      const jobTitle = (emp.job_title || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      // Search filter
      const matchesSearch = fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        jobTitle.includes(searchLower);
      
      // Stage filter
      const matchesStage = stageFilter === 'all' || emp.current_stage === stageFilter;
      
      // Action filter
      let matchesAction = true;
      if (actionFilter === 'needs-review') {
        matchesAction = emp.documents_uploaded && !emp.hr_reviewed;
      } else if (actionFilter === 'needs-diso') {
        matchesAction = emp.hr_reviewed && !emp.diso_info_completed;
      } else if (actionFilter === 'needs-medical') {
        matchesAction = emp.arrival_updated && !emp.medical_certificate_uploaded;
      } else if (actionFilter === 'waiting-employee') {
        // Exclude completed employees from waiting list
        const isCompleted = emp.current_stage === 'completed' && emp.stamped_visa_uploaded;
        matchesAction = !isCompleted && (
          !emp.documents_uploaded || 
          (emp.diso_info_completed && !emp.arrival_updated) ||
          (emp.medical_certificate_uploaded && !emp.biometric_confirmed) ||
          (emp.contract_initiated && !emp.contract_signed) ||
          (emp.visa_received && !emp.stamped_visa_uploaded)
        );
      } else if (actionFilter === 'completed') {
        matchesAction = emp.current_stage === 'completed' && emp.stamped_visa_uploaded;
      }
      
      return matchesSearch && matchesStage && matchesAction;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by newest first

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-6 max-w-[1600px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">All Employees</h1>
            <p className="text-sm text-neutral-600">Manage all employee visa applications</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">{filteredEmployees.length}</span> of {employees.length} employees
            </div>
            <button
              onClick={() => {
                console.log('Manual refresh clicked');
                refreshEmployees();
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-neutral-300 rounded-lg mb-4">
          <div className="p-3">
            <div className="flex gap-3 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-neutral-400" size={14} />
                <input type="text" placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400" />
              </div>

              {/* Stage Filter */}
              <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 bg-white">
                <option value="all">All Stages</option>
                <option value="pre-arrival">Pre Arrival</option>
                <option value="in-country">In Country</option>
                <option value="finalization">Finalization</option>
                <option value="completed">Completed</option>
              </select>

              {/* Action Filter */}
              <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 bg-white">
                <option value="all">All Actions</option>
                <option value="needs-review">Needs Review</option>
                <option value="needs-diso">Needs DISO</option>
                <option value="needs-medical">Needs Medical</option>
                <option value="waiting-employee">Waiting Employee</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white border border-neutral-300 rounded-lg flex flex-col overflow-hidden">
          {filteredEmployees.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <Users className="text-neutral-400" size={24} />
              </div>
              <p className="text-sm text-neutral-900 font-medium">No employees found</p>
              <p className="text-xs text-neutral-600 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Job Title</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Visa Type</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">Stage</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide min-w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {paginatedEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-2.5">
                        <button onClick={() => navigate(`/hr/employee/${employee.id}`)} className="text-sm font-medium text-neutral-900 hover:text-neutral-700 hover:underline">
                          {`${employee.first_name || ''} ${employee.last_name || ''}`.trim()}
                        </button>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-neutral-600">{employee.email}</td>
                      <td className="px-4 py-2.5 text-xs text-neutral-600">{employee.job_title}</td>
                      <td className="px-4 py-2.5 text-xs text-neutral-600">{employee.visa_type}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${employee.current_stage === 'completed' ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-700'}`}>
                          {employee.current_stage === 'pre-arrival' ? 'Pre-Arrival' : employee.current_stage === 'in-country' ? 'In-Country' : 'Completed'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 min-w-[180px]">
                        <div className="flex gap-1.5 flex-wrap items-center">
                          {/* Review Documents */}
                          {employee.documents_uploaded && !employee.hr_reviewed && (
                            <button onClick={() => navigate(`/hr/review/${employee.id}`)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              Review
                            </button>
                          )}
                          
                          {/* DISO Info */}
                          {employee.hr_reviewed && !employee.diso_info_completed && (
                            <button onClick={() => navigate(`/hr/diso-info/${employee.id}`)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                              DISO
                            </button>
                          )}
                          
                          {/* Book Medical */}
                          {employee.arrival_updated && !employee.medical_appointment_scheduled && (
                            <button onClick={() => navigate(`/hr/book-medical/${employee.id}`)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                              Medical
                            </button>
                          )}
                          
                          {/* Submit Visa */}
                          {employee.biometric_confirmed && !employee.residence_visa_submitted && (
                            <button onClick={() => navigate(`/hr/submit-visa/${employee.id}`)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                              Submit Visa
                            </button>
                          )}
                          
                          {/* Initiate Contract */}
                          {employee.residence_visa_submitted && !employee.contract_initiated && (
                            <button onClick={() => navigate(`/hr/initiate-contract/${employee.id}`)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                              Contract
                            </button>
                          )}
                          
                          {/* Submit to MOHRE */}
                          {employee.contract_signed && !employee.mohre_submitted && (
                            <button onClick={() => navigate(`/hr/mohre-submission/${employee.id}`)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                              MOHRE
                            </button>
                          )}
                          
                          {/* Apply for Visa */}
                          {employee.mohre_approved && !employee.visa_received && (
                            <button onClick={() => navigate(`/hr/visa-application/${employee.id}`)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                              Apply Visa
                            </button>
                          )}
                          
                          {/* Waiting states - Show only ONE status at a time */}
                          {/* Check in reverse order (most complete first) to avoid overlaps */}
                          
                          {/* Completed */}
                          {employee.current_stage === 'completed' && employee.stamped_visa_uploaded ? (
                            <span className="inline-block text-xs text-green-600 font-semibold whitespace-nowrap">✓ Completed</span>
                          ) : 
                          /* After visa received, waiting for stamped visa upload */
                          employee.visa_received && !employee.stamped_visa_uploaded ? (
                            <span className="inline-block text-xs text-neutral-600 whitespace-nowrap">Waiting for stamped visa...</span>
                          ) : 
                          /* After MOHRE submitted, waiting for approval */
                          employee.mohre_submitted && !employee.mohre_approved ? (
                            <span className="inline-block text-xs text-neutral-600 whitespace-nowrap">Waiting for MOHRE...</span>
                          ) : 
                          /* After contract initiated, waiting for signature */
                          employee.contract_initiated && !employee.contract_signed ? (
                            <span className="inline-block text-xs text-neutral-600 whitespace-nowrap">Waiting for signature...</span>
                          ) : 
                          /* After medical uploaded, waiting for biometric */
                          employee.medical_certificate_uploaded && !employee.biometric_confirmed ? (
                            <span className="inline-block text-xs text-neutral-600 whitespace-nowrap">Waiting for biometric...</span>
                          ) : 
                          /* After medical booked, waiting for certificate */
                          employee.medical_appointment_scheduled && !employee.medical_certificate_uploaded ? (
                            <span className="inline-block text-xs text-neutral-600 whitespace-nowrap">Waiting for medical...</span>
                          ) : 
                          /* After DISO completed, waiting for arrival */
                          employee.diso_info_completed && !employee.arrival_updated ? (
                            <span className="inline-block text-xs text-neutral-600 whitespace-nowrap">Waiting for arrival...</span>
                          ) : 
                          /* Waiting for documents */
                          !employee.documents_uploaded ? (
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

          {/* Pagination */}
          {filteredEmployees.length > itemsPerPage && (
            <div className="border-t border-neutral-300 px-4 py-3 flex items-center justify-between">
              <div className="text-xs text-neutral-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees
              </div>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 text-xs border rounded-lg transition-colors ${currentPage === page ? 'bg-red-600 text-white border-red-600' : 'border-neutral-300 hover:bg-neutral-50'}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
