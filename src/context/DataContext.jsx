import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { employeeAPI, notificationAPI, documentAPI, workflowAPI } from '../services/api';

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
    // Only load employees if user is logged in (has token)
    const token = localStorage.getItem('token');
    if (token) {
      loadEmployees();
    }
  }, [refreshKey]);

  const loadEmployees = async () => {
    try {
      console.log('DataContext: Loading all employees...');
      const response = await employeeAPI.getAll();
      console.log('DataContext: Employees loaded:', response.data.employees?.length, 'employees');
      console.log('DataContext: First employee sample:', response.data.employees?.[0]);
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error('Failed to load employees:', error);
      setEmployees([]);
    }
  };

  const forceRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // ==================== EMPLOYEE METHODS ====================
  const addEmployee = async (employeeData) => {
    try {
      const response = await employeeAPI.create(employeeData);
      forceRefresh();
      return response.data;
    } catch (error) {
      console.error('Failed to add employee:', error);
      throw error;
    }
  };

  const updateEmployee = async (id, updates) => {
    try {
      const response = await employeeAPI.update(id, updates);
      forceRefresh();
      return response.data.employee;
    } catch (error) {
      console.error('Failed to update employee:', error);
      throw error;
    }
  };

  const getEmployee = async (id, skipCache = false) => {
    try {
      if (!id) {
        console.warn('DataContext: No employee ID provided');
        return null;
      }
      
      console.log('DataContext: Fetching employee ID:', id);
      const response = await employeeAPI.getById(id);
      console.log('DataContext: Employee fetched:', response.data.employee);
      return response.data.employee;
    } catch (error) {
      console.error('DataContext: Failed to get employee:', error);
      console.error('DataContext: Error details:', error.response?.data);
      // If 403, user needs to re-login to get updated token with employeeId
      if (error.response?.status === 403) {
        console.warn('Access denied. Please log out and log in again.');
      }
      // Fallback to local cache
      const cached = employees.find(emp => emp.id === parseInt(id));
      console.log('DataContext: Using cached employee:', cached);
      return cached;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await employeeAPI.delete(id);
      forceRefresh();
    } catch (error) {
      console.error('Failed to delete employee:', error);
      throw error;
    }
  };

  const updatePassportDetails = async (id, data) => {
    try {
      const response = await employeeAPI.updatePassport(id, data);
      forceRefresh();
      return response.data;
    } catch (error) {
      console.error('Failed to update passport:', error);
      throw error;
    }
  };

  // ==================== NOTIFICATION METHODS ====================
  const addNotification = async (employeeId, message, type = 'info') => {
    try {
      await notificationAPI.create({
        employeeId,
        message,
        type,
        isHR: false
      });
      forceRefresh();
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  };

  const addHRNotification = async (message, type = 'info', employeeId = null) => {
    try {
      await notificationAPI.create({
        employeeId,
        message,
        type,
        isHR: true
      });
      forceRefresh();
    } catch (error) {
      console.error('Failed to add HR notification:', error);
    }
  };

  const getHRNotifications = async () => {
    try {
      const response = await notificationAPI.getHRNotifications();
      return response.data.notifications || [];
    } catch (error) {
      console.error('Failed to get HR notifications:', error);
      return [];
    }
  };

  const getEmployeeNotifications = async (employeeId) => {
    try {
      const response = await notificationAPI.getEmployeeNotifications(employeeId);
      return response.data.notifications || [];
    } catch (error) {
      console.error('Failed to get employee notifications:', error);
      return [];
    }
  };

  const markNotificationAsRead = async (id, isHR = false) => {
    try {
      await notificationAPI.markAsRead(id, isHR);
      forceRefresh();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async (employeeId, isHR = false) => {
    try {
      await notificationAPI.markAllAsRead(employeeId, isHR);
      forceRefresh();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id, isHR = false) => {
    try {
      await notificationAPI.delete(id, isHR);
      forceRefresh();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearAllNotifications = async (employeeId, isHR = false) => {
    try {
      await notificationAPI.clearAll(employeeId, isHR);
      forceRefresh();
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  // ==================== DOCUMENT METHODS ====================
  const uploadDocument = async (file, employeeId, documentType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', employeeId);
      formData.append('documentType', documentType);
      
      const response = await documentAPI.upload(formData);
      forceRefresh();
      return response.data;
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw error;
    }
  };

  const getEmployeeDocuments = async (employeeId) => {
    try {
      const response = await documentAPI.getEmployeeDocuments(employeeId);
      return response.data.documents || [];
    } catch (error) {
      console.error('Failed to get documents:', error);
      return [];
    }
  };

  const reviewDocument = async (id, status, comment) => {
    try {
      const response = await documentAPI.review(id, status, comment);
      forceRefresh();
      return response.data;
    } catch (error) {
      console.error('Failed to review document:', error);
      throw error;
    }
  };

  // ==================== WORKFLOW METHODS ====================
  const workflow = {
    submitDocuments: async (employeeId) => {
      const response = await workflowAPI.submitDocuments(employeeId);
      forceRefresh();
      return response.data;
    },
    reviewDocuments: async (id, approved) => {
      const response = await workflowAPI.reviewDocuments(id, approved);
      forceRefresh();
      return response.data;
    },
    submitDISO: async (id, data) => {
      const response = await workflowAPI.submitDISO(id, data);
      forceRefresh();
      return response.data;
    },
    generateEntryPermit: async (id) => {
      const response = await workflowAPI.generateEntryPermit(id);
      forceRefresh();
      return response.data;
    },
    updateArrival: async (id, data) => {
      const response = await workflowAPI.updateArrival(id, data);
      forceRefresh();
      return response.data;
    },
    bookMedical: async (id, data) => {
      const response = await workflowAPI.bookMedical(id, data);
      forceRefresh();
      return response.data;
    },
    uploadMedicalCert: async (id) => {
      const response = await workflowAPI.uploadMedicalCert(id);
      forceRefresh();
      return response.data;
    },
    confirmBiometric: async (id, data) => {
      const response = await workflowAPI.confirmBiometric(id, data);
      forceRefresh();
      return response.data;
    },
    submitResidenceVisa: async (id) => {
      const response = await workflowAPI.submitResidenceVisa(id);
      forceRefresh();
      return response.data;
    },
    initiateContract: async (id, data) => {
      const response = await workflowAPI.initiateContract(id, data);
      forceRefresh();
      return response.data;
    },
    signContract: async (id) => {
      const response = await workflowAPI.signContract(id);
      forceRefresh();
      return response.data;
    },
    submitMOHRE: async (id) => {
      const response = await workflowAPI.submitMOHRE(id);
      forceRefresh();
      return response.data;
    },
    applyVisa: async (id) => {
      const response = await workflowAPI.applyVisa(id);
      forceRefresh();
      return response.data;
    },
    uploadStampedVisa: async (id) => {
      const response = await workflowAPI.uploadStampedVisa(id);
      forceRefresh();
      return response.data;
    },
  };

  const value = {
    // Employee methods
    employees,
    addEmployee,
    updateEmployee,
    getEmployee,
    deleteEmployee,
    updatePassportDetails,
    refreshEmployees: forceRefresh,
    
    // Notification methods
    addNotification,
    addHRNotification,
    getHRNotifications,
    getEmployeeNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    
    // Document methods
    uploadDocument,
    getEmployeeDocuments,
    reviewDocument,
    
    // Workflow methods
    workflow,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
