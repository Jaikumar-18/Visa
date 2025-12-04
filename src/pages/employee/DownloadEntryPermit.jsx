import { useNavigate } from 'react-router-dom';
import { Download, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
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
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-neutral-900">Entry Permit</h1>
          <p className="text-sm text-neutral-600">Your entry permit is ready for download</p>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg border border-neutral-300 p-8 max-w-2xl w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              
              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                Documents Approved!
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                Your documents have been reviewed and approved by HR. You can now download your entry permit.
              </p>

              <div className="bg-neutral-50 rounded-lg p-4 mb-6 border border-neutral-200">
                <div className="flex items-center justify-center gap-3">
                  <FileText className="text-red-600" size={40} />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-neutral-900">UAE Entry Permit</p>
                    <p className="text-xs text-neutral-600">Valid for 60 days</p>
                    <p className="text-xs text-neutral-600">Employee: {employee.name}</p>
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

              <p className="text-xs text-neutral-500 mt-3">
                Please print this document and carry it with you when traveling to UAE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadEntryPermit;
