import React from 'react';

const EmptyState = ({ resetFilter }) => (
  <div className="text-center py-12 bg-gray-50 rounded-lg animate-scaleIn">
    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
    </svg>
    <h3 className="mt-4 text-xl font-medium text-gray-900">No maintenance costs found</h3>
    <p className="mt-2 text-base text-gray-500">Try changing your search criteria or resetting filters.</p>
    <button
      onClick={resetFilter}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105 active:scale-95 shadow-md"
    >
      View All Data
    </button>
  </div>
);

export default EmptyState;