import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Bell, CheckCircle, Info, AlertCircle, Trash2, Filter } from 'lucide-react';

const Notifications = () => {
  const { currentUser } = useAuth();
  const { getEmployee, getEmployeeNotifications, markAllNotificationsAsRead, deleteNotification: deleteNotif, clearAllNotifications } = useData();
  const [employee, setEmployee] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');

  // Load employee and notifications
  useEffect(() => {
    const loadData = async () => {
      if (currentUser?.employeeId) {
        try {
          const empData = await getEmployee(currentUser.employeeId);
          setEmployee(empData);
          
          const notifs = await getEmployeeNotifications(currentUser.employeeId);
          console.log('Notifications loaded:', notifs);
          setNotifications(notifs);
        } catch (error) {
          console.error('Failed to load notifications:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [currentUser?.employeeId, getEmployee, getEmployeeNotifications]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  const handleDeleteNotification = async (notifId) => {
    try {
      await deleteNotif(notifId, false);
      setNotifications(notifications.filter(n => n.id !== notifId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        await clearAllNotifications(currentUser.employeeId, false);
        setNotifications([]);
      } catch (error) {
        console.error('Failed to clear notifications:', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(currentUser.employeeId, false);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
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

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Notifications</h1>
            <p className="text-sm text-neutral-600">All your visa application updates</p>
          </div>
          <div className="flex gap-2">
            {notifications && notifications.length > 0 && notifications.some(n => !n.read) && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 border border-blue-300 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle size={14} />
                Mark All Read
              </button>
            )}
            {notifications && notifications.length > 0 && (
              <button
                onClick={handleDeleteAllNotifications}
                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-300 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {notifications && notifications.length > 0 && (
          <div className="bg-white border border-neutral-300 rounded-lg p-3 mb-3">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-neutral-600" />
                <span className="text-xs font-medium text-neutral-700">Filters:</span>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
              </select>

              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>

              <span className="ml-auto text-xs text-neutral-600 font-medium">
                {filteredNotifications.length} of {notifications.length} notifications
              </span>
            </div>
          </div>
        )}

        {/* Notifications List - Scrollable */}
        <div className="flex-1 bg-white border border-neutral-300 rounded-lg overflow-hidden flex flex-col">
          {filteredNotifications.length > 0 ? (
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-200">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 ${getNotificationBg(notif.type)} ${
                    !notif.read ? 'border-l-4 border-l-red-600' : ''
                  } transition-colors`}
                >
                  <div className="flex items-start gap-2.5">
                    {getNotificationIcon(notif.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-neutral-900 leading-relaxed">{notif.message}</p>
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notif.id);
                            }}
                            className="text-neutral-400 hover:text-red-600 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <Bell className="text-neutral-400 mb-3" size={48} />
              <p className="text-sm text-neutral-900 font-medium mb-1">No notifications yet</p>
              <p className="text-xs text-neutral-600">
                You'll receive updates about your visa application here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
