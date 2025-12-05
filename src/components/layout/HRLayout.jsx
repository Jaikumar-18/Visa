import { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import NextStepPrompt from '../common/NextStepPrompt';
import { useData } from '../../context/DataContext';

const HRLayout = () => {
  const { id } = useParams();
  const { getEmployee } = useData();
  const [employee, setEmployee] = useState(null);

  // Load employee data when ID changes
  useEffect(() => {
    if (id) {
      getEmployee(parseInt(id)).then(data => {
        console.log('HRLayout loaded employee:', data);
        setEmployee(data);
      });
    } else {
      setEmployee(null);
    }
  }, [id, getEmployee]);

  // Reload when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && id) {
        getEmployee(parseInt(id)).then(data => {
          console.log('HRLayout reloaded employee:', data);
          setEmployee(data);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [id, getEmployee]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="hr" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
      {employee && <NextStepPrompt employee={employee} userRole="hr" />}
    </div>
  );
};

export default HRLayout;
