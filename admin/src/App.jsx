import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import EquipmentList from "./pages/EquipmentList";
import AddEquipmentForm from "./pages/AddEquipmentForm";
import EquipmentPage from "./pages/equipmentPage";
import MemberRegistration from "./pages/Membership/MemberRegistration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>

        {/*Equipment Routes*/}
        <Route path="equipment" element={<EquipmentList />} />
        <Route path="equipment/add" element={<AddEquipmentForm />} />

        {/*Equipment Routes*/}
        <Route path="member/register" element={<MemberRegistration />} />

        {/*Default Redirect*/}
        <Route index element={<EquipmentList />} />

        </Route>
      </Routes>     
    </Router>
  );
}

export default App;