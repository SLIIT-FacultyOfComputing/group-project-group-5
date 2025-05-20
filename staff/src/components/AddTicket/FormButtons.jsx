import React from 'react';
import { Link } from 'react-router-dom';

const FormButtons = ({ isSubmitting }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
      <Link 
        to="/staff/tickets" 
        className="px-4 py-2 sm:px-5 sm:py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200 flex items-center justify-center"
      >
        Cancel
      </Link>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`flex items-center justify-center rounded-lg px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium shadow-sm transition-all duration-200 
          ${isSubmitting ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'} 
          text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2`}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            Create Ticket
            <svg className="ml-2 -mr-0.5 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default FormButtons;
