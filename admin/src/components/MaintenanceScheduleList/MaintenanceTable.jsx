import React from 'react';
import ExpandableTableRow from './ExpandableTableRow';

const MaintenanceTable = ({ columns, currentItems, equipmentData, onDelete, onEdit }) => {
  const isEquipmentDeleted = (equipmentId) => {
    if (!equipmentData || !Array.isArray(equipmentData)) return false;
    const equipment = equipmentData.find(item => item.id === equipmentId);
    return equipment && equipment.deleted === true;
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-rose-700 to-rose-600 shadow-sm">
              <tr>
                {columns.map((column, idx) => (
                  <th 
                    key={idx}
                    className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-semibold text-left whitespace-nowrap"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((schedule, index) => (
                <ExpandableTableRow
                  key={schedule.scheduleId}
                  schedule={schedule}
                  onDelete={onDelete}
                  index={index}                    
                  onEdit={(field, id) => onEdit(field, id)}
                  equipmentData={equipmentData}
                >
                  <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-sm sm:text-base">{equipmentData.find(e => e.id === schedule.equipmentId)?.name || 'Unknown'}</span>
                      {!isEquipmentDeleted(schedule.equipmentId) && (
                        <span className="text-xs text-gray-500">ID: {schedule.equipmentId}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                    <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {schedule.maintenanceType}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs sm:text-sm">{new Date(schedule.maintenanceDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
                    <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-medium ${
                      schedule.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                      schedule.status === 'INPROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                      schedule.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </td>
                </ExpandableTableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTable;
