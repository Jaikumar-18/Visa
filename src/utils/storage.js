const STORAGE_KEYS = {
  EMPLOYEES: 'visa_app_employees',
  HR_USER: 'visa_app_hr',
  CURRENT_USER: 'visa_app_current_user',
};

// Compress image to reduce storage size
export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if too large (max 800px)
        const maxSize = 800;
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 70% quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const storage = {
  // Get all employees
  getEmployees: () => {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  },

  // Save all employees
  saveEmployees: (employees) => {
    try {
      const data = JSON.stringify(employees);
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, data);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Cleaning up old data...');
        // Try to clean up and save again
        storage.cleanupStorage();
        try {
          localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
        } catch (e2) {
          alert('Storage is full. Please use smaller files or contact support.');
          throw e2;
        }
      } else {
        throw e;
      }
    }
  },

  // Get single employee by ID
  getEmployee: (id) => {
    const employees = storage.getEmployees();
    return employees.find(emp => emp.id === id);
  },

  // Update employee
  updateEmployee: (id, updates) => {
    const employees = storage.getEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...updates };
      storage.saveEmployees(employees);
      return employees[index];
    }
    return null;
  },

  // Add employee
  addEmployee: (employee) => {
    const employees = storage.getEmployees();
    const newEmployee = {
      ...employee,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    employees.push(newEmployee);
    storage.saveEmployees(employees);
    return newEmployee;
  },

  // Current user
  getCurrentUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  clearCurrentUser: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // HR User
  getHRUser: () => {
    return { username: 'admin', password: 'admin', name: 'HR Manager' };
  },

  // HR Notifications
  getHRNotifications: () => {
    const data = localStorage.getItem('visa_app_hr_notifications');
    return data ? JSON.parse(data) : [];
  },

  saveHRNotifications: (notifications) => {
    localStorage.setItem('visa_app_hr_notifications', JSON.stringify(notifications));
  },

  addHRNotification: (message, type = 'info', employeeId = null) => {
    const notifications = storage.getHRNotifications();
    const newNotification = {
      id: Date.now(),
      message,
      type,
      employeeId,
      date: new Date().toISOString(),
      read: false,
    };
    notifications.unshift(newNotification);
    storage.saveHRNotifications(notifications);
  },

  // Cleanup storage
  cleanupStorage: () => {
    // Remove old notifications to free up space
    const employees = storage.getEmployees();
    employees.forEach(emp => {
      if (emp.notifications && emp.notifications.length > 5) {
        emp.notifications = emp.notifications.slice(0, 5);
      }
    });
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  // Clear all data
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
};
