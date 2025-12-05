import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load selected company from localStorage on mount
  useEffect(() => {
    const savedCompany = localStorage.getItem('selectedCompany');
    if (savedCompany) {
      try {
        setSelectedCompany(JSON.parse(savedCompany));
      } catch (error) {
        console.error('Failed to parse saved company:', error);
        localStorage.removeItem('selectedCompany');
      }
    }
  }, []);

  const fetchCompanies = async () => {
    // Check if user is HR before fetching
    const user = localStorage.getItem('user');
    if (!user) return;
    
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'hr') {
        // Not HR, skip fetching companies
        return;
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/companies');
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      // Don't show error toast on login, just log it
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = (company) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
  };

  const clearCompany = () => {
    setSelectedCompany(null);
    localStorage.removeItem('selectedCompany');
  };

  const value = {
    selectedCompany,
    companies,
    loading,
    selectCompany,
    clearCompany,
    fetchCompanies
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};
