export const createNotification = (employeeId, message, type = 'info') => {
  return {
    id: Date.now(),
    employeeId,
    message,
    type,
    date: new Date().toISOString(),
    read: false,
  };
};

export const addNotificationToEmployee = (employee, message, type = 'info') => {
  const notification = createNotification(employee.id, message, type);
  const notifications = employee.notifications || [];
  return {
    ...employee,
    notifications: [notification, ...notifications],
  };
};
