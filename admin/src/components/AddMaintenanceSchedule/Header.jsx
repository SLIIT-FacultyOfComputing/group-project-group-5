import React from 'react';
import { Link } from 'react-router-dom';
import ActionButton from '../ActionButton';

const Header = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Add Maintenance Schedule</h2>
          <p className="text-gray-600">Create a new maintenance schedule for your equipment</p>
        </div>
        <Link to="/maintenance-list">
          <ActionButton
            onClick={() => {}}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>}
            label="Back to List"
            color="blue"
          />
        </Link>
      </div>
    </div>
  );
};

export default Header;