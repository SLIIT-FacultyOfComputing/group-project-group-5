import React from 'react';
import SummaryCard from './SummaryCard';

const DetailsForm = ({ 
  formData, 
  handleChange, 
  handleBlur, 
  errors, 
  touched, 
  equipments, 
  technicianSuggestions,
  handlePrevStage,
  submitting
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technician */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technician <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="technician"
              value={formData.technician}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full pl-10 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${touched.technician && errors.technician ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${formData.technician && !errors.technician ? 'bg-green-50 border-green-300' : ''}`}
              placeholder="Technician name"
              list="technician-suggestions"
            />
            <datalist id="technician-suggestions">
              {technicianSuggestions.map((tech, index) => (
                <option key={index} value={tech} />
              ))}
            </datalist>
            {touched.technician && errors.technician ? (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            ) : formData.technician && !errors.technician ? (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : null}
            {touched.technician && errors.technician && (
              <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.technician}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Name of the person performing the maintenance</p>
          </div>
        </div>

        {/* Cost */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (Rs)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">Rs</span>
            </div>
            <input
              type="number"
              name="maintenanceCost"
              value={formData.maintenanceCost}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full pl-8 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${touched.maintenanceCost && errors.maintenanceCost ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              step="0.01"
              placeholder="0.00"
            />
            {touched.maintenanceCost && errors.maintenanceCost && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {touched.maintenanceCost && errors.maintenanceCost && (
              <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.maintenanceCost}</p>
            )}
          </div>
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="relative">
            <textarea
              name="maintenanceDescription"
              value={formData.maintenanceDescription}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
              rows="4"
              placeholder="Describe the maintenance task in detail..."
            />
            <div className="mt-1 flex justify-between">
              <p className="text-xs text-gray-500">Provide detailed information about the maintenance</p>
              <p className="text-xs text-gray-500">
                {formData.maintenanceDescription.length} characters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <SummaryCard formData={formData} equipments={equipments} />

      <div className="pt-4 border-t border-gray-200 mt-6">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handlePrevStage}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300 flex items-center shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Back to Basics</span>
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add Schedule</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsForm;