import React, { useState, useEffect } from 'react';
import { 
  getMaintenanceSchedule, 
  deleteMaintenanceSchedule,
  getEquipmentWithDeleted,
  updateMaintenanceDate,
  updateMaintenanceStatus,
  updateMaintenanceCost,
  updateMaintenanceTechnician,
  updateMaintenanceDescription,
  updateEquipmentMaintenanceDate,
  filterMaintenanceScheduleByStatus,
  filterMaintenanceScheduleByType,
  filterMaintenanceScheduleByEquipmentId
} from "../../services/api";
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import MaintenanceCalendar from '../../components/MaintenanceScheduleList/MaintenanceCalendar';
import MaintenanceHeader from '../../components/MaintenanceScheduleList/MaintenanceHeader';
import MaintenanceTable from '../../components/MaintenanceScheduleList/MaintenanceTable';
import LoadingSkeleton from '../../components/MaintenanceScheduleList/LoadingSkeleton';
import EmptyState from '../../components/MaintenanceScheduleList/EmptyState';
import FilterPanel from '../../components/MaintenanceScheduleList/FilterPanel';

const MaintenanceScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editStatus, setEditStatus] = useState({ id: null, status: '' });
  const [editCost, setEditCost] = useState({ id: null, cost: '' });
  const [editDescription, setEditDescription] = useState({ id: null, description: '' });
  const [editTechnician, setEditTechnician] = useState({ id: null, technician: '' });
  const [editDate, setEditDate] = useState({ id: null, date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [modal, setModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: () => {}, 
    type: 'info' 
  });

  const [filters, setFilters] = useState({
    status: 'ALL',
    type: 'ALL',
    equipmentId: 'ALL'
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [originalSchedules, setOriginalSchedules] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const response = await getMaintenanceSchedule();
      const equipmentResponse = await getEquipmentWithDeleted();
      
      const sortedSchedules = [...response.data].sort((a, b) => {
        return new Date(b.maintenanceDate) - new Date(a.maintenanceDate);
      });
      
      setEquipmentData(equipmentResponse.data);
      setSchedules(sortedSchedules);
      setOriginalSchedules(sortedSchedules);
      return sortedSchedules;
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to fetch data', 'error');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async (filterOptions) => {
    setFilters(filterOptions);
    setCurrentPage(1);
    
    try {
      setLoading(true);
      setIsFiltering(true);
      
      let filteredData = [];
      
      if (filterOptions.status === 'ALL' && filterOptions.type === 'ALL' && filterOptions.equipmentId === 'ALL') {
        filteredData = [...originalSchedules];
        setIsFiltering(false);
      } else {
        if (filterOptions.status !== 'ALL') {
          const response = await filterMaintenanceScheduleByStatus(filterOptions.status);
          filteredData = response.data;
        }
        
        if (filterOptions.type !== 'ALL') {
          if (filteredData.length > 0) {
            filteredData = filteredData.filter(item => item.maintenanceType === filterOptions.type);
          } else {
            const response = await filterMaintenanceScheduleByType(filterOptions.type);
            filteredData = response.data;
          }
        }
        
        if (filterOptions.equipmentId !== 'ALL') {
          if (filteredData.length > 0) {
            filteredData = filteredData.filter(item => item.equipmentId === filterOptions.equipmentId);
          } else {
            const response = await filterMaintenanceScheduleByEquipmentId(filterOptions.equipmentId);
            filteredData = response.data;
          }
        }
      }
      
      filteredData.sort((a, b) => {
        return new Date(b.maintenanceDate) - new Date(a.maintenanceDate);
      });
      
      setSchedules(filteredData);
    } catch (error) {
      console.error('Error applying filters:', error);
      showToast('Failed to apply filters', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      status: 'ALL',
      type: 'ALL',
      equipmentId: 'ALL'
    });
    setIsFiltering(false);
    setSchedules(originalSchedules);
  };

  const getUniqueEquipmentIds = () => {
    if (!originalSchedules || !Array.isArray(originalSchedules)) return [];
    
    const uniqueIds = [...new Set(originalSchedules.map(schedule => schedule.equipmentId))];
    return uniqueIds.filter(id => id);
  };

  const getUniqueMaintenanceTypes = () => {
    if (!originalSchedules || !Array.isArray(originalSchedules)) return [];
    
    const uniqueTypes = [...new Set(originalSchedules.map(schedule => schedule.maintenanceType))];
    return uniqueTypes.filter(type => type);
  };

  const handleDelete = async (id) => {
    setModal({
      isOpen: true,
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this maintenance schedule? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteMaintenanceSchedule(id);
          showToast('Schedule deleted successfully', 'success');
          fetchData();
        } catch (error) {
          console.error('Error deleting schedule:', error);
          showToast('Failed to delete schedule', 'error');
        }
      }
    });
  };

  const handleEdit = (field, id) => {
    const schedule = schedules.find(s => s.scheduleId === id);
    if (!schedule) {
      showToast('Schedule not found', 'error');
      return;
    }
    
    if (field === 'description') {
      setEditDescription({ id, description: schedule.maintenanceDescription || '' });
      
      setModal({
        isOpen: true,
        title: 'Edit Description',
        message: (
          <div className="space-y-3">
            <p>Update the maintenance description:</p>
            <textarea 
              id={`description-${id}`}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              defaultValue={schedule.maintenanceDescription}
              onChange={(e) => setEditDescription({ id, description: e.target.value })}
            />
          </div>
        ),
        type: 'info',
        onConfirm: async () => {
          const currentDescription = document.getElementById(`description-${id}`).value;
          try {
            await updateMaintenanceDescription(id, currentDescription);
            showToast('Description updated successfully!', 'success');
            fetchData();
            setModal({ ...modal, isOpen: false });
          } catch (err) {
            console.error("API Error:", err);
            showToast('Failed to update description: ' + (err.message || 'Unknown error'), 'error');
          }
        }
      });
    } else if (field === 'technician') {
      setEditTechnician({ id, technician: schedule.technician || '' });
      
      setModal({
        isOpen: true,
        title: 'Edit Technician',
        message: (
          <div className="space-y-3">
            <p>Update the technician name:</p>
            <input 
              id={`technician-${id}`}
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue={schedule.technician}
              onChange={(e) => setEditTechnician({ id, technician: e.target.value })}
            />
          </div>
        ),
        type: 'info',
        onConfirm: async () => {
          const currentTechnician = document.getElementById(`technician-${id}`).value;
          try {
            await updateMaintenanceTechnician(id, currentTechnician);
            showToast('Technician updated successfully!', 'success');
            fetchData();
            setModal({ ...modal, isOpen: false });
          } catch (err) {
            console.error("API Error:", err);
            showToast('Failed to update technician: ' + (err.message || 'Unknown error'), 'error');
          }
        }
      });
    } else if (field === 'date') {
      const formattedDate = schedule.maintenanceDate.split('T')[0];
      setEditDate({ id, date: formattedDate });
      
      setModal({
        isOpen: true,
        title: 'Edit Maintenance Date',
        message: (
          <div className="space-y-3">
            <p>Update the maintenance date:</p>
            <input 
              id={`date-${id}`}
              type="date" 
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue={formattedDate}
              onChange={(e) => setEditDate({ id, date: e.target.value })}
            />
          </div>
        ),
        type: 'info',
        onConfirm: async () => {
          const currentDate = document.getElementById(`date-${id}`).value;
          try {
            await updateMaintenanceDate(id, currentDate);
            showToast('Date updated successfully!', 'success');
            fetchData();
            setModal({ ...modal, isOpen: false });
          } catch (err) {
            console.error("API Error:", err);
            showToast('Failed to update date: ' + (err.message || 'Unknown error'), 'error');
          }
        }
      });
    } else if (field === 'status') {
      setEditStatus({ id, status: schedule.status });
      
      setModal({
        isOpen: true,
        title: 'Edit Status',
        message: (
          <div className="space-y-3">
            <p>Update the maintenance status:</p>
            <select 
              id={`status-${id}`}
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue={schedule.status}
              onChange={(e) => setEditStatus({ id, status: e.target.value })}
            >
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="INPROGRESS">INPROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </div>
        ),
        type: 'info',
        onConfirm: async () => {
          const currentStatus = document.getElementById(`status-${id}`).value;
          try {
            await updateMaintenanceStatus(id, currentStatus);
            
            if (currentStatus === 'COMPLETED') {
              try {
                await updateEquipmentMaintenanceDate(schedule.equipmentId, schedule.maintenanceDate);
                showToast('Status updated and equipment maintenance date updated successfully!', 'success');
              } catch (err) {
                console.error("Error updating equipment maintenance date:", err);
                showToast('Status updated but failed to update equipment maintenance date', 'warning');
              }
            } else {
              showToast('Status updated successfully!', 'success');
            }
            
            fetchData();
            setModal({ ...modal, isOpen: false });
          } catch (err) {
            console.error("API Error:", err);
            showToast('Failed to update status: ' + (err.message || 'Unknown error'), 'error');
          }
        }
      });
    } else if (field === 'cost') {
      setEditCost({ id, cost: schedule.maintenanceCost });
      
      setModal({
        isOpen: true,
        title: 'Edit Maintenance Cost',
        message: (
          <div className="space-y-3">
            <p>Update the maintenance cost:</p>
            <div className="flex items-center">
              <span className="bg-gray-100 p-2 rounded-l-md border border-gray-300">Rs:</span>
              <input 
                id={`cost-${id}`}
                type="number" 
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-r-md"
                defaultValue={schedule.maintenanceCost}
                onChange={(e) => setEditCost({ id, cost: e.target.value })}
              />
            </div>
          </div>
        ),
        type: 'info',
        onConfirm: async () => {
          const currentCost = parseFloat(document.getElementById(`cost-${id}`).value);
          try {
            await updateMaintenanceCost(id, currentCost);
            showToast('Cost updated successfully!', 'success');
            fetchData();
            setModal({ ...modal, isOpen: false });
          } catch (err) {
            console.error("API Error:", err);
            showToast('Failed to update cost: ' + (err.message || 'Unknown error'), 'error');
          }
        }
      });
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

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentItems = schedules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(schedules.length / itemsPerPage);

  const columns = [
    { field: 'equipmentId', label: 'Equipment' },
    { field: 'maintenanceType', label: 'Type' },
    { field: 'maintenanceDate', label: 'Date' },
    { field: 'status', label: 'Status' },
    { field: null, label: 'Actions' }
  ];

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen transition-colors duration-300">
      {/* Header */}
      <MaintenanceHeader 
        schedulesCount={schedules.length}
      />
      
      {/* Filter Panel */}
      <FilterPanel
        onApplyFilters={applyFilters}
        initialFilters={filters}
        equipmentIds={getUniqueEquipmentIds()}
        maintenanceTypes={getUniqueMaintenanceTypes()}
      />
      
      {/* Maintenance Calendar */}
      <MaintenanceCalendar schedules={schedules} equipmentData={equipmentData} />
      
      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow-md animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        {loading ? (
          <LoadingSkeleton itemsCount={itemsPerPage} />
        ) : schedules.length === 0 ? (
          <EmptyState />
        ) : (
          <MaintenanceTable 
            columns={columns}
            currentItems={currentItems}
            equipmentData={equipmentData}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
        
        {/* Pagination */}
        {!loading && schedules.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            totalItems={schedules.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Toast & Modal Components */}
      {toast.visible && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
      
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

export default MaintenanceScheduleList;