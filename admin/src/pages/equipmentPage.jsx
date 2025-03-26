import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import EquipmentList from "./Equipment/EquipmentList";
import AddEquipmentForm from "./Equipment/AddEquipmentForm";
import Header from "../components/header";
import Footer from "../components/Footer";
import MaintenanceScheduleList from "./Equipment/MaintenanceScheduleList";
import MaintenanceScheduleAdd from "./Equipment/MaintenanceScheduleAdd";

const EquipmentPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      <Header scrolled={scrolled} />
      
      <div className="container mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 neu-convex">
          <nav className="flex flex-wrap">
            <Link 
              to="/equipment-list" 
              className={`px-7 py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/equipment-list' || currentPath === '/' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              View Gym Equipment
            </Link>
            <Link 
              to="/add-equipment" 
              className={`px-7 py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/add-equipment' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Equipment
            </Link>
            <Link 
              to="/maintenance" 
              className={`px-7 py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/maintenance' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Maintenance
            </Link>
            <Link 
              to="/maintenance-list" 
              className={`px-7 py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/maintenance' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Maintenance
            </Link>
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto px-6 pb-12 relative mt-6">
        <div className="absolute inset-0 gym-equipment-pattern opacity-5 pointer-events-none"></div>
        <div className="glass-effect rounded-xl p-4">
          <Routes>
            <Route path="/equipment-list" element={<EquipmentList />} />
            <Route path="/add-equipment" element={<AddEquipmentForm />} />
            <Route path="/maintenance" element={<div>{<MaintenanceScheduleList />}</div>} />
            <Route path="/maintenance-list" element={<div>{<MaintenanceScheduleAdd />}</div>} />
  
            <Route path="/" element={<Navigate to="/equipment-list" replace />} />
            
            <Route path="*" element={
              <div className="bg-white rounded-xl shadow-lg p-12 mt-6 text-center relative backdrop-blur-sm">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-rose-50 p-5 rounded-full mb-5 shadow-inner">
                    <svg className="w-16 h-16 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">The page you are looking for doesn't exist or has been moved. Let's get you back on track.</p>
                  <Link 
                    to="/equipment-list" 
                    className="px-7 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-lg font-medium hover:from-rose-700 hover:to-rose-600 transition-all duration-300 flex items-center shadow-lg transform hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Return to Equipment List
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
      
      <Footer />
      
      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .bg-pattern-light {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        /* Improved gym equipment silhouettes background */
        .gym-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 30a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 60a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm60-55a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 60a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM59 29h2v2h-2v-2zm0 60h2v2h-2v-2zM29 59h2v2h-2v-2zm60 0h2v2h-2v-2zm-59 4h60v2H30v-2z'/%3E%3C/g%3E%3C/svg%3E");
        }
        
        /* Added equipment-specific pattern for content areas */
        .gym-equipment-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M25 15h5v90h-5zM90 15h5v90h-5zM15 55h90v10H15zM42 30c0-2.8 2.2-5 5-5s5 2.2 5 5v60c0 2.8-2.2 5-5 5s-5-2.2-5-5V30zM68 30c0-2.8 2.2-5 5-5s5 2.2 5 5v60c0 2.8-2.2 5-5 5s-5-2.2-5-5V30z'/%3E%3Cpath d='M10 10h10v10H10zM100 10h10v10h-10zM10 100h10v10H10zM100 100h10v10h-10z'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 80px 80px;
        }
        
        /* Enhanced animations */
          50% {
            box-shadow: 0 0 20px 5px rgba(244, 63, 94, 0.6);
          }
        }
        
        .pulse-glow {
          animation: pulseGlow 2s infinite;
        }
        
        /* Enhanced pulsing border for system active indicator */
        @keyframes pulseBorder {
          0%, 100% {
            border-color: rgba(244, 63, 94, 0.4);
            box-shadow: 0 0 5px rgba(244, 63, 94, 0.2);
          }
          50% {
            border-color: rgba(244, 63, 94, 0.8);
            box-shadow: 0 0 10px rgba(244, 63, 94, 0.4);
          }
        }
        
        .pulse-border {
          animation: pulseBorder 2s infinite;
        }
        
        /* Slower pulse animation for text effects */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        
        /* 3D button effect */
        .btn-3d {
          transform: translateY(0);
          transition: transform 0.2s;
          box-shadow: 0 4px 0 0 rgba(157, 23, 77, 1);
        }
        
        .btn-3d:active {
          transform: translateY(4px);
          box-shadow: 0 0 0 0 rgba(157, 23, 77, 1);
        }
        
        /* Glass morphism effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Enhanced equipment pattern with better details */
        .gym-equipment-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M25 15h5v90h-5zM90 15h5v90h-5zM15 55h90v10H15zM42 30c0-2.8 2.2-5 5-5s5 2.2 5 5v60c0 2.8-2.2 5-5 5s-5-2.2-5-5V30zM68 30c0-2.8 2.2-5 5-5s5 2.2 5 5v60c0 2.8-2.2 5-5 5s-5-2.2-5-5V30z'/%3E%3Cpath d='M10 10h10v10H10zM100 10h10v10h-10zM10 100h10v10H10zM100 100h10v10h-10z'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 80px 80px;
        }
        
        /* Neumorphic effect utilities */
        .neu-convex {
          background: linear-gradient(145deg, #e2e8ec, #ffffff);
          box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
        }
        
        .neu-concave {
          background: linear-gradient(145deg, #ffffff, #e2e8ec);
          box-shadow: inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff;
        }
      `}</style>
    </div>
  );
};

export default EquipmentPage;