import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  indexOfFirstItem, 
  indexOfLastItem, 
  totalItems,
  onPageChange 
}) => {
  return (
    <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
      <div className="text-sm text-gray-600 mb-4 md:mb-0">
        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} items
      </div>
      <div className="flex space-x-2">
        {/* Previous Button */}
        <button 
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5'
          }`}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </span>
        </button>
        
        {/* Page Number Buttons */}
        <div className="hidden md:flex space-x-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={i}
                onClick={() => onPageChange(pageNum)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === pageNum 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } transition-all duration-300 transform ${
                  currentPage === pageNum ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        {/* Next Button */}
        <button 
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5'
          }`}
        >
          <span className="flex items-center">
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;