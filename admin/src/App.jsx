import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import MemberPage from "./pages/Membership/MemberPage";

function App() {
  return (
    <Router>
      <Routes>
        {/*Home Route*/}
        <Route path="/" element={<HomePage />} />

        {/*Member Routes*/}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/members/*" element={<MemberPage />} />

        {/*Default Redirect*/}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>     
    </Router>
  );
}

export default App;