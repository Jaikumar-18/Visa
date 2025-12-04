import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import NextStepPrompt from '../common/NextStepPrompt';
import { useData } from '../../context/DataContext';

const HRLayout = () => {
  const { id } = useParams();
  const { getEmployee } = useData();
  const employee = id ? getEmployee(parseInt(id)) : null;

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
