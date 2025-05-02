import React, { useState, useEffect } from 'react';

const BasicInfoForm = ({ 
  formData, 
  handleChange, 
  handleBlur, 
  errors, 
  touched, 
  loading, 
  equipments, 
  maintenanceTypes,
  handleNextStage 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update suggestions when user types
  useEffect(() => {
    if (searchTerm !== null && searchTerm !== undefined && equipments) {
      // Ensure searchTerm is a string before calling toLowerCase
      const lowerSearchTerm = String(searchTerm).toLowerCase();
      const filtered = equipments.filter(equipment => {
        // Safely convert values to strings before using toLowerCase
        const id = String(equipment.id || '').toLowerCase();
        const name = equipment.name ? String(equipment.name).toLowerCase() : '';
        const type = equipment.type ? String(equipment.type).toLowerCase() : '';
        
        return id.includes(lowerSearchTerm) || 
               name.includes(lowerSearchTerm) || 
               type.includes(lowerSearchTerm);
      });
      setSuggestions(filtered);
    } else {
      setSuggestions(equipments || []);
    }
  }, [searchTerm, equipments]);

  const handleEquipmentChange = (e) => {
    // Make sure we store the value as a string
    setSearchTerm(String(e.target.value || ''));
    // Also update the form data
    handleChange({
      target: {
        name: 'equipmentId',
        value: e.target.value
      }
    });
  };

  const selectEquipment = (id) => {
    setSearchTerm(id);
    // Update the form data
    handleChange({
      target: {
        name: 'equipmentId',
        value: id
      }
    });
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equipment ID <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleEquipmentChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={(e) => {
                // Delay hiding suggestions to allow clicking on them
                setTimeout(() => setShowSuggestions(false), 200);
                handleBlur(e);
              }}
              placeholder="Search or type equipment ID"
              className={`block w-full pl-10 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${touched.equipmentId && errors.equipmentId ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${formData.equipmentId ? 'bg-green-50 border-green-300' : ''}`}
              required
            />
            {touched.equipmentId && errors.equipmentId ? (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            ) : formData.equipmentId ? (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : null}
            
            {/* Equipment suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 overflow-auto rounded-md border border-gray-300">
                {loading ? (
                  <div className="p-2 text-gray-500">Loading equipment list...</div>
                ) : suggestions.length > 0 ? (
                  <ul className="py-1">
                    {suggestions.map((equipment) => (
                      <li 
                        key={equipment.id} 
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                        onClick={() => selectEquipment(equipment.id)}
                      >
                        <span className="font-medium">{equipment.id}</span>
                        <span className="text-gray-500">{equipment.name || equipment.type}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-2 text-gray-500">No matching equipment found</div>
                )}
              </div>
            )}
            
            {touched.equipmentId && errors.equipmentId && (
              <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.equipmentId}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Enter the equipment ID or search by name</p>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maintenance Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <select
              name="maintenanceType"
              value={formData.maintenanceType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full pl-10 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${touched.maintenanceType && errors.maintenanceType ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${formData.maintenanceType ? 'bg-green-50 border-green-300' : ''}`}
              required
            >
              <option value="">Select Type</option>
              {maintenanceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {touched.maintenanceType && errors.maintenanceType ? (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            ) : formData.maintenanceType ? (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : null}
            {touched.maintenanceType && errors.maintenanceType && (
              <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.maintenanceType}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Select the type of maintenance to be performed</p>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maintenance Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="date"
              name="maintenanceDate"
              value={formData.maintenanceDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full pl-10 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${touched.maintenanceDate && errors.maintenanceDate ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${formData.maintenanceDate && !errors.maintenanceDate ? 'bg-green-50 border-green-300' : ''}`}
              required
            />
            {touched.maintenanceDate && errors.maintenanceDate ? (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            ) : formData.maintenanceDate && !errors.maintenanceDate ? (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : null}
            {touched.maintenanceDate && errors.maintenanceDate && (
              <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.maintenanceDate}</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 mt-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNextStage}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <span>Continue to Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;