import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StatusTimeline from './StatusTimeline';

const ExpandableTableRow = ({ schedule, onDelete, onView, onEdit, children }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <>
      <tr 
        className={`hover:bg-blue-50 transition-colors duration-200 ${expanded ? 'bg-blue-50 border-b-0' : ''}`}
      >
        {children}
        <td className="p-3 border text-center">
          <div className="flex space-x-1 justify-center">
            <button
              onClick={() => onDelete(schedule.scheduleId)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300 flex items-center justify-center focus:ring-2 focus:ring-red-300 shadow-sm hover:shadow transform hover:scale-105"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={() => onView(schedule.scheduleId)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center focus:ring-2 focus:ring-blue-300 shadow-sm hover:shadow transform hover:scale-105"
              title="View Details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`${expanded ? 'bg-indigo-600' : 'bg-gray-500'} text-white p-2 rounded-full hover:bg-indigo-600 transition-colors duration-300 flex items-center justify-center focus:ring-2 focus:ring-indigo-300 shadow-sm hover:shadow transform hover:scale-105`}
              title={expanded ? "Collapse" : "Expand"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-blue-50 animate-slideInDown">
          <td colSpan="9" className="p-4 border-t-0 border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Maintenance Details</h4>
                
                <div className="mt-2">
                  <StatusTimeline currentStatus={schedule.status} />
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Equipment Information</h5>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Equipment ID:</span>
                      <span className="font-medium ml-2 text-gray-800">{schedule.equipmentId}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Maintenance Type:</span>
                      <span className="font-medium ml-2 text-gray-800">{schedule.maintenanceType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium ml-2 text-gray-800">
                        {new Date(schedule.maintenanceDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Cost:</span>
                      <span className="font-medium ml-2 text-gray-800">
                        ${parseFloat(schedule.maintenanceCost).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800">Technician</h4>
                  <button
                    onClick={() => onEdit('technician', schedule.scheduleId)}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center mr-4 text-lg font-medium">
                    {schedule.technician.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">{schedule.technician}</h5>
                    <p className="text-sm text-gray-500">Maintenance Technician</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800">Description</h4>
                  <button
                    onClick={() => onEdit('description', schedule.scheduleId)}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700 text-sm">{schedule.maintenanceDescription}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => onView(schedule.scheduleId)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Full Details
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

ExpandableTableRow.propTypes = {
  schedule: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default ExpandableTableRow;