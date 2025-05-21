import React from 'react';
import StatusBadge from './StatusBadge';

const TableView = ({ displayEquipment }) => {
  return (
    <table className="w-full text-sm text-left text-gray-700">
      <thead className="text-xs text-white uppercase bg-gradient-to-r from-rose-700 to-rose-600 shadow-sm">
        <tr>
          <th className="px-6 py-4 font-semibold">Name</th>
          <th className="px-6 py-4 font-semibold">Type</th>
          <th className="px-6 py-4 font-semibold">Status</th>
          <th className="px-6 py-4 font-semibold">Date Added</th>
          <th className="px-6 py-4 font-semibold">Last Maintenance</th>
          <th className="px-6 py-4 font-semibold">Next Maintenance</th>
        </tr>
      </thead>
      <tbody>
        {displayEquipment.map((item, index) => (
          <tr key={item.id} className={`border-b hover:bg-rose-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
            <td className="px-6 py-4">{item.type}</td>
            <td className="px-6 py-4">
              <StatusBadge status={item.status} />
            </td>
            <td className="px-6 py-4">
              {item.dateAdded 
                ? new Date(item.dateAdded).toLocaleDateString() 
                : (item.createdAt 
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "Not recorded")}
            </td>
            <td className="px-6 py-4">
              {item.lastMaintenanceDate
                ? new Date(item.lastMaintenanceDate).toLocaleDateString()
                : "Not recorded"}
            </td>
            <td className="px-6 py-4">
              {item.nextMaintenanceDate
                ? new Date(item.nextMaintenanceDate).toLocaleDateString()
                : "Not scheduled"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableView;