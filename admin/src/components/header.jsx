import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Header = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };  const handleLogout = async () => {
    // First log the user out and wait for it to complete
    await authService.logoutAdmin();
    
    // Force a page reload by using window.location instead of navigate
    window.location.href = '/admin/login';
  };

  return (
    <header
      className={`bg-gradient-to-r from-rose-800 to-rose-600 shadow-xl sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 sm:py-3 shadow-lg' : 'py-3 sm:py-5'
      }`}
    >
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 gym-pattern"></div>
      </div>
      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-rose-900 bg-opacity-40 p-1.5 sm:p-2.5 rounded-lg shadow-lg mr-2 sm:mr-4 transform hover:rotate-3 transition-transform duration-300 btn-3d">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white drop-shadow-md"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76zm-1.41-1.41L11.5 18H5v-6.5l6.76-6.76a4 4 0 0 1 5.66 5.66l-2.83 2.83"
                ></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-tight">
                MANSA GYM
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;