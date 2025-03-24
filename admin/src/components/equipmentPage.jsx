import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import EquipmentList from "./Equipment/EquipmentList";
import AddEquipmentForm from "./Equipment/AddEquipmentForm";

const EquipmentPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for header
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
      {/* Modern Gym-themed Header with Dynamic Gradient */}
      <header className={`bg-gradient-to-r from-rose-800 to-rose-600 shadow-xl py-5 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 shadow-lg' : 'py-5'
      }`}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 gym-pattern"></div>
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Enhanced Header Logo with 3D effect */}
              <div className="bg-rose-900 bg-opacity-40 p-2.5 rounded-lg shadow-lg mr-4 transform hover:rotate-3 transition-transform duration-300 btn-3d">
                <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76zm-1.41-1.41L11.5 18H5v-6.5l6.76-6.76a4 4 0 0 1 5.66 5.66l-2.83 2.83"></path>
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-tight">MANSA GYM</h1>
                <span className="text-rose-100 text-xs md:text-sm tracking-wider font-medium">Equipment Management System</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {/* Fixed System Active Button - Enhanced with better glow effect and animation */}
              <span className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-r from-rose-900 to-rose-800 rounded-full text-xs font-medium text-white shadow-lg border border-rose-500 border-opacity-40 pulse-border hover:from-rose-800 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2 shadow-lg animate-pulse ring-2 ring-green-400 ring-opacity-50 group-hover:ring-opacity-70 transition-all duration-300"></span>
                <span className="relative">
                  System Active
                  <span className="absolute inset-0 bg-gradient-to-r from-white to-transparent bg-clip-text blur-sm opacity-50 animate-pulse-slow"></span>
                </span>
              </span>
              <div className="relative">
                <button className="flex items-center text-rose-100 hover:text-white transition-colors p-2 bg-rose-800 bg-opacity-40 rounded-full hover:bg-opacity-60">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Enhanced Navigation Tabs */}
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
          </nav>
        </div>
      </div>
      
      {/* Enhanced Content Area with Gym Background */}
      <div className="container mx-auto px-6 pb-12 relative mt-6">
        <div className="absolute inset-0 gym-equipment-pattern opacity-5 pointer-events-none"></div>
        <div className="glass-effect rounded-xl p-4">
          <Routes>
            <Route path="/equipment-list" element={<EquipmentList />} />
            <Route path="/add-equipment" element={<AddEquipmentForm />} />
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
      
      {/* Modern Gym-themed Footer */}
      <footer className="bg-gradient-to-r from-rose-900 to-rose-800 py-12 text-center text-sm text-rose-100 relative mt-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 gym-pattern"></div>
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center mb-3">
                <div className="bg-rose-700 bg-opacity-40 p-1.5 rounded-lg shadow-md mr-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-white font-semibold">About MANSA GYM</h3>
              </div>
              <p className="text-rose-200 text-xs leading-relaxed">
                MANSA GYM Equipment Management System provides comprehensive tools for tracking and managing gym equipment inventory, maintenance schedules, and usage statistics.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-3">
                <div className="bg-rose-700 bg-opacity-40 p-1.5 rounded-lg shadow-md mr-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                </div>
                <h3 className="text-white font-semibold">Quick Links</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/equipment-list" className="text-rose-200 hover:text-white transition-colors duration-200 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  View Equipment
                </Link>
                <Link to="/add-equipment" className="text-rose-200 hover:text-white transition-colors duration-200 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Add Equipment
                </Link>
                <Link to="/maintenance" className="text-rose-200 hover:text-white transition-colors duration-200 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Maintenance
                </Link>
                <Link to="/reports" className="text-rose-200 hover:text-white transition-colors duration-200 text-xs flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Reports
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-center mb-3">
                <div className="bg-rose-700 bg-opacity-40 p-1.5 rounded-lg shadow-md mr-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-white font-semibold">Contact Us</h3>
              </div>
              <p className="text-rose-200 text-xs">support@mansagym.com</p>
              <p className="text-rose-200 text-xs mt-1">+1 (555) 123-4567</p>
              {/* Enhanced Footer Social Media Links */}
              <div className="flex space-x-3 mt-4">
                <a href="#" className="bg-rose-800 bg-opacity-40 p-2 rounded-full hover:bg-opacity-60 transition-all duration-300 cursor-pointer transform hover:scale-110 hover:rotate-6 pulse-glow">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="bg-rose-800 bg-opacity-40 p-2 rounded-full hover:bg-opacity-60 transition-colors duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.014-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
                <a href="#" className="bg-rose-800 bg-opacity-40 p-2 rounded-full hover:bg-opacity-60 transition-colors duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-rose-700 border-opacity-50 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm">
              <svg className="w-5 h-5 mr-2 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>MANSA GYM Equipment Management &copy; {new Date().getFullYear()}</span>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="bg-rose-800 bg-opacity-40 px-3 py-1 rounded-full text-xs">Version 1.2.0</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Enhanced CSS for gym-themed background patterns */}
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