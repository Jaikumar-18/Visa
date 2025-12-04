import { useState } from 'react';
import { Mail, Save, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const EmailSettings = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    apiEndpoint: 'http://localhost:3001/api/send-email',
    fromEmail: 'noreply@visaportal.com',
    companyName: 'Visa Management Portal',
  });

  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleInputChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('emailSettings', JSON.stringify(settings));
    toast.success('Email settings saved successfully!');
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }

    setIsTesting(true);
    
    try {
      // Simulate sending test email
      console.log('Sending test email to:', testEmail);
      
      setTimeout(() => {
        setIsTesting(false);
        toast.success(`Test email sent to ${testEmail}! Check console for details.`);
      }, 1500);
      
    } catch (error) {
      setIsTesting(false);
      toast.error('Failed to send test email');
    }
  };

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1000px] mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Email Settings</h1>
            <p className="text-xs text-neutral-500">Configure SMTP email notifications for employees</p>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Backend Required</h3>
              <p className="text-xs text-blue-700 mb-2">
                Email notifications require a backend API service. Currently, emails are logged to console only.
              </p>
              <a 
                href="/EMAIL_SETUP_GUIDE.md" 
                target="_blank"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
              >
                View Setup Guide →
              </a>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <Card title="Email Configuration" icon={Mail}>
          <div className="space-y-4">
            {/* Enable/Disable */}
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <input
                type="checkbox"
                id="enabled"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-neutral-800">
                Enable email notifications for employees
              </label>
            </div>

            {/* API Endpoint */}
            <Input
              label="Backend API Endpoint"
              name="apiEndpoint"
              value={settings.apiEndpoint}
              onChange={handleInputChange}
              placeholder="http://localhost:3001/api/send-email"
              disabled={!settings.enabled}
            />

            {/* From Email */}
            <Input
              label="From Email Address"
              name="fromEmail"
              type="email"
              value={settings.fromEmail}
              onChange={handleInputChange}
              placeholder="noreply@visaportal.com"
              disabled={!settings.enabled}
            />

            {/* Company Name */}
            <Input
              label="Company Name"
              name="companyName"
              value={settings.companyName}
              onChange={handleInputChange}
              placeholder="Visa Management Portal"
              disabled={!settings.enabled}
            />

            {/* Save Button */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                icon={Save}
                onClick={handleSave}
                disabled={!settings.enabled}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </Card>

        {/* Test Email */}
        <Card title="Test Email" icon={TestTube}>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Send a test email to verify your configuration is working correctly.
            </p>

            <Input
              label="Test Email Address"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              disabled={!settings.enabled}
            />

            <Button
              variant="secondary"
              icon={Mail}
              onClick={handleTestEmail}
              disabled={!settings.enabled || isTesting}
            >
              {isTesting ? 'Sending...' : 'Send Test Email'}
            </Button>
          </div>
        </Card>

        {/* Email Events */}
        <Card title="Email Notifications Sent">
          <div className="space-y-2">
            <p className="text-sm text-neutral-600 mb-3">
              Employees receive email notifications for the following events:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'Account Created (with credentials)',
                'Documents Approved',
                'Documents Rejected',
                'Medical Appointment Scheduled',
                'Contract Ready for Signature',
                'Residence Visa Submitted',
                'MOHRE Contract Approved',
                'Visa Ready for Collection',
                'Process Completed',
              ].map((event, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-neutral-700">
                  <CheckCircle className="text-success-600 flex-shrink-0" size={16} />
                  <span>{event}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>Note:</strong> HR does not receive email notifications. HR notifications are in-app only.
              </p>
            </div>
          </div>
        </Card>

        {/* Setup Instructions */}
        <Card title="Quick Setup Guide">
          <div className="space-y-3 text-sm text-neutral-700">
            <div>
              <h4 className="font-semibold text-neutral-800 mb-1">1. Choose Email Service</h4>
              <p className="text-xs">Gmail SMTP (testing), SendGrid (recommended), or AWS SES (scale)</p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-800 mb-1">2. Set Up Backend</h4>
              <p className="text-xs">Create Node.js API using the example in backend-email-api-example.js</p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-800 mb-1">3. Configure Credentials</h4>
              <p className="text-xs">Add SMTP credentials to .env file (never commit to git!)</p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-800 mb-1">4. Update API Endpoint</h4>
              <p className="text-xs">Enter your backend URL above and save settings</p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-800 mb-1">5. Test</h4>
              <p className="text-xs">Send a test email to verify everything works</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmailSettings;
