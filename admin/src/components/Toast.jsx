import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const bgColor = 
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md text-white shadow-lg ${bgColor} flex justify-between items-center min-w-[300px]`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white">×</button>
    </div>
  );
};

export default Toast;