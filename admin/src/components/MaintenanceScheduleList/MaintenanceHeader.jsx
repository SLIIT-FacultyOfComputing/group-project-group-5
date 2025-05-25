import React from 'react';
import { Link } from 'react-router-dom';
import ActionButton from '../ActionButton';

const MaintenanceHeader = ({ schedulesCount, onRefresh }) => {
  return (
    <div className="bg-gradient-to-r from-rose-700 to-rose-600 text-white p-4 rounded-lg shadow-xl mb-4 flex justify-between items-center relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 gym-pattern"></div>
      </div>
      
      <div className="flex items-center relative z-10">
        <div className="bg-white bg-opacity-40 p-1.5 sm:p-2.5 rounded-lg shadow-lg mr-2 sm:mr-4">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-tight">
            Maintenance Schedules
          </h2>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 relative z-10">
        <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-white border-opacity-20 w-full sm:w-auto justify-center sm:justify-start">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-black opacity-80 mr-1 sm:mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            ></path>
          </svg>
          <span className="text-black font-medium text-xs sm:text-sm whitespace-nowrap">
            Total: {schedulesCount} schedules
          </span>
        </div>
        
        <Link to="/admin/maintenance-add" className="w-full sm:w-auto">
          <ActionButton
            onClick={() => {}}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>}
            label="Add Schedule"
            color="green"
            fullWidth={true}
            className="w-full sm:w-auto"
          />
        </Link>
      </div>
    </div>
  );
};

export default MaintenanceHeader;
