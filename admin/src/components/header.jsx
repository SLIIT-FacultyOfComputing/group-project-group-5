import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="bg-rose-900 bg-opacity-40 p-1.5 sm:p-2.5 rounded-lg shadow-lg mr-2 sm:mr-4 transform hover:rotate-3 transition-transform duration-300 btn-3d">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76zm-1.41-1.41L11.5 18H5v-6.5l6.76-6.76a4 4 0 0 1 5.66 5.66l-2.83 2.83" ></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-tight">
                MANSA GYM
              </h1>
              <span className="text-rose-100 text-xs md:text-sm tracking-wider font-medium hidden xs:block">
                Equipment Management System
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-r from-rose-900 to-rose-800 rounded-full text-xs font-medium text-white shadow-lg border border-rose-500 border-opacity-40 pulse-border hover:from-rose-800 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2 shadow-lg animate-pulse ring-2 ring-green-400 ring-opacity-50 group-hover:ring-opacity-70 transition-all duration-300"></span>
              <span className="relative">
                System Active
                <span className="absolute inset-0 bg-gradient-to-r from-white to-transparent bg-clip-text blur-sm opacity-50 animate-pulse-slow"></span>
              </span>
            </span>
            <div className="relative">
              <button className="flex items-center text-rose-100 hover:text-white transition-colors p-2 bg-rose-800 bg-opacity-40 rounded-full hover:bg-opacity-60">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu Dropdown */}
        <div className={`${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden transition-all duration-300 ease-in-out mt-2`}>
          <div className="bg-rose-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 my-1 transition-all">
            <div className="flex items-center py-2 border-b border-rose-700 border-opacity-50">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2 shadow-lg animate-pulse"></span>
              <span className="text-rose-100 text-sm">System Active</span>
            </div>
            <div className="py-2">
              <Link to="/profile" className="flex items-center py-2 text-rose-100 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Admin Profile
              </Link>
              <Link to="/settings" className="flex items-center py-2 text-rose-100 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;