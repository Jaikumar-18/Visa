import { useNavigate } from 'react-router-dom';
import { Download, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const DownloadEntryPermit = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getEmployee, updateEmployee } = useData();
  const employee = getEmployee(currentUser.id);

  if (!employee) {
    return <div>Loading...</div>;
  }

  const handleDownload = () => {
    // Simulate PDF download
    toast.success('Entry Permit downloaded successfully!');
    
    // Update employee status
    updateEmployee(currentUser.id, {
      preArrival: {
        ...employee.preArrival,
        entryPermitGenerated: true,
        entryPermitDownloadedAt: new Date().toISOString(),
      },
      currentStage: 'in-transit',
    });

    setTimeout(() => navigate('/employee/dashboard'), 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Entry Permit</h1>
        <p className="text-gray-600 mt-1">Your entry permit is ready for download</p>
      </div>

      <Card>
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-success-600" size={40} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Documents Approved!
          </h2>
          <p className="text-gray-600 mb-8">
            Your documents have been reviewed and approved by HR. You can now download your entry permit.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <FileText className="text-primary-600" size={48} />
              <div className="text-left">
                <p className="font-semibold text-gray-900">UAE Entry Permit</p>
                <p className="text-sm text-gray-600">Valid for 60 days</p>
                <p className="text-sm text-gray-600">Employee: {employee.name}</p>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleDownload}
            icon={Download}
            className="px-8"
          >
            Download Entry Permit
          </Button>

          <p className="text-sm text-gray-500 mt-4">
            Please print this document and carry it with you when traveling to UAE
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DownloadEntryPermit;
