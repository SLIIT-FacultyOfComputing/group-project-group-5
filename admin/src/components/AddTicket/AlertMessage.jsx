import React from 'react';

const AlertMessage = ({ type, message }) => {
  if (!message) return null;
  
  const isError = type === 'error';
  
  return (
    <div className={`${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'} 
      p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 flex flex-col xs:flex-row items-start xs:items-center shadow-sm animate-fadeIn border`}>
      <div className={`rounded-full ${isError ? 'bg-red-100' : 'bg-green-100'} p-1.5 sm:p-2 mb-2 xs:mb-0 mr-0 xs:mr-3 flex-shrink-0`}>
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d={isError 
            ? "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
            : "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"}
            clipRule="evenodd"></path>
        </svg>
      </div>
      <div>
        <h3 className="font-medium">{isError ? 'Error' : 'Success'}</h3>
        <p className="text-xs sm:text-sm text-black-600">{message}</p>
      </div>
    </div>
  );
};

export default AlertMessage;
