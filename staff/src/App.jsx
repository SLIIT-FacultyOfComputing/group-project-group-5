import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/Auth/StaffLogin.jsx";
import StaffPage from "./pages/index.jsx";

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  return (
    <Router>
      <Routes>
        {/* Add /staff prefix to all routes */}
        <Route
          path="/staff/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/staff/dashboard" replace />
            ) : (
              <AdminLogin />
            )
          }
        />

        <Route
          path="/staff/*"
          element={
            isAuthenticated() ? (
              <StaffPage />
            ) : (
              <Navigate to="/staff/login" replace />
            )
          }
        />

        {/* Redirect root to staff login */}
        <Route path="/" element={<Navigate to="/staff/login" replace />} />

        {/* Redirect any unknown paths to login */}
        <Route path="*" element={<Navigate to="/staff/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;