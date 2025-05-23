import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/Routine/RegisterPage.jsx";
import HomePage from "./pages/HomePage";
import MemberPage from "./pages/Membership/MemberPage";
import LoginPage from "./pages/LoginPage";
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DashboardHome from './pages/Admin/DashboardHome';
import MembersList from './pages/Admin/MembersList';
import EditMember from './pages/Admin/EditMember';
import AttendanceLog from './pages/Admin/AttendanceLog';
import Payments from './pages/Admin/Payments';
import QRScanner from './pages/Membership/QRScanner';
import EquipmentList from './pages/Equipment/Admin_EquipmentList';
import AddEquipmentForm from './pages/Equipment/AddEquipmentForm';
import MaintenanceScheduleList from './pages/Maintenance/MaintenanceScheduleList';
import AddMaintenanceSchedule from './pages/Maintenance/AddMaintenanceSchedule';
import MonthlyCostViewer from './pages/MonthlyCost/MonthlyCostViewer';
import TicketList from './pages/Tickets/TicketList';
import RaiseTicket from './pages/Tickets/AddTicketForm';
import StaffLogin from "./pages/Auth/StaffLogin.jsx";
import StaffPage from "./pages/StaffIndex.jsx";
import Staff_StaffList from './pages/Staff/Staff_StaffList';
import CreateRoutine from './pages/Routine/CreateRoutine';
import ViewRoutine from './pages/Routine/ViewRoutine.jsx';
import MemberProfile from "./pages/Profile/MemberProfile.jsx";
import SViewRoutine from './pages/Routine/SViewRoutine.jsx';
import SCreateRoutine from './pages/Routine/SCreateRoutine';
import authService from './services/authService';


function App() {  // Add authentication checks
  const isStaffAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  const isAdminAuthenticated = () => {
    return authService.isAdminAuthenticated();
  };

  return (
    <Router>
      <Routes>
        {/* Staff Routes */}
        <Route
          path="/staff/login"
          element={
            isStaffAuthenticated() ? (
              <Navigate to="/staff/dashboard" replace />
            ) : (
              <StaffLogin />
            )
          }
        />
        <Route
          path="/staff/*"
          element={
            isStaffAuthenticated() ? (
              <StaffPage />
            ) : (
              <Navigate to="/staff/login" replace />
            )
          }
        />

        {/*Home Route*/}
        <Route path="/" element={<HomePage />} />

        {/*Auth Routes*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/*Member Routes*/}
        <Route path="/members/*" element={<MemberPage />} />        {/*Admin Routes*/}
        <Route
          path="/admin/login"
          element={
            isAdminAuthenticated() ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/admin/*"
          element={
            isAdminAuthenticated() ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        >          <Route path="members" element={<MembersList />} />
          <Route path="members/edit/:id" element={<EditMember />} />
          <Route path="attendance" element={<AttendanceLog />} />
          <Route path="payments" element={<Payments />} />
          <Route path="equipment" element={<EquipmentList />} />
          <Route path="add-equipment" element={<AddEquipmentForm />} />
          <Route path="maintenance-list" element={<MaintenanceScheduleList />} />
          <Route path="maintenance-add" element={<AddMaintenanceSchedule />} />
          <Route path="maintenance-cost" element={<MonthlyCostViewer />} />
          <Route path="tickets" element={<TicketList />} />
          <Route path="raise-ticket" element={<RaiseTicket />} />
          <Route path="staff" element={<Staff_StaffList />} />
          <Route path="create-routine/:id" element={<CreateRoutine />} />
          <Route path="view-routine/:id" element={<ViewRoutine />} />          <Route path="member-profile" element={<MemberProfile />} />
          <Route path="staff/member/view-routine/:id" element={<ViewRoutine />} />
          <Route path="exercises" element={<ExercisesList />} />
          <Route path="reports" element={<div>Reports</div>} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route index element={<DashboardHome />} />
        </Route>
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        {/*QR Scanner Route*/}
        <Route path="/membership/scan-qr" element={<QRScanner />} />

        

        {/*Default Redirect*/}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>     
    </Router>
  );
}

export default App;