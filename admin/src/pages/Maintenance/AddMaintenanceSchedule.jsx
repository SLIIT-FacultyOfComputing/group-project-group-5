import React, { useState, useEffect } from 'react';
import { 
  addMaintenanceSchedule, 
  getEquipment, 
  updateMonthlyCost 
} from "../../services/api";
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { 
  Breadcrumb,
  Header,
  ProgressIndicator,
  BasicInfoForm,
  DetailsForm
} from '../../components/AddMaintenanceSchedule';

const MaintenanceScheduleAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    equipmentId: '',
    maintenanceType: '',
    maintenanceDate: '',
    maintenanceDescription: '',
    maintenanceCost: '',
    technician: '',
    status: 'SCHEDULED'
  });
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [modal, setModal] = useState({ isOpen: false });
  const [errors, setErrors] = useState({});
  const [formStage, setFormStage] = useState(1);
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
  }, []);

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
              <div className="text-gray-600">Cost:</div>
              <div className="font-medium">Rs{parseFloat(formData.maintenanceCost || 0).toFixed(2)}</div>
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
      
      // Automatically update monthly costs after adding a maintenance schedule
      try {
        await updateMonthlyCost();
        showToast('Maintenance schedule added and monthly costs updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating monthly costs:', error);
        showToast('Maintenance schedule added successfully, but monthly costs update failed.', 'warning');
      }
      
      setFormData({
        equipmentId: '',
        maintenanceType: '',
        maintenanceDate: '',
        maintenanceDescription: '',
        maintenanceCost: '',
        technician: '',
        status: 'SCHEDULED'
      });      
      setTimeout(() => {
        navigate('/admin/maintenance-list');
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
      case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'INPROGRESS': return 'bg-yellow-50 text-yellow-700 border-yellow-300';
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-300';
      case 'CANCELED': return 'bg-red-50 text-red-700 border-red-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Breadcrumb />

      <Header />
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 animate-fadeIn">
        <ProgressIndicator formStage={formStage} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md animate-slideIn">
        <form onSubmit={handleSubmit} className="space-y-6">
          {formStage === 1 ? (
            <BasicInfoForm 
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
              loading={loading}
              equipments={equipments}
              maintenanceTypes={maintenanceTypes}
              getStatusClass={getStatusClass}
              handleNextStage={handleNextStage}
            />
          ) : (
            <DetailsForm 
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
              equipments={equipments}
              technicianSuggestions={technicianSuggestions}
              getStatusClass={getStatusClass}
              handlePrevStage={handlePrevStage}
              submitting={submitting}
            />
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