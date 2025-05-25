import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from "../components/header";
import Footer from "../components/Footer";

const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [userRole, setUserRole] = useState('guest'); // 'guest', 'member', or 'admin'

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

  // Mock user role - replace with actual authentication logic
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = isLoggedIn ? localStorage.getItem('userRole') : 'guest';
    setUserRole(role);
  }, []);

  const renderContent = () => {
    switch (userRole) {
      case 'admin':
        return (
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Welcome, <span className="text-rose-500">Admin</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Manage your gym with ease
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/equipment/equipment-list"
                className="px-8 py-4 bg-gradient-to-r from-rose-700 to-rose-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:from-rose-600 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Manage Equipment
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-lg border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Register Member
              </Link>
            </div>
          </div>
        );

      case 'member':
        return (
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Welcome back, <span className="text-rose-500">Member</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Track your fitness journey
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/members"
                className="px-8 py-4 bg-gradient-to-r from-rose-700 to-rose-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:from-rose-600 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                View Dashboard
              </Link>
              <Link
                to="/members/profile"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-lg border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                My Profile
              </Link>
              <Link
                to="/members/raise-ticket"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-lg border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Raise Ticket
              </Link>
            </div>
          </div>
        );

      default: // guest
        return (
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Welcome to <span className="text-rose-500">GYMSYNC</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Your Ultimate Gym Management Solution
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-rose-700 to-rose-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:from-rose-600 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-lg border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Register
              </Link>
            </div>
          </div>
        );
    }
  };

  const renderStatsSection = () => {
    if (userRole === 'guest') {
      return (
        <section className="py-20 bg-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="text-4xl font-bold text-rose-500 mb-2">150+</div>
                <div className="text-gray-200">Active Members</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="text-4xl font-bold text-rose-500 mb-2">24/7</div>
                <div className="text-gray-200">Access</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="text-4xl font-bold text-rose-500 mb-2">50+</div>
                <div className="text-gray-200">Classes Weekly</div>
              </div>
            </div>
          </div>
        </section>
      );
    } else if (userRole === 'admin') {
      return (
        <section className="py-20 bg-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="text-4xl font-bold text-rose-500 mb-2">150+</div>
                <div className="text-gray-200">Active Members</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="text-4xl font-bold text-rose-500 mb-2">$15K</div>
                <div className="text-gray-200">Monthly Revenue</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="text-4xl font-bold text-rose-500 mb-2">85%</div>
                <div className="text-gray-200">Attendance Rate</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="text-4xl font-bold text-rose-500 mb-2">12</div>
                <div className="text-gray-200">New Members This Week</div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return null;
  };

  const renderFeaturesSection = () => {
    if (userRole === 'guest') {
      return (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose GYMSYNC?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Member Management</h3>
                <p className="text-gray-300">Easy registration and profile management for all members.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">QR Code Access</h3>
                <p className="text-gray-300">Quick and secure access to the gym using your unique QR code.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Workout Plans</h3>
                <p className="text-gray-300">Personalized workout plans tailored to your fitness goals.</p>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/videos/gym-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      <Header scrolled={scrolled} />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6">
          {renderContent()}
        </section>

        {/* Stats Section */}
        {renderStatsSection()}

        {/* Features Section */}
        {renderFeaturesSection()}

        {/* Admin/Staff Login Button */}
        <div className="text-center py-4">
          <Link
            to="/admin/login"
            className="inline-block px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Admin Login
          </Link>
          
          <Link
            to="/staff/login"
            className="inline-block px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Staff Login
          </Link>
        </div>

        
      </main>

      <Footer />
    </div>
  );
};

export default HomePage; 