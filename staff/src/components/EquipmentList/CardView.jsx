import React from 'react';
import StatusBadge from './StatusBadge';

const CardView = ({ displayEquipment }) => {
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
              value={item.status}
              onChange={() => {}}
              disabled
            >
              <option value="AVAILABLE" className="text-gray-900">Available</option>
              <option value="UNAVAILABLE" className="text-gray-900">Unavailable</option>
              <option value="UNDER_MAINTENANCE" className="text-gray-900">Under Maintenance</option>
              <option value="OUT_OF_ORDER" className="text-gray-900">Out of Order</option>
            </select>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Maintenance Date:</p>
            <input
              type="date"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors duration-200 shadow-sm w-full mb-2"
              value={
                item.lastMaintenanceDate ||
                ""
              }
              onChange={() => {}}
              disabled
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;