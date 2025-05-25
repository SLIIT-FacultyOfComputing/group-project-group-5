import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from "../../components/member_header";
import Footer from "../../components/Member_Footer";
import MemberDashboard from '../../components/MemberDashboard';
import MemberRoutines from '../../components/MemberRoutines';
import SessionLog from '../../components/SessionLog';
import ViewRoutine from '../../components/ViewRoutine';
import QRCodePage from './QRCode';
import QRScanner from './QRScanner';
import TicketsViewerPage from '../Tickets/TicketsViewerPage';
import MemberProfile from '../Profile/MemberProfile';
import BookAppointment from '../Appointments/MBookAppointment';
import MyAppointmentsView from '../Appointments/MyAppointmentsView';
import axios from 'axios';

const MemberPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [memberId, setMemberId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedMemberId = localStorage.getItem('userId');
      if (!token || !storedMemberId) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8090/api/members/${storedMemberId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const memberId = response.data.id;
        setMemberId(memberId);
        
        if (location.pathname === '/members') {
          navigate(`/members/dashboard/${memberId}`);
        }
      } catch (error) {
        console.error('Error fetching member profile:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

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

  if (!memberId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header scrolled={scrolled} />
      
      <div className="flex-grow container mx-auto px-3 sm:px-4 md:px-6 mt-4 md:mt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
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
          
          <nav className={`flex flex-col md:flex-row ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
            <Link 
              to={`/members/dashboard/${memberId}`} 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath.startsWith(`/members/dashboard/`) 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span className="whitespace-nowrap">Dashboard</span>
            </Link>
            <Link 
              to={`/members/workouts/${memberId}`} 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath.startsWith('/members/workouts') 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span className="whitespace-nowrap">Workout Plans</span>
            </Link>
            <Link 
              to={`/members/qrcode/${memberId}`} 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath.startsWith('/members/qrcode') 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
              <span className="whitespace-nowrap">QR Code</span>
            </Link>
            <Link 
              to={`/members/my-appointments`} 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath.startsWith('/members/my-appointments') 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              <span className="whitespace-nowrap">My Appointments</span>
            </Link>
            <Link 
              to={`/members/ticket`} 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath.startsWith('/members/ticket') 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
              </svg>
              <span className="whitespace-nowrap">Ticket</span>
            </Link>
          </nav>          <div className="p-4 sm:p-6">
            <Routes>
              <Route path="/dashboard/:id" element={<MemberDashboard />} />
              <Route path="/workouts/:id" element={<MemberRoutines />} />
              <Route path="/session/:routineId" element={<SessionLog />} />
              <Route path="/view-routine/:routineId" element={<ViewRoutine />} />
              <Route path="/qrcode/:id" element={<QRCodePage />} />
              <Route path="/scanner" element={<QRScanner />} />              <Route path="/ticket" element={<TicketsViewerPage />} />
              <Route path="/profile" element={<MemberProfile />} />
              <Route path="/my-appointments/book-appointment" element={<BookAppointment />} />
              <Route path="/my-appointments" element={<MyAppointmentsView />} />
              <Route path="/" element={<Navigate to={`/members/dashboard/${memberId}`} replace />} />
              <Route
                path="*"
                element={
                  <div className="bg-white rounded-xl shadow-lg p-6 md:p-12 mt-4 md:mt-6 text-center relative backdrop-blur-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Page Not Found</h2>
                    <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
                      The page you are looking for doesn't exist or has been moved.
                    </p>
                    <Link
                      to={`/members/dashboard/${memberId}`}
                      className="inline-flex items-center px-5 md:px-7 py-2.5 md:py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-lg font-medium hover:from-rose-700 hover:to-rose-600 transition-all duration-300 shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
                    >
                      Return to Dashboard
                    </Link>
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </div>

      <Footer memberId={memberId} />
    </div>
  );
};

export default MemberPage; 