import React from 'react';

const ErrorMessage = ({ message }) => (
  <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200 animate-scaleIn flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    {message}
  </div>
);

export default ErrorMessage;