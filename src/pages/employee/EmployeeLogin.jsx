import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IdCardLanyard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast, { Toaster } from 'react-hot-toast';

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Login Successful!');
      setTimeout(() => navigate('/employee/dashboard'), 500);
    } else {
      toast.error(result.message || 'Invalid Credentials');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <Toaster position="top-right" />
      <div className="max-w-md w-full">
        <div className="bg-white border border-neutral-300 rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-3">
              <IdCardLanyard className="text-green-600" size={24} />
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

            <div className="pt-2">
              <Button type="submit" variant="success" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
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
