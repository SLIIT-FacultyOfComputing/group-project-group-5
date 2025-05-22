import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name || '');
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <header
      className={`bg-gradient-to-r from-rose-800 to-rose-600 shadow-xl sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 sm:py-3 shadow-lg' : 'py-3 sm:py-5'
      }`}
    >
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
              <span className="text-rose-100 text-xs md:text-sm tracking-wider font-medium hidden xs:block">
                Member Portal
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {userName && (
              <div className="flex items-center bg-rose-900 bg-opacity-40 rounded-lg px-3 py-1.5 text-white">
                <span className="text-sm">Welcome, {userName}</span>
              </div>
            )}
            <div className="relative">
              <button 
                onClick={() => setUserProfileOpen(!userProfileOpen)}
                className="flex items-center space-x-1 text-rose-100 hover:text-white transition-colors p-2 bg-rose-800 bg-opacity-40 rounded-lg hover:bg-opacity-60"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Profile</span>
              </button>
              
              {userProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link 
                    to="/members/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserProfileOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-2 focus:outline-none focus:ring-2 focus:ring-rose-300 rounded-md"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={`${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden transition-all duration-300 ease-in-out mt-2`}>
          <div className="bg-rose-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 my-1 transition-all">
            {userName && (
              <div className="flex flex-col py-2 border-b border-rose-700 border-opacity-50">
                <span className="text-white text-sm">Welcome, {userName}</span>
              </div>
            )}
            <div className="py-2">
              <Link
                to="/members/profile"
                className="flex w-full items-center py-2 text-rose-100 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center py-2 text-rose-100 hover:text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;