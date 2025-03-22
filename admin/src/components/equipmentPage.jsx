import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import EquipmentList from "./Equipment/EquipmentList";
import AddEquipmentForm from "./Equipment/AddEquipmentForm";

const EquipmentPage = () => {
  return (
    <div className="equipment-app-container">
      <nav className="equipment-nav-bar">
        <Link to="/equipment-list">
          <button className="equipment-nav-button">View Equipment List</button>
        </Link>
        <Link to="/add-equipment">
          <button className="equipment-nav-button">Add New Equipment</button>
        </Link>
      </nav>
      <Routes>
        <Route path="/equipment-list" element={<EquipmentList />} />
        <Route path="/add-equipment" element={<AddEquipmentForm />} />
        <Route path="/" element={<Navigate to="/equipment-list" replace />} />
        <Route path="*" element={<div className="text-center text-gray-600">Page Not Found</div>} />
      </Routes>
    </div>
  );
};

export default EquipmentPage;