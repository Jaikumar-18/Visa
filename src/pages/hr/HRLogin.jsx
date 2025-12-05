import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast, { Toaster } from 'react-hot-toast';

const HRLogin = () => {
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
      toast.success('Login successful!');
      setTimeout(() => navigate('/hr/dashboard'), 500);
    } else {
      toast.error(result.message || 'Invalid credentials');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <Toaster position="top-right" />
      <div className="max-w-md w-full">
        <div className="bg-white border border-neutral-300 rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg mb-3">
              <Users className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-1">HR Portal Login</h2>
            <p className="text-sm text-neutral-600">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
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
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
            <p className="text-xs text-neutral-600 text-center">
              Demo Credentials:<br />
              <span className="font-medium">Email: hr@visaportal.com</span><br />
              <span className="font-medium">Password: admin123</span>
            </p>
          </div>

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

export default HRLogin;
