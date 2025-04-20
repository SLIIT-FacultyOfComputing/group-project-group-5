import React, { useEffect, useState } from 'react';

const ProgressIndicator = ({ formStage }) => {
  const [progressValue, setProgressValue] = useState(30);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(formStage === 1 ? 50 : 100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [formStage]);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-700">
          {formStage === 1 ? 'Step 1: Basic Information' : 'Step 2: Additional Details'}
        </div>
        <div className="text-sm text-gray-500">
          {formStage}/2
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressValue}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
        <span className={`text-xs ${formStage >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Basic Info</span>
        <span className={`text-xs ${formStage >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Details</span>
      </div>
    </div>
  );
};

export default ProgressIndicator;