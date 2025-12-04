import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
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
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-1 flex flex-col p-4 max-w-[1600px] mx-auto w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Review Documents</h1>
            <p className="text-sm text-neutral-600">
              Review documents for {employee.name} - AI will highlight mismatches
            </p>
          </div>
        </div>

        {/* Employee Info */}
        <div className="bg-white border border-neutral-300 rounded-lg p-3 mb-3">
          <h2 className="text-sm font-semibold text-neutral-900 mb-2">Employee Information</h2>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-neutral-500">Name</p>
              <p className="text-xs font-medium text-neutral-900">{employee.name}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Passport Number</p>
              <p className="text-xs font-medium text-neutral-900">{employee.passportNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Nationality</p>
              <p className="text-xs font-medium text-neutral-900">{employee.nationality || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Date of Birth</p>
              <p className="text-xs font-medium text-neutral-900">{employee.dateOfBirth || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Documents Review - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {Object.entries(documents).map(([key, doc]) => {
            if (!doc || !doc.file) return null;
            
            // Only show Pre-Arrival documents (not medical certificate or biometric receipt)
            if (key === 'medicalCertificate' || key === 'biometricReceipt') return null;

            const isImage = doc.file.includes('image/');
            const reviewStatus = reviews[key];

            return (
              <div key={key} className="bg-white border border-neutral-300 rounded-lg p-3">
                <div className="flex gap-4">
                  {/* Document Preview */}
                  <div className="w-1/3">
                    <p className="text-xs font-semibold text-neutral-900 mb-2">{getDocumentLabel(key)}</p>
                    {isImage ? (
                      <img
                        src={doc.file}
                        alt={getDocumentLabel(key)}
                        className="w-full h-40 object-cover rounded-lg border border-neutral-200"
                      />
                    ) : (
                      <div className="w-full h-40 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center">
                        <FileText className="text-neutral-400" size={40} />
                      </div>
                    )}
                    <p className="text-xs text-neutral-500 mt-1.5">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Review Section */}
                  <div className="flex-1">
                    <div className="mb-3">
                      <label className="text-xs font-medium text-neutral-700 mb-1.5 block">
                        AI Analysis (Simulated)
                      </label>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={14} />
                          <div className="text-xs text-amber-800">
                            <p className="font-medium">Potential Issues Detected:</p>
                            <ul className="list-disc list-inside mt-1 space-y-0.5">
                              <li>Image quality: Good</li>
                              <li>Document expiry: Valid</li>
                              <li>Name match: Verified</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="text-xs font-medium text-neutral-700 mb-1.5 block">
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
                      <label className="text-xs font-medium text-neutral-700 mb-1.5 block">
                        Comments (Optional)
                      </label>
                      <textarea
                        value={comments[key] || ''}
                        onChange={(e) => setComments({ ...comments, [key]: e.target.value })}
                        placeholder="Add comments for the employee..."
                        className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
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
