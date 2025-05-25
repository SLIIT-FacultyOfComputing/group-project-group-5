import React from 'react';
import StatusBadge from './StatusBadge';

const CardView = ({ 
  displayEquipment, 
  itemUpdates, 
  handleInputChange, 
  confirmStatusUpdate,
  confirmMaintenanceUpdate,
  formatDateForInput,
  setModalAction,
  openDeleteModal 
}) => {
  return (
    <div className="space-y-4">
      {displayEquipment.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-medium text-gray-500">ID: {item.id}</span>
            <StatusBadge status={item.status} />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {item.category}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Purchase Date:</span>
              <span className="text-sm text-gray-600">{item.purchaseDate}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Warranty Expiry:</span>
              <span className="text-sm text-gray-600">{item.warrantyExpiry}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Last Maintenance:</span>
              <span className="text-sm text-gray-600">{item.lastMaintenanceDate || "Not set"}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Status:</p>
            <select
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors duration-200 shadow-sm w-full mb-2"
              value={itemUpdates[item.id]?.status || item.status}
              onChange={(e) =>
                handleInputChange(item.id, "status", e.target.value)
              }
            >
              <option value="AVAILABLE" className="text-gray-900">Available</option>
              <option value="UNAVAILABLE" className="text-gray-900">Unavailable</option>
              <option value="UNDER_MAINTENANCE" className="text-gray-900">Under Maintenance</option>
              <option value="OUT_OF_ORDER" className="text-gray-900">Out of Order</option>
            </select>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 text-xs flex items-center justify-center w-full"
              onClick={() => confirmStatusUpdate(item.id)}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Update Status
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Maintenance Date:</p>
            <input
              type="date"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors duration-200 shadow-sm w-full mb-2"
              value={
                itemUpdates[item.id]?.maintenanceDate ||
                formatDateForInput(item.lastMaintenanceDate) ||
                ""
              }
              onChange={(e) =>
                handleInputChange(item.id, "maintenanceDate", e.target.value)
              }
            />
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 text-xs flex items-center justify-center w-full"
              onClick={() => confirmMaintenanceUpdate(item.id)}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Update Date
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              className="px-4 py-2 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 focus:ring-4 focus:ring-rose-300 transition-all duration-200 text-xs flex items-center justify-center w-full"
              onClick={() => {
                setModalAction("delete");
                openDeleteModal(item.id);
              }}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Equipment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;