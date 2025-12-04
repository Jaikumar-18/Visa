import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import HRLayout from './components/layout/HRLayout';
import EmployeeLayout from './components/layout/EmployeeLayout';

// Public Pages
import Landing from './pages/Landing';
import HRLogin from './pages/hr/HRLogin';
import EmployeeLogin from './pages/employee/EmployeeLogin';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import CreateEmployee from './pages/hr/CreateEmployee';
import EmployeeList from './pages/hr/EmployeeList';
import EmployeeDetails from './pages/hr/EmployeeDetailsNew';
import ReviewDocuments from './pages/hr/ReviewDocuments';
import DisoPortalInfo from './pages/hr/DisoPortalInfo';
import BookMedicalAppointment from './pages/hr/BookMedicalAppointment';
import SubmitResidenceVisa from './pages/hr/SubmitResidenceVisa';
import InitiateContract from './pages/hr/InitiateContract';
import MohreSubmission from './pages/hr/MohreSubmission';
import VisaApplication from './pages/hr/VisaApplication';
import HRNotifications from './pages/hr/HRNotifications';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import StatusTracking from './pages/employee/StatusTracking';
import UploadDocuments from './pages/employee/UploadDocuments';
import DownloadEntryPermit from './pages/employee/DownloadEntryPermit';
import UpdateArrival from './pages/employee/UpdateArrival';
import MedicalCertificate from './pages/employee/MedicalCertificate';
import BiometricConfirmation from './pages/employee/BiometricConfirmation';
import SignContract from './pages/employee/SignContract';
import UploadStampedVisa from './pages/employee/UploadStampedVisa';
import Notifications from './pages/employee/Notifications';
import MyProfile from './pages/employee/MyProfile';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login/hr" element={<HRLogin />} />
            <Route path="/login/employee" element={<EmployeeLogin />} />

            {/* HR Routes */}
            <Route
              path="/hr"
              element={
                <ProtectedRoute requiredRole="hr">
                  <HRLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/hr/dashboard" replace />} />
              <Route path="dashboard" element={<HRDashboard />} />
              <Route path="create-employee" element={<CreateEmployee />} />
              <Route path="employees" element={<EmployeeList />} />
              <Route path="employee/:id" element={<EmployeeDetails />} />
              <Route path="review/:id" element={<ReviewDocuments />} />
              <Route path="diso-info/:id" element={<DisoPortalInfo />} />
              <Route path="book-medical/:id" element={<BookMedicalAppointment />} />
              <Route path="submit-visa/:id" element={<SubmitResidenceVisa />} />
              <Route path="initiate-contract/:id" element={<InitiateContract />} />
              <Route path="mohre-submission/:id" element={<MohreSubmission />} />
              <Route path="visa-application/:id" element={<VisaApplication />} />
              <Route path="notifications" element={<HRNotifications />} />
            </Route>

            {/* Employee Routes */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/employee/dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="status" element={<StatusTracking />} />
              <Route path="upload-documents" element={<UploadDocuments />} />
              <Route path="entry-permit" element={<DownloadEntryPermit />} />
              <Route path="update-arrival" element={<UpdateArrival />} />
              <Route path="medical-certificate" element={<MedicalCertificate />} />
              <Route path="biometric-confirmation" element={<BiometricConfirmation />} />
              <Route path="sign-contract" element={<SignContract />} />
              <Route path="upload-stamped-visa" element={<UploadStampedVisa />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
