import { Bell, Moon, CheckCircle, Info, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, getHRNotifications, getEmployeeNotifications, refreshEmployees } = useData();
  const [showDropdown, setShowDropdown] = useState(false);
  const [hrNotifications, setHrNotifications] = useState([]);
  const [employeeNotifications, setEmployeeNotifications] = useState([]);
  const dropdownRef = useRef(null);
  
  const notifications = currentUser?.role === 'employee' 
    ? employeeNotifications
    : hrNotifications;
  
  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;
  const recentNotifications = Array.isArray(notifications) ? notifications.slice(0, 5) : [];

  // Load notifications
  useEffect(() => {
    if (currentUser?.role === 'hr') {
      getHRNotifications().then(notifs => {
        setHrNotifications(notifs || []);
      });
    } else if (currentUser?.role === 'employee' && currentUser?.employeeId) {
      getEmployeeNotifications(currentUser.employeeId).then(notifs => {
        setEmployeeNotifications(notifs || []);
      });
    }
  }, [currentUser, getHRNotifications, getEmployeeNotifications]);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshEmployees();
      if (currentUser?.role === 'hr') {
        getHRNotifications().then(notifs => {
          setHrNotifications(notifs || []);
        });
      } else if (currentUser?.role === 'employee' && currentUser?.employeeId) {
        getEmployeeNotifications(currentUser.employeeId).then(notifs => {
          setEmployeeNotifications(notifs || []);
        });
      }
    }, 30000); // Changed from 5000ms to 30000ms (30 seconds)
    return () => clearInterval(interval);
  }, [refreshEmployees, currentUser, getHRNotifications, getEmployeeNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-success-600" size={16} />;
      case 'warning':
        return <AlertCircle className="text-amber-600" size={16} />;
      default:
        return <Info className="text-blue-600" size={16} />;
    }
  };

  return (
    <header className="bg-white border-b border-neutral-300">
      <div className="px-4 py-2.5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-neutral-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-neutral-800">Visa Portal</h1>
              <p className="text-xs text-neutral-500">Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-neutral-100 rounded">
              <Moon size={16} className="text-neutral-600" />
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 hover:bg-neutral-100 rounded relative"
              >
                <Bell size={16} className="text-neutral-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-primary-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-300 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-neutral-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-neutral-500">{unreadCount} unread</span>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="overflow-y-auto flex-1">
                    {recentNotifications.length > 0 ? (
                      recentNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer ${
                            !notif.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            setShowDropdown(false);
                            if (currentUser?.role === 'employee') navigate('/employee/notifications');
                            if (currentUser?.role === 'hr') navigate('/hr/notifications');
                          }}
                        >
                          <div className="flex items-start gap-2">
                            {getNotificationIcon(notif.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-neutral-900 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-neutral-500 mt-1">
                                {new Date(notif.created_at || notif.date).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="mx-auto text-neutral-400 mb-2" size={32} />
                        <p className="text-xs text-neutral-500">No notifications yet</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-neutral-200 bg-neutral-50">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          if (currentUser?.role === 'employee') navigate('/employee/notifications');
                          if (currentUser?.role === 'hr') navigate('/hr/notifications');
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium w-full text-center"
                      >
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-neutral-300">
              <div className="text-right">
                <p className="text-xs font-medium text-neutral-800">{currentUser?.name}</p>
                <Badge variant={currentUser?.role === 'hr' ? 'primary' : 'success'}>
                  {currentUser?.role === 'hr' ? 'HR' : 'EMPLOYEE'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
