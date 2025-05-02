import React from 'react';

const StatusBadge = ({ status }) => {
  const safeStatus = status || 'UNKNOWN';
  
  const styles = {
    OPEN: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 0h4m-4 0H8m4 0v4" />
        </svg>
      ),
    },
    IN_PROGRESS: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
        </svg>
      ),
    },
    RESOLVED: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    CLOSED: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    UNKNOWN: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
  };

  const style = styles[safeStatus] || styles.UNKNOWN;

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border flex items-center ${style.bg} ${style.text} ${style.border}`}>
      {style.icon}
      {safeStatus.replace(/_/g, " ")}
    </span>
  );
};

export default StatusBadge;
