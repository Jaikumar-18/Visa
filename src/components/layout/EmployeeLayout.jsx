import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import NextStepPrompt from '../common/NextStepPrompt';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const EmployeeLayout = () => {
  const { currentUser } = useAuth();
  const { getEmployee } = useData();
  const employee = currentUser ? getEmployee(currentUser.id) : null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="employee" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
      {employee && <NextStepPrompt employee={employee} userRole="employee" />}
    </div>
  );
};

export default EmployeeLayout;
