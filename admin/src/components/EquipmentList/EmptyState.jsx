import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ searchNotFound = false }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 rounded-full p-5 mb-4">
        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {searchNotFound ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          )}
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchNotFound ? 'No matching equipment found' : 'No equipment found'}
      </h3>
      
      <p className="text-gray-500 mb-6">
        {searchNotFound
          ? 'Try adjusting your search or filter criteria.'
          : 'Start by adding new gym equipment to your inventory.'}
      </p>
      
      {!searchNotFound && (
        <Link 
          to="/admin/dashboard/add-equipment"
          className="px-5 py-2.5 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 transition-colors duration-300 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add New Equipment
        </Link>
      )}
    </div>
  );
};

export default EmptyState;