import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-12 mt-4 md:mt-6 text-center relative backdrop-blur-sm">
      <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Access Denied</h2>
      <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
        You don't have permission to access this page. This area is restricted to managers and receptionists.
      </p>
      <Link
        to="/staff/dashboard"
        className="px-5 md:px-7 py-2.5 md:py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-lg font-medium hover:from-rose-700 hover:to-rose-600 transition-all duration-300 flex items-center justify-center max-w-xs mx-auto shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Return to Dashboard
      </Link>
    </div>
  );
};

export default AccessDenied;
