import React from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import MemberRegistration from "./MemberRegistration";
import Header from "../components/header";
import Footer from "../components/Footer";

const MembersPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 mt-4 md:mt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 neu-convex">
          <nav className="flex flex-col md:flex-row">
            <Link 
              to="/member-registration" 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/member-registration'
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Member Registration
            </Link>
            {/* Add other member-related navigation links here */}
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 pb-8 md:pb-12 mt-4 md:mt-6">
        <Routes>
          <Route path="/member-registration" element={<MemberRegistration />} />
          <Route path="/" element={<Navigate to="/member-registration" replace />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
};

export default MembersPage;