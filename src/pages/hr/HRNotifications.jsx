import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Bell, CheckCircle, Info, AlertCircle, User, Trash2, Filter } from 'lucide-react';
import Card from '../../components/common/Card';

const HRNotifications = () => {
  const navigate = useNavigate();
  const { getHRNotifications, markHRNotificationsAsRead, getEmployee, deleteHRNotification, clearAllHRNotifications } = useData();
  const notifications = getHRNotifications();
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');

  // Mark all as read when page opens
  useEffect(() => {
    const hasUnread = notifications.some(n => !n.read);
    if (hasUnread) {
      markHRNotificationsAsRead();
    }
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-success-600" size={20} />;
      case 'warning':
        return <AlertCircle className="text-amber-600" size={20} />;
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Filter notifications
  const filteredNotifications = (notifications || []).filter(notif => {
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesRead = filterRead === 'all' || 
                       (filterRead === 'unread' && !notif.read) ||
                       (filterRead === 'read' && notif.read);
    return matchesType && matchesRead;
  });

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1000px] mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Notifications</h1>
            <p className="text-xs text-neutral-500">All employee updates and actions</p>
          </div>
          {notifications && notifications.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all notifications?')) {
                  clearAllHRNotifications();
                }
              }}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}
        </div>

        {/* Filters */}
        {notifications && notifications.length > 0 && (
          <div className="bg-white border border-neutral-300 rounded p-3 mb-3">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-neutral-600" />
                <span className="text-xs font-medium text-neutral-600">Filters:</span>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
              </select>

              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>

              <span className="ml-auto text-xs text-neutral-500">
                {filteredNotifications.length} of {notifications.length} notifications
              </span>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white border border-neutral-300 rounded">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {filteredNotifications.map((notif) => {
                const employee = notif.employeeId ? getEmployee(notif.employeeId) : null;
                
                return (
                  <div
                    key={notif.id}
                    className={`p-3 ${getNotificationBg(notif.type)} ${
                      !notif.read ? 'border-l-4 border-l-primary-600' : ''
                    } ${employee ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                    onClick={() => employee && navigate(`/hr/employee/${employee.id}`)}
                  >
                    <div className="flex items-start gap-2.5">
                      {getNotificationIcon(notif.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-neutral-900">{notif.message}</p>
                            {employee && (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <User size={12} className="text-neutral-500 flex-shrink-0" />
                                <span className="text-xs text-neutral-600 font-medium truncate">
                                  {employee.name} - {employee.jobTitle}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!notif.read && (
                              <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1"></span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteHRNotification(notif.id);
                              }}
                              className="text-neutral-400 hover:text-primary-600 transition-colors"
                              title="Delete notification"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(notif.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="mx-auto text-neutral-400 mb-3" size={40} />
              <p className="text-sm text-neutral-600 mb-1">No notifications yet</p>
              <p className="text-xs text-neutral-500">
                You'll receive updates about employee actions here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRNotifications;
