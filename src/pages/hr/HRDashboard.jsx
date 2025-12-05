import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Clock, CheckCircle, FileText, Bell, UserPlus, TrendingUp, Calendar, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';

const HRDashboard = () => {
  const navigate = useNavigate();
  const { employees, refreshEmployees, getHRNotifications } = useData();
  const [notifications, setNotifications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force refresh on mount
  useEffect(() => {
    console.log('HRDashboard mounted - forcing refresh');
    refreshEmployees();
  }, []);

  // Load notifications
  useEffect(() => {
    getHRNotifications().then(notifs => {
      setNotifications(notifs || []);
    });
  }, [getHRNotifications]);

  // Auto-refresh every 30 seconds to check for updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshEmployees();
      getHRNotifications().then(notifs => {
        setNotifications(notifs || []);
      });
    }, 30000); // Changed from 3000ms to 30000ms (30 seconds)

    return () => clearInterval(interval);
  }, [refreshEmployees, getHRNotifications]);

  // Reload data when page becomes visible (e.g., after navigation back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('HR Dashboard visible - reloading data');
        refreshEmployees();
        getHRNotifications().then(notifs => {
          setNotifications(notifs || []);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshEmployees, getHRNotifications]);

  const stats = {
    total: employees.length,
    preArrival: employees.filter(e => e.current_stage === 'pre-arrival').length,
    inCountry: employees.filter(e => e.current_stage === 'in-country').length,
    completed: employees.filter(e => e.current_stage === 'completed').length,
  };

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-6 max-w-[1600px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">HR Dashboard</h1>
            <p className="text-sm text-neutral-600">Manage visa requests and applications</p>
          </div>
          <button
            onClick={async () => {
              setIsRefreshing(true);
              await refreshEmployees();
              await getHRNotifications().then(notifs => setNotifications(notifs || []));
              setIsRefreshing(false);
            }}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
    
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-lg border border-neutral-300 p-3 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50"><Users className="w-4 h-4 text-blue-600" /></div>
              <div>
                <p className="text-xl font-semibold text-neutral-900">{stats.total}</p>
                <p className="text-xs text-neutral-600">Total Employees</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-300 p-3 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50"><Clock className="w-4 h-4 text-amber-600" /></div>
              <div>
                <p className="text-xl font-semibold text-neutral-900">{stats.preArrival}</p>
                <p className="text-xs text-neutral-600">Pre-Arrival</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-300 p-3 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50"><FileText className="w-4 h-4 text-purple-600" /></div>
              <div>
                <p className="text-xl font-semibold text-neutral-900">{stats.inCountry}</p>
                <p className="text-xs text-neutral-600">In-Country</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-300 p-3 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-50"><CheckCircle className="w-4 h-4 text-green-600" /></div>
              <div>
                <p className="text-xl font-semibold text-neutral-900">{stats.completed}</p>
                <p className="text-xs text-neutral-600">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-2 gap-4 min-h-0">
          {/* Left Column - Quick Actions */}
          <div className="bg-white rounded-lg border border-neutral-300 p-4 flex flex-col">
            <h2 className="text-base font-semibold text-neutral-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <button onClick={() => navigate('/hr/create-employee')} className="w-full flex items-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <UserPlus className="w-4 h-4" />
                <span className="text-sm font-medium">Create New Employee</span>
              </button>
              <button onClick={() => navigate('/hr/employees')} className="w-full flex items-center gap-2 p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-300">
                <Users className="w-4 h-4 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">View All Employees</span>
              </button>
              <button onClick={() => navigate('/hr/notifications')} className="w-full flex items-center gap-2 p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-300">
                <Bell className="w-4 h-4 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">View Notifications</span>
              </button>
              <button className="w-full flex items-center gap-2 p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-300">
                <Calendar className="w-4 h-4 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">Schedule Biometrics</span>
              </button>
              <button className="w-full flex items-center gap-2 p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-300">
                <TrendingUp className="w-4 h-4 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">Generate Report</span>
              </button>
            </div>
          </div>

          {/* Right Column - Recent Employees */}
          <div className="bg-white rounded-lg border border-neutral-300 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-neutral-300">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-neutral-900">Recent Employees</h2>
                {employees.length > 0 && <button onClick={() => navigate('/hr/employees')} className="text-xs text-neutral-600 hover:text-neutral-900 font-medium">View All →</button>}
              </div>
            </div>

            {employees.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                  <Users className="text-neutral-400" size={24} />
                </div>
                <p className="text-sm text-neutral-900 font-medium mb-1">No employees yet</p>
                <p className="text-xs text-neutral-600 mb-3">Create your first employee</p>
                <button onClick={() => navigate('/hr/create-employee')} className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" />
                  Create Employee
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-2">Employee</th>
                      <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-2">Job Title</th>
                      <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-2">Status</th>
                      <th className="text-right text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {employees.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5).map((employee) => {
                      const fullName = `${employee.first_name || ''} ${employee.last_name || ''}`.trim();
                      const initials = `${employee.first_name?.[0] || ''}${employee.last_name?.[0] || ''}`.toUpperCase();
                      
                      return (
                      <tr key={employee.id} className="hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => navigate(`/hr/employee/${employee.id}`)}>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-neutral-700">{initials}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-900">{fullName}</p>
                              <p className="text-xs text-neutral-500">{employee.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5"><p className="text-sm text-neutral-700">{employee.job_title}</p></td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${employee.current_stage === 'completed' ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-700'}`}>
                            {employee.current_stage === 'pre-arrival' ? 'Pre-Arrival' : employee.current_stage === 'in-country' ? 'In-Country' : 'Completed'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/hr/employee/${employee.id}`); }} className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 font-medium">
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
