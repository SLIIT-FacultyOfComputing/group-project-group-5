import React from 'react';
import StatusBadge from './StatusBadge';

const TableView = ({ 
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
    <table className="w-full text-sm text-left text-gray-700">
      <thead className="text-xs text-white uppercase bg-gradient-to-r from-rose-700 to-rose-600 shadow-sm">
        <tr>
          <th className="px-6 py-4 font-semibold">ID</th>
          <th className="px-6 py-4 font-semibold">Name</th>
          <th className="px-6 py-4 font-semibold">Category</th>
          <th className="px-6 py-4 font-semibold">Status</th>
          <th className="px-6 py-4 font-semibold">Purchase Date</th>
          <th className="px-6 py-4 font-semibold">Last Maintenance</th>
          <th className="px-6 py-4 font-semibold">Warranty Expiry</th>
          <th className="px-6 py-4 font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {displayEquipment.map((item, index) => (
          <tr key={item.id} className={`border-b hover:bg-rose-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
            <td className="px-6 py-4 font-medium">{item.name}</td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {item.category}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex flex-col gap-2">
                <StatusBadge status={item.status} />
                <select
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors duration-200 shadow-sm"
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 text-xs flex items-center justify-center"
                  onClick={() => confirmStatusUpdate(item.id)}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Update Status
                </button>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                {item.purchaseDate}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  {item.lastMaintenanceDate || "Not set"}
                </span>
                <input
                  type="date"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors duration-200 shadow-sm"
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 text-xs flex items-center justify-center"
                  onClick={() => confirmMaintenanceUpdate(item.id)}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Update Date
                </button>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                {item.warrantyExpiry}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                className="px-4 py-2 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 focus:ring-4 focus:ring-rose-300 transition-all duration-200 text-xs flex items-center justify-center"
                onClick={() => {
                  setModalAction("delete");
                  openDeleteModal(item.id);
                }}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableView;