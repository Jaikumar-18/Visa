import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Users, Clock, CheckCircle, FileText, RefreshCw, UserPlus, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/common/Button';

const HRDashboard = () => {
  const navigate = useNavigate();
  const { employees, refreshEmployees } = useData();

  // Auto-refresh every 3 seconds to check for updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshEmployees();
    }, 3000);

    return () => clearInterval(interval);
  }, [refreshEmployees]);

  const stats = {
    total: employees.length,
    preArrival: employees.filter(e => e.currentStage === 'pre-arrival').length,
    inCountry: employees.filter(e => e.currentStage === 'in-country').length,
    completed: employees.filter(e => e.currentStage === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1400px] mx-auto p-4">
        {/* Tight Header */}
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">HR Dashboard</h1>
            <p className="text-xs text-neutral-500">Monitor employee visa applications</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refreshEmployees()}
              className="px-2.5 py-1.5 bg-neutral-100 border border-neutral-300 text-neutral-700 hover:bg-neutral-200 rounded text-xs flex items-center gap-1"
            >
              <RefreshCw size={13} />
              <span>Refresh</span>
            </button>
            <Button 
              onClick={() => navigate('/hr/create-employee')}
              variant="primary"
              icon={UserPlus}
            >
              Create Employee
            </Button>
          </div>
        </div>

        {/* Stats Grid with Colored Icons */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-white border border-neutral-300 rounded p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded bg-blue-100 flex items-center justify-center">
                  <Users className="text-blue-600" size={14} />
                </div>
                <p className="text-xs text-neutral-600 font-medium">Total</p>
              </div>
              <p className="text-xl font-bold text-neutral-800">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white border border-neutral-300 rounded p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded bg-amber-100 flex items-center justify-center">
                  <Clock className="text-amber-600" size={14} />
                </div>
                <p className="text-xs text-neutral-600 font-medium">Pre-Arrival</p>
              </div>
              <p className="text-xl font-bold text-neutral-800">{stats.preArrival}</p>
            </div>
          </div>

          <div className="bg-white border border-neutral-300 rounded p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded bg-purple-100 flex items-center justify-center">
                  <FileText className="text-purple-600" size={14} />
                </div>
                <p className="text-xs text-neutral-600 font-medium">In-Country</p>
              </div>
              <p className="text-xl font-bold text-neutral-800">{stats.inCountry}</p>
            </div>
          </div>

          <div className="bg-white border border-success-300 rounded p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded bg-success-100 flex items-center justify-center">
                  <CheckCircle className="text-success-600" size={14} />
                </div>
                <p className="text-xs text-neutral-600 font-medium">Completed</p>
              </div>
              <p className="text-xl font-bold text-success-600">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white border border-neutral-300 rounded overflow-hidden">
          <div className="px-3 py-2.5 bg-neutral-100 border-b border-neutral-300 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-800">Recent Employees</h2>
            {employees.length > 0 && (
              <button
                onClick={() => navigate('/hr/employees')}
                className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-0.5 font-medium"
              >
                View All <ArrowRight size={14} />
              </button>
            )}
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 rounded bg-neutral-200 flex items-center justify-center mx-auto mb-2">
                <Users className="text-neutral-500" size={20} />
              </div>
              <p className="text-sm font-medium text-neutral-700 mb-1">No employees yet</p>
              <p className="text-xs text-neutral-500 mb-3">Create your first employee</p>
              <Button onClick={() => navigate('/hr/create-employee')} variant="primary" icon={UserPlus}>
                Create Employee
              </Button>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 px-3 py-2.5 bg-neutral-50 border-b border-neutral-200">
                <div className="col-span-5 text-xs font-semibold text-black-600 uppercase tracking-wide flex items-center h-8">Employee</div>
                <div className="col-span-3 text-xs font-semibold text-black-600 uppercase tracking-wide flex items-center h-8">Position</div>
                <div className="col-span-2 text-xs font-semibold text-black-600 uppercase tracking-wide flex items-center h-8">Department</div>
                <div className="col-span-2 text-xs font-semibold text-black-600 uppercase tracking-wide flex items-center justify-end h-8">Status</div>
              </div>
              
              {/* Table Rows */}
              <div className="divide-y divide-neutral-200">
                {employees
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((employee) => (
                  <div
                    key={employee.id}
                    className="grid grid-cols-12 gap-3 px-3 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/hr/employee/${employee.id}`)}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">
                          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-neutral-800 truncate">{employee.name}</span>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <span className="text-sm text-neutral-600 truncate">{employee.jobTitle}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-neutral-600 truncate">{employee.department}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        employee.currentStage === 'completed' 
                          ? 'bg-success-600 text-white' 
                          : employee.currentStage === 'in-country'
                          ? 'bg-neutral-600 text-white'
                          : 'bg-neutral-400 text-white'
                      }`}>
                        {employee.currentStage === 'pre-arrival' ? 'PRE ARRIVAL' : 
                         employee.currentStage === 'in-country' ? 'IN COUNTRY' : 'COMPLETED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
