import React from 'react';

const LoadingSkeleton = ({ itemsCount = 10 }) => {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded-md mb-4 w-3/4"></div>
      <div className="space-y-3">
        {[...Array(itemsCount)].map((_, i) => (
          <div key={i} className="grid grid-cols-8 gap-4">
            {[...Array(8)].map((_, j) => (
              <div key={j} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
