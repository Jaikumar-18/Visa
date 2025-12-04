import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { addNotificationToEmployee } from '../utils/notifications';
import { sendEmailNotification } from '../utils/emailService';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadEmployees();
  }, [refreshKey]);

  const loadEmployees = () => {
    const data = storage.getEmployees();
    setEmployees(data);
  };

  const forceRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const addEmployee = (employeeData) => {
    const newEmployee = storage.addEmployee(employeeData);
    forceRefresh();
    return newEmployee;
  };

  const updateEmployee = (id, updates) => {
    const updated = storage.updateEmployee(id, updates);
    forceRefresh();
    return updated;
  };

  const getEmployee = (id) => {
    return employees.find(emp => emp.id === parseInt(id));
  };

  const addNotification = (employeeId, message, type = 'info', sendEmail = true) => {
    const employee = storage.getEmployee(employeeId);
    if (employee) {
      const updated = addNotificationToEmployee(employee, message, type);
      storage.updateEmployee(employeeId, updated);
      forceRefresh();
      
      // Send email notification to employee
      if (sendEmail && employee.email) {
        sendEmailNotification(
          employee.email,
          'Visa Portal Notification',
          message,
          type
        ).catch(error => {
          console.error('Failed to send email notification:', error);
        });
      }
    }
  };

  const addHRNotification = (message, type = 'info', employeeId = null) => {
    storage.addHRNotification(message, type, employeeId);
    forceRefresh();
  };

  const getHRNotifications = () => {
    return storage.getHRNotifications();
  };

  const markHRNotificationsAsRead = () => {
    const notifications = storage.getHRNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    storage.saveHRNotifications(updated);
    forceRefresh();
  };

  const deleteHRNotification = (notifId) => {
    const notifications = storage.getHRNotifications();
    const updated = notifications.filter(n => n.id !== notifId);
    storage.saveHRNotifications(updated);
    forceRefresh();
  };

  const clearAllHRNotifications = () => {
    storage.saveHRNotifications([]);
    forceRefresh();
  };

  const value = {
    employees,
    addEmployee,
    updateEmployee,
    getEmployee,
    addNotification,
    addHRNotification,
    getHRNotifications,
    markHRNotificationsAsRead,
    deleteHRNotification,
    clearAllHRNotifications,
    refreshEmployees: forceRefresh,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
