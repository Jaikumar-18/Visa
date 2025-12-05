import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const ReviewDocuments = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEmployee, getEmployeeDocuments, reviewDocument, workflow, addNotification } = useData();
  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState({});

  const [reviews, setReviews] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const empData = await getEmployee(parseInt(id));
        setEmployee(empData);
        
        const docs = await getEmployeeDocuments(parseInt(id));
        setDocuments(docs);

        // Load images with authentication
        const token = localStorage.getItem('token');
        const urls = {};
        for (const doc of docs) {
          if (doc.mime_type?.startsWith('image/')) {
            try {
              const response = await fetch(
                `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/api/documents/${doc.id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              if (response.ok) {
                const blob = await response.blob();
                urls[doc.id] = URL.createObjectURL(blob);
              }
            } catch (err) {
              console.error('Failed to load image:', doc.id, err);
            }
          }
        }
        setImageUrls(urls);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load employee data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Cleanup blob URLs
    return () => {
      Object.values(imageUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [id, getEmployee, getEmployeeDocuments]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-sm text-neutral-900 font-medium">Employee not found</p>
        </div>
      </div>
    );
  }

  const handleReview = (docType, status) => {
    setReviews({
      ...reviews,
      [docType]: status,
    });
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // Review all documents
      const reviewPromises = documents.map(doc => {
        const status = reviews[doc.document_type] || 'approved';
        const comment = comments[doc.document_type] || '';
        return reviewDocument(doc.id, status, comment);
      });

      await Promise.all(reviewPromises);

      // Update workflow
      await workflow.reviewDocuments(employee.id, true);

      // Notify employee
      await addNotification(
        employee.id,
        'Your documents have been approved by HR. You can now download your entry permit.',
        'success'
      );

      toast.success('Documents approved successfully!');
      setTimeout(() => navigate('/hr/employees'), 1500);
    } catch (error) {
      console.error('Failed to approve documents:', error);
      toast.error(error.response?.data?.message || 'Failed to approve documents');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      // Review all documents
      const reviewPromises = documents.map(doc => {
        const status = reviews[doc.document_type] || 'rejected';
        const comment = comments[doc.document_type] || 'Please re-upload this document';
        return reviewDocument(doc.id, status, comment);
      });

      await Promise.all(reviewPromises);

      // Update workflow
      await workflow.reviewDocuments(employee.id, false);

      // Notify employee
      await addNotification(
        employee.id,
        'Some documents need to be re-uploaded. Please check the comments and upload again.',
        'warning'
      );

      toast.success('Review submitted. Employee notified.');
      setTimeout(() => navigate('/hr/employees'), 1500);
    } catch (error) {
      console.error('Failed to reject documents:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
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
              Review documents for {employee.first_name} {employee.last_name} - AI will highlight mismatches
            </p>
          </div>
        </div>

        {/* Employee Info */}
        <div className="bg-white border border-neutral-300 rounded-lg p-3 mb-3">
          <h2 className="text-sm font-semibold text-neutral-900 mb-2">Employee Information</h2>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-neutral-500">Name</p>
              <p className="text-xs font-medium text-neutral-900">{employee.first_name} {employee.last_name}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Passport Number</p>
              <p className="text-xs font-medium text-neutral-900">{employee.passport_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Nationality</p>
              <p className="text-xs font-medium text-neutral-900">{employee.present_nationality || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Date of Birth</p>
              <p className="text-xs font-medium text-neutral-900">{employee.date_of_birth || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Documents Review - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {documents.length === 0 ? (
            <div className="bg-white border border-neutral-300 rounded-lg p-8 text-center">
              <p className="text-sm text-neutral-600">No documents uploaded yet</p>
            </div>
          ) : (
            documents.map((doc) => {
            const reviewStatus = reviews[doc.document_type];

            return (
              <div key={doc.id} className="bg-white border border-neutral-300 rounded-lg p-3">
                <div className="flex gap-4">
                  {/* Document Preview */}
                  <div className="w-1/3">
                    <p className="text-xs font-semibold text-neutral-900 mb-2 capitalize">{doc.document_type?.replace(/_/g, ' ')}</p>
                    {doc.mime_type?.startsWith('image/') && imageUrls[doc.id] ? (
                      <img
                        src={imageUrls[doc.id]}
                        alt={doc.document_type}
                        className="w-full h-40 object-cover rounded-lg border border-neutral-200"
                      />
                    ) : doc.mime_type?.startsWith('image/') ? (
                      <div className="w-full h-40 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-neutral-100 rounded-lg border border-neutral-200 flex flex-col items-center justify-center">
                        <FileText className="text-neutral-400 mb-2" size={40} />
                        <p className="text-xs text-neutral-600 text-center px-2">{doc.file_name}</p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={async () => {
                          const token = localStorage.getItem('token');
                          const response = await fetch(
                            `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/api/documents/${doc.id}`,
                            { headers: { 'Authorization': `Bearer ${token}` } }
                          );
                          const blob = await response.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = doc.file_name;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex-1 px-2 py-1 bg-neutral-100 border border-neutral-300 rounded text-[10px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1.5">
                      Uploaded: {new Date(doc.uploaded_at).toLocaleString()}
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
                          onClick={() => handleReview(doc.document_type, 'approved')}
                          icon={CheckCircle}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant={reviewStatus === 'rejected' ? 'primary' : 'outline'}
                          onClick={() => handleReview(doc.document_type, 'rejected')}
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
                        value={comments[doc.document_type] || ''}
                        onChange={(e) => setComments({ ...comments, [doc.document_type]: e.target.value })}
                        placeholder="Add comments for the employee..."
                        className="w-full px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/hr/employees')} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={handleReject} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Reject & Request Changes'}
          </Button>
          <Button type="button" variant="success" onClick={handleApprove} disabled={isSubmitting}>
            {isSubmitting ? 'Approving...' : 'Approve All Documents'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDocuments;
