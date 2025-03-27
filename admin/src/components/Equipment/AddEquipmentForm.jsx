import { useState } from "react";
import { addEquipment } from "../../services/api";

const AddEquipmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "AVAILABLE",
    purchaseDate: "",
    lastMaintenanceDate: "",
    warrantyExpiry: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const equipmentData = {
      name: formData.name,
      category: formData.category,
      status: formData.status,
      purchaseDate: formData.purchaseDate,
      lastMaintenanceDate: formData.lastMaintenanceDate || null,
      warrantyExpiry: formData.warrantyExpiry || null,
    };

    try {
      await addEquipment(equipmentData);
      setSuccess(true);
      setFormData({
        name: "",
        category: "",
        status: "AVAILABLE",
        purchaseDate: "",
        lastMaintenanceDate: "",
        warrantyExpiry: "",
      });
      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error adding equipment: ", error);
      setError("Failed to add equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Enhanced Card with Better Shadow and Border */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Stylish Header Section */}
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-8 relative">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 rounded-full bg-rose-300 bg-opacity-20 backdrop-blur-sm"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 rounded-full bg-white bg-opacity-10"></div>
            
            <div className="relative">
              <div className="flex items-center mb-3">
                <div className="bg-white bg-opacity-25 p-2 rounded-lg mr-3 shadow-inner">
                  <svg className="w-6 h-6 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                  Add New Equipment
                </h1>
              </div>
              <p className="text-rose-100 max-w-md">
                Fill out the form below to add new equipment to the gym inventory system.
              </p>
            </div>
          </div>
          
          {/* Improved Form Container */}
          <div className="p-8">
            {/* Enhanced Alert Messages */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl mb-6 flex items-center shadow-sm animate-fadeIn">
                <div className="rounded-full bg-rose-100 p-2 mr-3 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Error</h3>
                  <p className="text-sm text-rose-600">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-center shadow-sm animate-fadeIn">
                <div className="rounded-full bg-green-100 p-2 mr-3 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Success</h3>
                  <p className="text-sm text-green-600">Equipment added successfully! You can add another one.</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info Section */}
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Basic Information
                </h2>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center">
                      Equipment Name 
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="text"
                        placeholder="Enter equipment name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 flex items-center">
                      Category 
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                      </div>
                      <input
                        id="category"
                        name="category"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="text"
                        placeholder="Enter category (e.g., Cardio, Weights, etc.)"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates Section */}
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Dates Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 flex items-center">
                      Purchase Date 
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <input
                        id="purchaseDate"
                        name="purchaseDate"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="date"
                        value={formData.purchaseDate}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastMaintenanceDate" className="block text-sm font-medium text-gray-700 flex items-center">
                      Last Maintenance Date
                      <span className="ml-2 text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                        </svg>
                      </div>
                      <input
                        id="lastMaintenanceDate"
                        name="lastMaintenanceDate"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="date"
                        value={formData.lastMaintenanceDate}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <label htmlFor="warrantyExpiry" className="block text-sm font-medium text-gray-700 flex items-center">
                    Warranty Expiry Date
                    <span className="ml-2 text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                    </div>
                    <input
                      id="warrantyExpiry"
                      name="warrantyExpiry"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                      type="date"
                      value={formData.warrantyExpiry}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Equipment Status
                </h2>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 flex items-center">
                    Current Status 
                    <span className="text-rose-500 ml-1">*</span>
                    <span className="ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <select
                      id="status"
                      name="status"
                      className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block appearance-none transition-all duration-200 shadow-sm hover:border-gray-400"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="AVAILABLE" className="py-1">Available</option>
                      <option value="UNDER_MAINTENANCE" className="py-1">Under Maintenance</option>
                      <option value="UNAVAILABLE" className="py-1">Unavailable</option>
                      <option value="OUT_OF_ORDER" className="py-1">Out of Order</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Status Indicators */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center ${formData.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-600'}`}>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Available
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center ${formData.status === 'UNDER_MAINTENANCE' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-gray-100 text-gray-600'}`}>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Maintenance
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center ${formData.status === 'UNAVAILABLE' ? 'bg-gray-200 text-gray-800 border border-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Unavailable
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center ${formData.status === 'OUT_OF_ORDER' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-gray-100 text-gray-600'}`}>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    Out of Order
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <div className="pt-4">
                <button
                  className="w-full px-6 py-4 bg-gradient-to-r from-rose-700 to-rose-500 text-white font-medium rounded-xl shadow-lg hover:from-rose-800 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Equipment...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add Equipment
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEquipmentForm;