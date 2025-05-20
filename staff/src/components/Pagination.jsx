import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems
}) => {
  const pageNumbers = [];
  
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4 && totalPages > 5) {
    startPage = Math.max(1, endPage - 4);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  const itemsPerPage = 10;
  
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center">
        <span className="text-sm text-gray-600 mr-3 hidden sm:inline">
          Showing {totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0}-
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </span>
        
        <nav className="flex items-center space-x-1" aria-label="Pagination">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-2 py-1 border border-gray-300 text-sm rounded-md ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-label="Previous page"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 relative inline-flex items-center px-2 py-1 text-sm rounded-md"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-500">...</span>}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`relative inline-flex items-center px-3 py-1 border text-sm ${
                currentPage === number
                  ? 'bg-rose-600 text-white border-rose-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } rounded-md`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 relative inline-flex items-center px-2 py-1 text-sm rounded-md"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`inline-flex items-center px-2 py-1 border border-gray-300 text-sm rounded-md ${
              currentPage === totalPages || totalPages === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-label="Next page"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;