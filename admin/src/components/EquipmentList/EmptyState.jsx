import React from 'react';

const EmptyState = ({ view }) => {
  if (view === "table") {
    return (
      <tbody>
        <tr>
          <td colSpan="8" className="text-center py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray-100 p-5 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No equipment found</h3>
              <p className="text-gray-500 mb-4">Start by adding new gym equipment to your inventory.</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="bg-gray-100 p-5 rounded-full mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No equipment found</h3>
      <p className="text-gray-500 mb-4 text-center">Start by adding new gym equipment to your inventory.</p>
    </div>
  );
};

export default EmptyState;