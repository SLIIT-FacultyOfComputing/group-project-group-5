import React, { useState } from 'react';
import PropTypes from 'prop-types';


const FilterPanel = ({ 
  onApplyFilters, 
  initialFilters = {}, 
  equipmentIds = [],
  maintenanceTypes = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    status: initialFilters.status || 'ALL',
    type: initialFilters.type || 'ALL',
    equipmentId: initialFilters.equipmentId || 'ALL'
  });
  
  const statusOptions = ['ALL', 'SCHEDULED', 'INPROGRESS', 'COMPLETED', 'CANCELED'];
  
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const applyFilters = () => {
    onApplyFilters(filters);
  };
  
  const resetFilters = () => {
    setFilters({
      status: 'ALL',
      type: 'ALL',
      equipmentId: 'ALL'
    });
    onApplyFilters({
      status: 'ALL',
      type: 'ALL',
      equipmentId: 'ALL'
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Advanced Filters
        </h3>
        <button 
          className="text-blue-500 hover:text-blue-700 transition-colors duration-200 flex items-center text-sm font-medium"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <span>Collapse</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Expand</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => (
                <button
                  key={status}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200
                    ${filters.status === status ? 
                      status === 'ALL' ? 'bg-gray-700 text-white' :
                      status === 'SCHEDULED' ? 'bg-blue-600 text-white' :
                      status === 'INPROGRESS' ? 'bg-yellow-600 text-white' :
                      status === 'COMPLETED' ? 'bg-green-600 text-white' :
                      'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => handleFilterChange('status', status)}
                >
                  {status === 'ALL' ? 'All Statuses' : 
                   status === 'INPROGRESS' ? 'In Progress' : 
                   status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="ALL">All Types</option>
              {maintenanceTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment ID</label>
            <select
              value={filters.equipmentId}
              onChange={(e) => handleFilterChange('equipmentId', e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="ALL">All Equipment</option>
              {equipmentIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {isExpanded && (
        <div className="mt-5 flex justify-end space-x-3">
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset All
          </button>
          <button
            onClick={applyFilters}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

FilterPanel.propTypes = {
  onApplyFilters: PropTypes.func.isRequired,
  initialFilters: PropTypes.object,
  equipmentIds: PropTypes.array,
  maintenanceTypes: PropTypes.array
};

export default FilterPanel;