import React from 'react';

const SummaryCard = ({ formData, equipments, getStatusClass }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
      <h3 className="text-md font-medium text-gray-700 mb-2">Maintenance Summary</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-600">Equipment:</span>
          <span className="ml-1 font-medium">
            {equipments.find(e => e.id === formData.equipmentId)?.name || formData.equipmentId || 'Not selected'}
          </span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-600">Type:</span>
          <span className="ml-1 font-medium">{formData.maintenanceType || 'Not selected'}</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-600">Date:</span>
          <span className="ml-1 font-medium">
            {formData.maintenanceDate ? new Date(formData.maintenanceDate).toLocaleDateString() : 'Not set'}
          </span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
            <path d="M10 4a1 1 0 00-1 1v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 8.586V5a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-600">Status:</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(formData.status)}`}>
            {formData.status}
          </span>
        </div>
      </div>
      
      {/* Add note about automatic cost update */}
      {formData.maintenanceCost > 0 && (
        <div className="mt-3 flex items-start p-2 bg-blue-50 rounded border border-blue-100 text-xs text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
          <span>
            Monthly maintenance cost reports will be automatically updated when this schedule is added.
          </span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;