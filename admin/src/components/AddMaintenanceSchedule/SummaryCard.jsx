import React from 'react';

const SummaryCard = ({ formData, equipments }) => {

  const getEquipmentName = () => {
    if (!formData.equipmentId) return 'No equipment selected';
    
    const equipmentId = String(formData.equipmentId);
    const equipment = equipments.find(item => String(item.id) === equipmentId);
    
    return equipment 
      ? `${equipmentId}(${equipment.name})` 
      : `${equipmentId}(Unknown Equipment)`;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">Maintenance Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Equipment:</span>
          <span className="font-medium">{getEquipmentName()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500">Type:</span>
          <span className="font-medium">{formData.maintenanceType}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500">Date:</span>
          <span className="font-medium">{formData.maintenanceDate}</span>
        </div>
        
        
        
        {formData.technician && (
          <div className="flex justify-between">
            <span className="text-gray-500">Technician:</span>
            <span className="font-medium">{formData.technician}</span>
          </div>
        )}
        
        {formData.maintenanceCost && (
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Cost:</span>
            <span className="font-medium">${parseFloat(formData.maintenanceCost).toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;