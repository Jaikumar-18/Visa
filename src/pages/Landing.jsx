import { useNavigate } from 'react-router-dom';
import { Users, IdCardLanyard } from 'lucide-react';
import Button from '../components/common/Button';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="/src/assets/Nesto-logo.png" 
              alt="Nesto Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Visa Management Portal</h1>
          <p className="text-sm text-neutral-600">Streamline your employee visa processing workflow</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* HR Login */}
          <div className="bg-white border border-neutral-300 rounded-lg p-6 hover:border-primary-600 transition-all">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-primary-600" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">HR Portal</h2>
            <p className="text-sm text-neutral-600 mb-6">
              Manage employee visa applications, review documents, and track progress
            </p>
            <Button 
              onClick={() => navigate('/login/hr')} 
              variant="primary"
              className="w-full"
            >
              Login as HR
            </Button>
          </div>

          {/* Employee Login */}
          <div className="bg-white border border-neutral-300 rounded-lg p-6 hover:border-success-600 transition-all">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
              <IdCardLanyard className="text-success-600" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Employee Portal</h2>
            <p className="text-sm text-neutral-600 mb-6">
              Track your visa application status, upload documents, and complete tasks
            </p>
            <Button 
              onClick={() => navigate('/login/employee')} 
              variant="success"
              className="w-full"
            >
              Login as Employee
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
