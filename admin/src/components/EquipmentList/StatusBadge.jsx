import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    AVAILABLE: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    UNAVAILABLE: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    UNDER_MAINTENANCE: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    OUT_OF_ORDER: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  };

  const style = styles[status] || styles.UNAVAILABLE;

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border flex items-center ${style.bg} ${style.text} ${style.border}`}>
      {style.icon}
      {status.replace(/_/g, " ")}
    </span>
  );
};

export default StatusBadge;