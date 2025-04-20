import React, { useState, useEffect } from 'react';
import { addMaintenanceSchedule, getEquipment } from "../../services/api";
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import ActionButton from '../../components/ActionButton';

const MaintenanceScheduleAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    equipmentId: '',
    maintenanceType: '',
    maintenanceDate: '',
    maintenanceDescription: '',
    status: 'SCHEDULED',
    technician: '',
    maintenanceCost: ''
  });
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [modal, setModal] = useState({ isOpen: false });
  const [errors, setErrors] = useState({});
  const [formStage, setFormStage] = useState(1);
  const [progressValue, setProgressValue] = useState(30);
  const [touched, setTouched] = useState({});

  const maintenanceTypes = [
    'Preventive', 'Corrective', 'Predictive', 'Routine', 
    'Emergency', 'Condition-based', 'Breakdown'
  ];

  const technicianSuggestions = [
    'John Smith', 'Maria Garcia', 'Ahmed Ali', 'Sarah Johnson', 
    'Wei Chen', 'Alex Taylor', 'Priya Patel'
  ];

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const response = await getEquipment();
      setEquipments(response.data);
    } catch (error) {
      console.error('Error fetching equipments:', error);
      showToast('Failed to fetch equipment list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
    
    const timer = setTimeout(() => {
      setProgressValue(formStage === 1 ? 50 : 100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [formStage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }
    
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };
  
  const validateField = (name, value) => {
    switch (name) {
      case 'equipmentId':
        return value ? '' : 'Equipment ID is required';
      case 'maintenanceType':
        return value ? '' : 'Maintenance type is required';
      case 'maintenanceDate':
        if (!value) return 'Date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate < today && formData.status === 'SCHEDULED') {
          return 'Scheduled maintenance cannot be in the past';
        }
        return '';
      case 'technician':
        return value ? '' : 'Technician name is required';
      case 'maintenanceCost':
        return (value && (isNaN(value) || parseFloat(value) < 0)) 
          ? 'Cost must be a positive number' 
          : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStage = () => {
    const newErrors = {};
    ['equipmentId', 'maintenanceType', 'maintenanceDate'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    setFormStage(2);
  };

  const handlePrevStage = () => {
    setFormStage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    
    setModal({
      isOpen: true,
      title: 'Confirm Maintenance Schedule',
      message: (
        <div className="space-y-4">
          <p>Are you sure you want to add this maintenance schedule?</p>
          <div className="mt-4 bg-gray-50 p-4 rounded-md text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Equipment:</div>
              <div className="font-medium">
                {equipments.find(e => e.id === formData.equipmentId)?.name || formData.equipmentId}
              </div>
              <div className="text-gray-600">Type:</div>
              <div className="font-medium">{formData.maintenanceType}</div>
              <div className="text-gray-600">Date:</div>
              <div className="font-medium">{new Date(formData.maintenanceDate).toLocaleDateString()}</div>
              <div className="text-gray-600">Status:</div>
              <div className="font-medium">{formData.status}</div>
              <div className="text-gray-600">Cost:</div>
              <div className="font-medium">${parseFloat(formData.maintenanceCost || 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
      ),
      type: 'info',
      onConfirm: submitForm
    });
  };

  const submitForm = async () => {
    try {
      setSubmitting(true);
      const scheduleData = {
        ...formData,
        maintenanceCost: parseFloat(formData.maintenanceCost) || 0
      };
      await addMaintenanceSchedule(scheduleData);
      showToast('Maintenance schedule added successfully!', 'success');
      
      setFormData({
        equipmentId: '',
        maintenanceType: '',
        maintenanceDate: '',
        maintenanceDescription: '',
        status: 'SCHEDULED',
        technician: '',
        maintenanceCost: ''
      });
      
      setTimeout(() => {
        navigate('/maintenance');
      }, 2000);
    } catch (error) {
      showToast('Error adding maintenance schedule', 'error');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, visible: false });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'INPROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-6 text-sm">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link to="/maintenance" className="ml-1 text-gray-500 hover:text-blue-600 transition-colors md:ml-2">
                Maintenance Schedules
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-blue-600 md:ml-2">Add Schedule</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Add Maintenance Schedule</h2>
            <p className="text-gray-600">Create a new maintenance schedule for your equipment</p>
          </div>
          <Link to="/maintenance">
            <ActionButton
              onClick={() => {}}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>}
              label="Back to List"
              color="blue"
            />
          </Link>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">
              {formStage === 1 ? 'Step 1: Basic Information' : 'Step 2: Additional Details'}
            </div>
            <div className="text-sm text-gray-500">
              {formStage}/2
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${formStage >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Basic Info</span>
            <span className={`text-xs ${formStage >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Details</span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 rounded-lg shadow-md animate-slideIn">
        <form onSubmit={handleSubmit} className="space-y-6">
          {formStage === 1 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Equipment ID */}
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
                    <select
                      name="equipmentId"
                      value={formData.equipmentId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 ${touched.equipmentId && errors.equipmentId ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${formData.equipmentId ? 'bg-green-50 border-green-300' : ''}`}
                      required
                    >
                      <option value="">Select Equipment</option>
                      {loading ? (
                        <option disabled>Loading equipment list...</option>
                      ) : (
                        equipments.map((equipment) => (
                          <option key={equipment.id} value={equipment.id}>
                            {equipment.id} - {equipment.name || equipment.type}
                          </option>
                        ))
                      )}
                    </select>
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
                    {touched.equipmentId && errors.equipmentId && (
                      <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.equipmentId}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Select the equipment that needs maintenance</p>
                  </div>
                </div>

                {/* Maintenance Type */}
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

                {/* Maintenance Date */}
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

                {/* Status */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['SCHEDULED', 'INPROGRESS', 'COMPLETED', 'CANCELED'].map((status) => (
                      <label 
                        key={status} 
                        className={`flex items-center px-3 py-2 border rounded-md cursor-pointer transition-all duration-200 ${formData.status === status ? getStatusClass(status) + ' ring-2 ring-offset-1' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={formData.status === status}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          status === 'SCHEDULED' ? 'bg-blue-500' :
                          status === 'INPROGRESS' ? 'bg-yellow-500' :
                          status === 'COMPLETED' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></span>
                        <span>{status === 'INPROGRESS' ? 'In Progress' : status.charAt(0) + status.slice(1).toLowerCase()}</span>
                      </label>
                    ))}
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
          ) : (
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost ($)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
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
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                <h3 className="text-md font-medium text-gray-700 mb-2">Maintenance Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Equipment:</span>
                    <span className="ml-1 font-medium">
                      {equipments.find(e => e.id === formData.equipmentId)?.name || formData.equipmentId || 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-1 font-medium">{formData.maintenanceType || 'Not selected'}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-1 font-medium">
                      {formData.maintenanceDate ? new Date(formData.maintenanceDate).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                      <path d="M10 4a1 1 0 00-1 1v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 8.586V5a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(formData.status)}`}>
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>

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
          )}
        </form>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default MaintenanceScheduleAdd;