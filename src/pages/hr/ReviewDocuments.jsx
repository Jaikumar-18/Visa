import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const ReviewDocuments = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, updateEmployee, addNotification } = useData();
  const employee = getEmployee(parseInt(id));

  const [reviews, setReviews] = useState({});
  const [comments, setComments] = useState({});

  if (!employee) {
    return <div>Employee not found</div>;
  }

  const documents = employee.documents || {};

  const handleReview = (docType, status) => {
    setReviews({
      ...reviews,
      [docType]: status,
    });
  };

  const handleApprove = () => {
    // Check if all required documents are approved
    const requiredDocs = ['passport', 'photo', 'certificates'];
    const allApproved = requiredDocs.every(doc => reviews[doc] === 'approved');

    if (!allApproved) {
      toast.error('Please review all required documents');
      return;
    }

    // Update document statuses
    const updatedDocuments = { ...documents };
    Object.keys(reviews).forEach(docType => {
      if (updatedDocuments[docType]) {
        updatedDocuments[docType].status = reviews[docType];
        updatedDocuments[docType].comment = comments[docType] || '';
        updatedDocuments[docType].reviewedAt = new Date().toISOString();
      }
    });

    // Update employee
    updateEmployee(employee.id, {
      documents: updatedDocuments,
      preArrival: {
        ...employee.preArrival,
        hrReviewed: true,
        hrReviewedAt: new Date().toISOString(),
      },
      status: 'approved',
    });

    // Notify employee
    addNotification(
      employee.id,
      'Your documents have been approved by HR. You can now download your entry permit.',
      'success'
    );

    toast.success('Documents approved successfully!');
    setTimeout(() => navigate('/hr/employees'), 1000);
  };

  const handleReject = () => {
    // Update document statuses
    const updatedDocuments = { ...documents };
    Object.keys(reviews).forEach(docType => {
      if (updatedDocuments[docType]) {
        updatedDocuments[docType].status = reviews[docType] || 'rejected';
        updatedDocuments[docType].comment = comments[docType] || '';
        updatedDocuments[docType].reviewedAt = new Date().toISOString();
      }
    });

    // Update employee
    updateEmployee(employee.id, {
      documents: updatedDocuments,
      preArrival: {
        ...employee.preArrival,
        hrReviewed: true,
        hrReviewedAt: new Date().toISOString(),
      },
      status: 'rejected',
    });

    // Notify employee
    addNotification(
      employee.id,
      'Some documents need to be re-uploaded. Please check the comments and upload again.',
      'warning'
    );

    toast.success('Review submitted. Employee notified.');
    setTimeout(() => navigate('/hr/employees'), 1000);
  };

  const getDocumentLabel = (key) => {
    const labels = {
      passport: 'Passport Copy',
      photo: 'Passport Size Photo',
      certificates: 'Educational Certificates',
      employmentLetter: 'Previous Employment Letter',
      other: 'Other Documents',
    };
    return labels[key] || key;
  };

  return (
    <div className="min-h-screen bg-grey">
      <div className="max-w-[1400px] mx-auto p-4">
        <div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Review Documents</h1>
            <p className="text-xs text-neutral-500">
              Review documents for {employee.name} - AI will highlight mismatches
            </p>
          </div>
        </div>

      {/* Employee Info */}
      <Card title="Employee Information">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{employee.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Passport Number</p>
            <p className="font-medium text-gray-900">{employee.passportNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nationality</p>
            <p className="font-medium text-gray-900">{employee.nationality || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium text-gray-900">{employee.dateOfBirth || 'N/A'}</p>
          </div>
        </div>
      </Card>

      {/* Documents Review */}
      <div className="mt-6 space-y-4">
        {Object.entries(documents).map(([key, doc]) => {
          if (!doc || !doc.file) return null;
          
          // Only show Pre-Arrival documents (not medical certificate or biometric receipt)
          if (key === 'medicalCertificate' || key === 'biometricReceipt') return null;

          const isImage = doc.file.includes('image/');
          const reviewStatus = reviews[key];

          return (
            <Card key={key}>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Document Preview */}
                <div className="md:w-1/3">
                  <p className="text-sm font-medium text-gray-700 mb-2">{getDocumentLabel(key)}</p>
                  {isImage ? (
                    <img
                      src={doc.file}
                      alt={getDocumentLabel(key)}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <FileText className="text-gray-400" size={48} />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                  </p>
                </div>

                {/* Review Section */}
                <div className="md:w-2/3">
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      AI Analysis (Simulated)
                    </label>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium">Potential Issues Detected:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Image quality: Good</li>
                            <li>Document expiry: Valid</li>
                            <li>Name match: Verified</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Review Status
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={reviewStatus === 'approved' ? 'success' : 'outline'}
                        onClick={() => handleReview(key, 'approved')}
                        icon={CheckCircle}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant={reviewStatus === 'rejected' ? 'primary' : 'outline'}
                        onClick={() => handleReview(key, 'rejected')}
                        icon={XCircle}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Comments (Optional)
                    </label>
                    <textarea
                      value={comments[key] || ''}
                      onChange={(e) => setComments({ ...comments, [key]: e.target.value })}
                      placeholder="Add comments for the employee..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

        {/* Action Buttons */}
        <div className="mt-3 flex gap-2 bg-white border border-neutral-300 rounded p-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={handleReject}>
            Reject & Request Changes
          </Button>
          <Button type="button" variant="success" onClick={handleApprove}>
            Approve All Documents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDocuments;
