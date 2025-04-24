import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StatusTimeline from './StatusTimeline';
import ActionButton from '.././ActionButton';

const ExpandableTableRow = ({ schedule, onDelete, onEdit, children, equipmentData, index }) => {
  const [expanded, setExpanded] = useState(false);

  const getEquipmentName = () => {
    if (!equipmentData || !Array.isArray(equipmentData)) return '';
    
    const equipment = equipmentData.find(item => item.id === schedule.equipmentId);
    return equipment ? equipment.name : '';
  };

  const getEquipmentDetails = () => {
    if (!equipmentData || !Array.isArray(equipmentData)) return null;
    
    const equipment = equipmentData.find(item => item.id === schedule.equipmentId);
    return equipment;
  };
  
  const hasEquipmentName = () => {
    const equipment = getEquipmentDetails();
    return equipment && equipment.name;
  };

  const isEquipmentDeleted = () => {
    const equipment = getEquipmentDetails();
    return equipment && equipment.deleted === true;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getStatusBadgeClass = () => {
    switch(schedule.status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'INPROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const processedChildren = React.Children.map(children, child => {
    if (child && child.type === 'td' && child.props.className.includes('px-6 py-4') && 
        child.props.children && child.props.children.type === 'div' && 
        child.props.children.props.className.includes('flex flex-col')) {
      
      if (isEquipmentDeleted()) {
        const childrenContent = child.props.children.props.children;
        const nameElement = Array.isArray(childrenContent) ? 
          childrenContent.find(c => !c.props?.className?.includes('text-xs')) : childrenContent;
        
        return React.cloneElement(child, {}, 
          React.cloneElement(child.props.children, {}, nameElement)
        );
      }
    }
    return child;
  });

  return (
    <>
      <tr 
        className={`border-b hover:bg-rose-50 transition-colors duration-150 ${expanded ? 'bg-rose-50 border-b-0' : ''} ${
          (index % 2 === 0) ? 'bg-white' : 'bg-gray-50'
        }`}
      >
        {processedChildren}
        <td className="px-6 py-4 text-center">
          <button
            onClick={toggleExpand}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 focus:ring-4 focus:ring-rose-300 transition-all duration-200 text-xs flex items-center justify-center"
          >
            {expanded ? (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                Hide Details
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                View Details
              </>
            )}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-white animate-slideInDown">
          <td colSpan="6" className="p-0 border-t-0">
            <div className="border-2 border-gray-300 rounded-lg m-2 overflow-hidden shadow-lg">
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Maintenance Details</h4>
                    
                    {/* Status Section*/}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <h5 className="text-sm font-medium text-gray-700 mr-2">Current Status:</h5>
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeClass()}`}>
                            {schedule.status}
                          </span>
                        </div>
                        {!isEquipmentDeleted() && (
                          <ActionButton 
                            onClick={() => onEdit('status', schedule.scheduleId)}
                            icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>}
                            label="Edit Status"
                            color="blue"
                            size="sm"
                          />
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <StatusTimeline currentStatus={schedule.status} />
                      </div>
                    </div>

                    {/* Equipment Information Section*/}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Equipment Information</h5>
                      
                      {!hasEquipmentName() ? (
                        <div className="py-2 text-center">
                          <p className="text-sm text-gray-500">Equipment details not available</p>
                          <p className="text-xs text-gray-400 mt-1">Equipment ID: {schedule.equipmentId || 'Unknown'}</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {/* Basic Information*/}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm py-2">
                            {!isEquipmentDeleted() && (
                              <div className="flex flex-col">
                                <span className="text-gray-500">Equipment ID:</span>
                                <span className="font-medium text-gray-800 mt-1">{schedule.equipmentId}</span>
                              </div>
                            )}
                            <div className={`flex flex-col ${isEquipmentDeleted() ? 'col-span-2' : ''}`}>
                              <span className="text-gray-500">Equipment Name: </span>
                              <div className="flex items-center mt-1">
                                <span className="font-medium text-gray-800">{getEquipmentName()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Additional Equipment Details */}
                          {(() => {
                            const equipment = getEquipmentDetails();
                            
                            return (
                              <>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm py-2">
                                  <div className="flex flex-col">
                                    <span className="text-gray-500">Category:</span>
                                    <span className="font-medium text-gray-800 mt-1">{equipment.category || 'Not specified'}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-gray-500">Status:</span>
                                    <span className="font-medium text-gray-800 mt-1">
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        equipment.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                        equipment.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                                        equipment.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {equipment.status || 'Unknown'}
                                      </span>
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm py-2">
                                  <div className="flex flex-col">
                                    <span className="text-gray-500">Purchase Date:</span>
                                    <span className="font-medium text-gray-800 mt-1">{formatDate(equipment.purchaseDate)}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-gray-500">Last Maintenance:</span>
                                    <span className="font-medium text-gray-800 mt-1">{formatDate(equipment.lastMaintenanceDate)}</span>
                                  </div>
                                </div>

                                {!equipment.deleted && (
                                  <div className="grid grid-cols-1 gap-y-2 text-sm py-2">
                                    <div className="flex flex-col">
                                      <span className="text-gray-500">Warranty Expiry:</span>
                                      <span className="font-medium text-gray-800 mt-1">{formatDate(equipment.warrantyExpiryDate)}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {equipment.deleted && (
                                  <div className="mt-4 pt-2 border-t border-red-100">
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3 text-center">
                                      <p className="text-red-700 font-medium text-base">
                                        This equipment is no longer available in the system
                                      </p>
                                      <p className="text-red-600 text-sm mt-1">
                                        The equipment has been removed or replaced
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Maintenance Type Section */}
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">Maintenance Type</h4>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-gray-700 font-medium">{schedule.maintenanceType}</p>
                    </div>
                    
                    {/* Maintenance Date Section*/}
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">Date</h4>
                      {!isEquipmentDeleted() && (
                        <ActionButton
                          onClick={() => onEdit('date', schedule.scheduleId)}
                          icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>}
                          label="Edit"
                          color="blue"
                          size="sm"
                        />
                      )}
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-gray-700">{new Date(schedule.maintenanceDate).toLocaleDateString()}</p>
                    </div>
                    
                    {/* Maintenance Cost Section*/}
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">Cost</h4>
                      {!isEquipmentDeleted() && (
                        <ActionButton
                          onClick={() => onEdit('cost', schedule.scheduleId)}
                          icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>}
                          label="Edit"
                          color="blue"
                          size="sm"
                        />
                      )}
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-gray-700">Rs: {parseFloat(schedule.maintenanceCost).toFixed(2)}</p>
                    </div>
                    
                    {/* Technician Section*/}
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">Technician</h4>
                      {!isEquipmentDeleted() && (
                        <ActionButton
                          onClick={() => onEdit('technician', schedule.scheduleId)}
                          icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>}
                          label="Edit"
                          color="blue"
                          size="sm"
                        />
                      )}
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center mr-4 text-lg font-medium">
                        {schedule.technician.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800">{schedule.technician}</h5>
                        <p className="text-sm text-gray-500">Maintenance Technician</p>
                      </div>
                    </div>
                    
                    {/* Description Section*/}
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">Description</h4>
                      {!isEquipmentDeleted() && (
                        <ActionButton
                          onClick={() => onEdit('description', schedule.scheduleId)}
                          icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>}
                          label="Edit"
                          color="blue"
                          size="sm"
                        />
                      )}
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-gray-700 text-sm">{schedule.maintenanceDescription || "No description provided"}</p>
                    </div>

                    {/* Delete Button Section */}
                    <div className="flex justify-end mt-4">
                      <ActionButton
                        onClick={() => onDelete(schedule.scheduleId)}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>}
                        label="Delete Schedule"
                        color="red"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
  onEdit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  equipmentData: PropTypes.array,
  index: PropTypes.number
};

export default ExpandableTableRow;