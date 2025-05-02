import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import EquipmentList from "./Equipment/EquipmentList";
import AddEquipmentForm from "./Equipment/AddEquipmentForm";
import Header from "../components/header";
import Footer from "../components/Footer";
import MaintenanceScheduleList from "./Maintenance/MaintenanceScheduleList";
import MaintenanceScheduleAdd from "./Maintenance/AddMaintenanceSchedule";
import MonthlyCostViewer from "./MonthlyCost/MonthlyCostViewer";
import TicketList from "./Tickets/TicketList";
import AddTicketForm from "./Tickets/AddTicketForm";
import { getOpenTicketsCount } from '../services/ticketApi';

const Index = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openTicketCount, setOpenTicketCount] = useState(0);
  const [ticketCountLoading, setTicketCountLoading] = useState(true);

  useEffect(() => {
    const fetchOpenTicketsCount = async () => {
      setTicketCountLoading(true);
      try {
        const response = await getOpenTicketsCount();
        setOpenTicketCount(response.data);
      } catch (error) {
        console.error('Error fetching open tickets count:', error);
      } finally {
        setTicketCountLoading(false);
      }
    };
    fetchOpenTicketsCount();

    const intervalId = setInterval(fetchOpenTicketsCount, 60 * 1000); // every 1 minute

    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
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
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 mt-4 md:mt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 neu-convex">
          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden p-4 border-b border-gray-100">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between text-gray-700 hover:text-rose-600 transition-colors"
            >
              <span className="font-medium">Menu</span>
              <svg className={`w-5 h-5 transition-transform duration-200 ${mobileMenuOpen ? 'transform rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
          
          {/* Navigation - responsive */}
          <nav className={`flex flex-col md:flex-row ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
            <Link 
              to="/equipment-list" 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/equipment-list' || currentPath === '/' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <span className="whitespace-nowrap">View Gym Equipment</span>
            </Link>
            
            <Link 
              to="/maintenance-list" 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/maintenance-list' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="whitespace-nowrap">Maintenance</span>
            </Link>
            <Link 
              to="/maintenance-cost" 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/maintenance-cost' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="whitespace-nowrap">Maintenance Cost</span>
            </Link>
            <Link 
              to="/tickets" 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/tickets' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
              </svg>
              <span className="whitespace-nowrap">View Tickets</span>
              {!ticketCountLoading && openTicketCount > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-xs font-medium rounded-full min-w-[1.25rem] text-center ${
                  currentPath === '/tickets' 
                    ? 'bg-white text-rose-700' 
                    : 'bg-rose-500 text-black'
                }`}>
                  {openTicketCount}
                </span>
              )}
            </Link>
            <Link 
              to="/raise-ticket" 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/raise-ticket' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="whitespace-nowrap">Raise Ticket</span>
            </Link>
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 pb-8 md:pb-12 relative mt-4 md:mt-6">
        <div className="absolute inset-0 gym-equipment-pattern opacity-5 pointer-events-none"></div>
        <div className="glass-effect rounded-xl p-2 sm:p-4">
          <Routes>
            <Route path="/equipment-list" element={<EquipmentList />} />
            <Route path="/add-equipment" element={<AddEquipmentForm />} />
            <Route path="/maintenance-list" element={<div>{<MaintenanceScheduleList />}</div>} />
            <Route path="/maintenance-add" element={<div>{<MaintenanceScheduleAdd />}</div>} />
            <Route path="/maintenance-cost" element={<div>{<MonthlyCostViewer />}</div>} />
            <Route path="/tickets" element={<div>{<TicketList />}</div>} />
            <Route path="/raise-ticket" element={<div>{<AddTicketForm />}</div>} />
            <Route path="/" element={<Navigate to="/equipment-list" replace />} />
            <Route path="*" element={
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-12 mt-4 md:mt-6 text-center relative backdrop-blur-sm">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-rose-50 p-3 md:p-5 rounded-full mb-3 md:mb-5 shadow-inner">
                    <svg className="w-10 h-10 md:w-16 md:h-16 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Page Not Found</h2>
                  <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">The page you are looking for doesn't exist or has been moved. Let's get you back on track.</p>
                  <Link 
                    to="/equipment-list" 
                    className="px-5 md:px-7 py-2.5 md:py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-lg font-medium hover:from-rose-700 hover:to-rose-600 transition-all duration-300 flex items-center shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      
      <style>
        {`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .bg-pattern-light {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .gym-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 30a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 60a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm60-55a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 60a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM59 29h2v2h-2v-2zm0 60h2v2h-2v-2zM29 59h2v2h-2v-2zm60 0h2v2h-2v-2zm-59 4h60v2H30v-2z'/%3E%3C/g%3E%3C/svg%3E");
        }
        
        .gym-equipment-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M25 15h5v90h-5zM90 15h5v90h-5zM15 55h90v10H15zM42 30c0-2.8 2.2-5 5-5s5 2.2 5 5v60c0 2.8-2.2 5-5 5s-5-2.2-5-5V30zM68 30c0-2.8 2.2-5 5-5s5 2.2 5 5v60c0 2.8-2.2-5-5-5s-5-2.2-5-5V30z'/%3E%3Cpath d='M10 10h10v10H10zM100 10h10v10h-10zM10 100h10v10H10zM100 100h10v10h-10z'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 80px 80px;
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 5px 2px rgba(244, 63, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 20px 5px rgba(244, 63, 94, 0.6);
          }
        }
        
        .pulse-glow {
          animation: pulseGlow 2s infinite;
        }
        
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
        
        .btn-3d {
          transform: translateY(0);
          transition: transform 0.2s;
          box-shadow: 0 4px 0 0 rgba(157, 23, 77, 1);
        }
        
        .btn-3d:active {
          transform: translateY(4px);
          box-shadow: 0 0 0 0 rgba(157, 23, 77, 1);
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .neu-convex {
          background: linear-gradient(145deg, #e2e8ec, #ffffff);
          box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
        }
        
        .neu-concave {
          background: linear-gradient(145deg, #ffffff, #e2e8ec);
          box-shadow: inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff;
        }
        
        @media (max-width: 640px) {
          .glass-effect {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .neu-convex {
            box-shadow: 3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff;
          }
        }
      `}
      </style>
    </div>
  );
};

export default Index;