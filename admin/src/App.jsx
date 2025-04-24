import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import MemberPage from "./pages/Membership/MemberPage";
import LoginPage from "./pages/LoginPage";
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/*Home Route*/}
        <Route path="/" element={<HomePage />} />

        {/*Auth Routes*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/*Member Routes*/}
        <Route path="/members/*" element={<MemberPage />} />

        {/*Admin Routes*/}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        {/*Default Redirect*/}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>     
    </Router>
  );
}

export default App;