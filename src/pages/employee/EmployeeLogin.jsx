import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../utils/storage';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast, { Toaster } from 'react-hot-toast';

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const employees = storage.getEmployees();
    const employee = employees.find(
      emp => emp.email === email && emp.password === password
    );
    
    if (employee) {
      login({ 
        role: 'employee', 
        name: employee.name, 
        email: employee.email,
        id: employee.id 
      });
      toast.success('Login successful!');
      setTimeout(() => navigate('/employee/dashboard'), 500);
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Toaster position="top-right" />
      <div className="max-w-md w-full">
        <div className="bg-white border-2 border-neutral-300 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mb-3">
              <Briefcase className="text-success-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-1">Employee Portal Login</h2>
            <p className="text-sm text-neutral-600">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />

            <div className="pt-3">
              <Button type="submit" variant="success" className="w-full">
                Login
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-neutral-600 hover:text-neutral-900"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
