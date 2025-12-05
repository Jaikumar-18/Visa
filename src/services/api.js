import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getSession: () => api.get('/auth/session'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// ==================== EMPLOYEE API ====================
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  updatePassport: (id, data) => api.put(`/employees/${id}/passport`, data),
};

// ==================== DOCUMENT API ====================
export const documentAPI = {
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getById: (id) => api.get(`/documents/${id}`, { responseType: 'blob' }),
  getEmployeeDocuments: (employeeId) => api.get(`/documents/employee/${employeeId}`),
  review: (id, status, comment) => api.put(`/documents/${id}/review`, { status, comment }),
  delete: (id) => api.delete(`/documents/${id}`),
};

// ==================== NOTIFICATION API ====================
export const notificationAPI = {
  getEmployeeNotifications: (employeeId, params = {}) => 
    api.get(`/notifications/employee/${employeeId}`, { params }),
  getHRNotifications: (params = {}) => 
    api.get('/notifications/hr', { params }),
  create: (data) => api.post('/notifications', data),
  markAsRead: (id, isHR = false) => 
    api.put(`/notifications/${id}/read`, { isHR }),
  markAllAsRead: (employeeId, isHR = false) => 
    api.put('/notifications/read-all', { employeeId, isHR }),
  delete: (id, isHR = false) => 
    api.delete(`/notifications/${id}?isHR=${isHR}`),
  clearAll: (employeeId, isHR = false) => 
    api.delete('/notifications/clear-all', { data: { employeeId, isHR } }),
};

// ==================== WORKFLOW API ====================
export const workflowAPI = {
  // Pre-Arrival Stage
  submitDocuments: (employeeId) => 
    api.post('/workflow/pre-arrival/documents', { employeeId }),
  reviewDocuments: (id, approved) => 
    api.put(`/workflow/pre-arrival/review/${id}`, { approved }),
  submitDISO: (id, data) => 
    api.post(`/workflow/pre-arrival/diso/${id}`, data),
  generateEntryPermit: (id) => 
    api.post(`/workflow/pre-arrival/entry-permit/${id}`),
  
  // In-Country Stage
  updateArrival: (id, data) => 
    api.post(`/workflow/in-country/arrival/${id}`, data),
  bookMedical: (id, data) => 
    api.post(`/workflow/in-country/medical/${id}`, data),
  uploadMedicalCert: (id) => 
    api.post(`/workflow/in-country/medical-cert/${id}`),
  confirmBiometric: (id, data) => 
    api.post(`/workflow/in-country/biometric/${id}`, data),
  submitResidenceVisa: (id) => 
    api.post(`/workflow/in-country/visa/${id}`),
  
  // Finalization Stage
  initiateContract: (id, data) => 
    api.post(`/workflow/finalization/contract/${id}`, data),
  signContract: (id) => 
    api.put(`/workflow/finalization/sign/${id}`),
  submitMOHRE: (id) => 
    api.post(`/workflow/finalization/mohre/${id}`),
  applyVisa: (id) => 
    api.post(`/workflow/finalization/visa-app/${id}`),
  uploadStampedVisa: (id) => 
    api.post(`/workflow/finalization/stamped/${id}`),
};

export default api;
