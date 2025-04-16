import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from "../../components/header";
import Footer from "../../components/Footer";
import MemberDashboard from '../../components/MemberDashboard';
import WorkoutPlans from './WorkoutPlans';
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
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8090/api/members/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMemberId(response.data.id);
      } catch (error) {
        console.error('Error fetching member profile:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

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
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header scrolled={scrolled} />
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 mt-4 md:mt-6">
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
                currentPath === `/members/dashboard/${memberId}` 
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
              to="/members/workouts" 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/members/workouts' 
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
          </nav>

          <div className="p-4 sm:p-6">
            <Routes>
              <Route path="/dashboard/:id" element={<MemberDashboard />} />
              <Route path="/workouts" element={<WorkoutPlans />} />
              <Route path="/" element={<Navigate to={`/members/dashboard/${memberId}`} replace />} />
            </Routes>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MemberPage; 