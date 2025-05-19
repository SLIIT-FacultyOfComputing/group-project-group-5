import React from 'react';

const EmptyState = () => {
  return (
    <div className="bg-white p-8 text-center rounded-md animate-scaleIn">
      <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
      </svg>
      <h3 className="mt-6 text-xl font-medium text-gray-900">No maintenance schedules found</h3>            
    </div>
  );
};

export default EmptyState;
