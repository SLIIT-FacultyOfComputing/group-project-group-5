import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import EquipmentPage from "./pages/equipmentPage";
//import MembersPage from "./pages/Membership/MemberPage";

function App() {
  return (
    <Router>
      <Routes>

        {/*Equipment Routes*/}
        <Route path="/equipment/*" element={<EquipmentPage />} />

        {/*Member Routes*/}
        {/* <Route path="/members/*" element={<MembersPage />} /> */}

        {/*Default Redirect*/}
        <Route path="*" element={<Navigate to="/equipment" replace />} />

      </Routes>     
    </Router>
  );
}

export default App;