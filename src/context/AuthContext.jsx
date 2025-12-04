import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = storage.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const login = (user) => {
    storage.setCurrentUser(user);
    setCurrentUser(user);
  };

  const logout = () => {
    storage.clearCurrentUser();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    isHR: currentUser?.role === 'hr',
    isEmployee: currentUser?.role === 'employee',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
