import React, { useState, useEffect } from 'react';
import { 
  getMaintenanceSchedule, 
  deleteMaintenanceSchedule,
  getMaintenanceScheduleById,
  searchMaintenanceSchedule,
  updateMaintenanceDate,
  updateMaintenanceStatus,
  updateMaintenanceCost,
  updateMaintenanceTechnician,
  updateMaintenanceDescription,
  filterMaintenanceScheduleByStatus
} from "../../services/api";
import { Link } from 'react-router-dom';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import SearchBar from '../../components/MaintenanceScheduleList/SearchBar';
import ActionButton from '../../components/MaintenanceScheduleList/ActionButton';
import EditableCell from '../../components/MaintenanceScheduleList/EditableCell';
import StatusTimeline from '../../components/MaintenanceScheduleList/StatusTimeline';
import CostSummaryCard from '../../components/MaintenanceScheduleList/CostSummaryCard';
import FilterPanel from '../../components/MaintenanceScheduleList/FilterPanel';
import ExpandableTableRow from '../../components/MaintenanceScheduleList/ExpandableTableRow';
import StatsCard from '../../components/MaintenanceScheduleList/StatsCard';
import DateRangePicker from '../../components/MaintenanceScheduleList/DateRangePicker';
import Pagination from '../../components/Pagination';
import TechnicianBadge from '../../components/MaintenanceScheduleList/TechnicianBadge';

const MaintenanceScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [editDate, setEditDate] = useState({ id: null, date: '' });
  const [editStatus, setEditStatus] = useState({ id: null, status: '' });
  const [editCost, setEditCost] = useState({ id: null, cost: '' });
  const [editDescription, setEditDescription] = useState({ id: null, description: '' });
  const [editTechnician, setEditTechnician] = useState({ id: null, technician: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'ALL',
    type: 'ALL',
    costRange: { min: '', max: '' },
    equipmentId: 'ALL',
    technician: 'ALL',
    dateRange: { start: null, end: null }
  });
  const [isAdvancedSearchMode, setIsAdvancedSearchMode] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  
  const [modal, setModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: () => {}, 
    type: 'info' 
  });

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'INPROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELED', label: 'Canceled' }
  ];

const fetchSchedules = async () => {
  try {
    setLoading(true);
    let response;
    
    if (statusFilter === 'ALL') {
      response = await getMaintenanceSchedule();
    } else {
      response = await filterMaintenanceScheduleByStatus(statusFilter);
    }
    
    let filteredData = response.data;
    if (searchTerm) {
      filteredData = filteredData.filter(schedule => 
        schedule.maintenanceDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.scheduleId.toString().includes(searchTerm) ||
        schedule.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.equipmentId.toString().includes(searchTerm)
      );
    }
    
    setSchedules(filteredData);
    return filteredData; 
  } catch (error) {
    console.error('Error fetching schedules:', error);
    showToast('Failed to fetch maintenance schedules', 'error');
    return [];
  } finally {
    setLoading(false);
  }
};

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchSchedules();
      return;
    }
  
    try {
      setLoading(true);
      let response;
  
      if (!isNaN(searchTerm) && Number.isInteger(Number(searchTerm))) {
        response = await getMaintenanceScheduleById(searchTerm);
      } else {
        response = await searchMaintenanceSchedule(searchTerm);
      }
  
      if (!response.data || response.data.length === 0) {
        showToast("No results found. Showing all schedules.", 'info');
        fetchSchedules();
      } else {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Error searching schedules:', error);
      showToast("An error occurred while searching. Showing all schedules.", 'error');
      fetchSchedules();
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Failed to enter fullscreen mode:', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error('Failed to exit fullscreen mode:', err);
      });
    }
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
          fetchSchedules();
        } catch (error) {
          console.error('Error deleting schedule:', error);
          showToast('Failed to delete schedule', 'error');
        }
      }
    });
  };

  const handleUpdateDate = async (id) => {
    const schedule = schedules.find(s => s.scheduleId === id);
    const oldDate = new Date(schedule.maintenanceDate).toLocaleDateString();
    const newDate = new Date(editDate.date).toLocaleDateString();
    
    setModal({
      isOpen: true,
      title: 'Confirm Date Change',
      message: (
        <div className="space-y-3">
          <p>Are you sure you want to update the maintenance date?</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Date change preview:</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-gray-500">Current date:</span>
                <div className="font-medium text-red-600 line-through">{oldDate}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500">New date:</span>
                <div className="font-medium text-green-600">{newDate}</div>
              </div>
            </div>
          </div>
        </div>
      ),
      type: 'warning',
      onConfirm: async () => {
        try {
          await updateMaintenanceDate(id, editDate.date);
          showToast('Date updated successfully!', 'success');
          setEditDate({ id: null, date: '' });
          fetchSchedules();
        } catch (error) {
          console.error('Error updating date:', error);
          showToast('Failed to update date', 'error');
        }
      }
    });
  };

const handleUpdateStatus = async (id) => {
  const schedule = schedules.find(s => s.scheduleId === id);
  setModal({
    isOpen: true,
    title: 'Confirm Status Change',
    message: (
      <div className="space-y-4">
        <p>Are you sure you want to update the maintenance status?</p>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Status change preview:</p>
          <StatusTimeline currentStatus={editStatus.status} />
        </div>
      </div>
    ),
    type: 'warning',
    onConfirm: async () => {
      try {
        await updateMaintenanceStatus(id, editStatus.status);
        showToast('Status updated successfully!', 'success');
        setEditStatus({ id: null, status: '' });
        fetchSchedules();
      } catch (error) {
        console.error('Error updating status:', error);
        showToast('Failed to update status', 'error');
      }
    }
  });
};

  const handleUpdateCost = async (id) => {
    setModal({
      isOpen: true,
      title: 'Confirm Cost Change',
      message: 'Are you sure you want to update the maintenance cost?',
      type: 'warning',
      onConfirm: async () => {
        try {
          await updateMaintenanceCost(id, parseFloat(editCost.cost));
          showToast('Cost updated successfully!', 'success');
          setEditCost({ id: null, cost: '' });
          fetchSchedules();
        } catch (error) {
          console.error('Error updating cost:', error);
          showToast('Failed to update cost', 'error');
        }
      }
    });
  };

  const handleUpdateDescription = async (id) => {
    setModal({
      isOpen: true,
      title: 'Confirm Description Change',
      message: 'Are you sure you want to update the maintenance description?',
      type: 'warning',
      onConfirm: async () => {
        try {
          await updateMaintenanceDescription(id, editDescription.description);
          showToast('Description updated successfully!', 'success');
          setEditDescription({ id: null, description: '' });
          fetchSchedules();
        } catch (error) {
          console.error('Error updating description:', error);
          showToast('Failed to update description', 'error');
        }
      }
    });
  };

  const handleUpdateTechnician = async (id) => {
    setModal({
      isOpen: true,
      title: 'Confirm Technician Change',
      message: 'Are you sure you want to update the technician name?',
      type: 'warning',
      onConfirm: async () => {
        try {
          await updateMaintenanceTechnician(id, editTechnician.technician);
          showToast('Technician updated successfully!', 'success');
          setEditTechnician({ id: null, technician: '' });
          fetchSchedules();
        } catch (error) {
          console.error('Error updating technician:', error);
          showToast('Failed to update technician', 'error');
        }
      }
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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

  const handleAdvancedSearchToggle = () => {
    setIsAdvancedSearchMode(!isAdvancedSearchMode);
  };

  const handleAdvancedFilterChange = (filters) => {
    setAdvancedFilters(filters);
  };

  useEffect(() => {
    fetchSchedules();
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const sortedSchedules = [...schedules];
  if (sortField) {
    sortedSchedules.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  const currentItems = sortedSchedules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(schedules.length / itemsPerPage);

  const columns = [
    { field: 'scheduleId', label: 'ID', sortable: true },
    { field: 'equipmentId', label: 'Equipment ID', sortable: true },
    { field: 'maintenanceType', label: 'Type', sortable: true },
    { field: 'maintenanceDescription', label: 'Description', sortable: false },
    { field: 'maintenanceDate', label: 'Date', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'technician', label: 'Technician', sortable: true },
    { field: 'maintenanceCost', label: 'Cost', sortable: true },
    { field: null, label: 'Actions', sortable: false }
  ];

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded-md mb-4 w-3/4"></div>
      <div className="space-y-3">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div key={i} className="grid grid-cols-9 gap-4">
            {[...Array(9)].map((_, j) => (
              <div key={j} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

const applyAllFilters = async (activeFilters) => {
  setLoading(true);
  
  try {
    // First fetch all schedules (or filtered by status if needed)
    let response;
    
    if (activeFilters.status === 'ALL') {
      response = await getMaintenanceSchedule();
    } else {
      response = await filterMaintenanceScheduleByStatus(activeFilters.status);
    }
    
    // Get the base data to apply further filtering
    let filteredData = response.data;
    
    // Apply each filter
    if (activeFilters.type && activeFilters.type !== 'ALL') {
      // Case-insensitive match for maintenance type
      filteredData = filteredData.filter(schedule => 
        schedule.maintenanceType.toUpperCase() === activeFilters.type.toUpperCase()
      );
    }
    
    if (activeFilters.costRange) {
      const costMin = activeFilters.costRange.min ? parseFloat(activeFilters.costRange.min) : null;
      const costMax = activeFilters.costRange.max ? parseFloat(activeFilters.costRange.max) : null;
      
      if (costMin !== null) {
        filteredData = filteredData.filter(schedule => 
          parseFloat(schedule.maintenanceCost) >= costMin
        );
      }
      
      if (costMax !== null) {
        filteredData = filteredData.filter(schedule => 
          parseFloat(schedule.maintenanceCost) <= costMax
        );
      }
    }
    
    if (activeFilters.equipmentId && activeFilters.equipmentId !== 'ALL') {
      filteredData = filteredData.filter(schedule => 
        schedule.equipmentId.toString() === activeFilters.equipmentId.toString()
      );
    }
    
    if (activeFilters.technician && activeFilters.technician !== 'ALL') {
      filteredData = filteredData.filter(schedule => 
        schedule.technician === activeFilters.technician
      );
    }
    
    if (activeFilters.dateRange && 
        (activeFilters.dateRange.start || activeFilters.dateRange.end)) {
      
      if (activeFilters.dateRange.start) {
        const startDate = new Date(activeFilters.dateRange.start);
        filteredData = filteredData.filter(schedule => 
          new Date(schedule.maintenanceDate) >= startDate
        );
      }
      
      if (activeFilters.dateRange.end) {
        const endDate = new Date(activeFilters.dateRange.end);
        filteredData = filteredData.filter(schedule => 
          new Date(schedule.maintenanceDate) <= endDate
        );
      }
    }
    
    setSchedules(filteredData);
    if (filteredData.length === 0) {
      showToast('No maintenance schedules match your filters', 'info');
    }
  } catch (error) {
    console.error('Error applying filters:', error);
    showToast('An error occurred while filtering schedules', 'error');
  } finally {
    setLoading(false);
  }
};

const resetAllFilters = () => {
  // Reset all filter states
  setFilters({
    status: 'ALL',
    type: 'ALL',
    costRange: { min: '', max: '' },
    equipmentId: 'ALL',
    technician: 'ALL',
    dateRange: { start: null, end: null }
  });
  
  // Reset other filter-related states
  setStatusFilter('ALL');
  setSearchTerm('');
  
  // Fetch all schedules without filters
  fetchSchedules();
};

  return (
    <div className={`container mx-auto p-4 ${isFullscreen ? 'bg-white' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      {/* Header & Add Button */}
      <div className="bg-gradient-to-r from-rose-700 to-rose-600 text-white p-4 rounded-lg shadow-xl mb-4 flex justify-between items-center relative overflow-hidden">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 gym-pattern"></div>
        </div>
        
        <div className="flex items-center relative z-10">
          <div className="bg-white bg-opacity-40 p-1.5 sm:p-2.5 rounded-lg shadow-lg mr-2 sm:mr-4">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-tight">
              Maintenance Schedules
            </h2>
          </div>
          <div className="ml-4 flex space-x-2">
            <button 
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-rose-800 bg-opacity-40 hover:bg-opacity-60 text-rose-100 hover:text-white transition-colors duration-200"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v4a1 1 0 01-1 1H2a1 1 0 010-2h.93a.5.5 0 00.5-.5V5a3 3 0 013-3h4a1 1 0 010 2H7a.5.5 0 00-.5.5v.93a1 1 0 01-2 0V4zm1 16a1 1 0 001-1v-4a1 1 0 011-1h1a1 1 0 110 2h-.93a.5.5 0 00-.5.5V19a3 3 0 01-3 3H2a1 1 0 110-2h3a.5.5 0 00.5-.5v-.93a1 1 0 012 0V20zm13-16a1 1 0 00-1 1v.93a1 1 0 01-2 0V4a1 1 0 00-1-1h-4a1 1 0 110-2h4a3 3 0 013 3v4a1 1 0 01-1 1h-1a1 1 0 110-2h.93a.5.5 0 00.5-.5V5a1 1 0 011-1zm0 16a1 1 0 001-1v-.93a.5.5 0 00-.5-.5H19a1 1 0 110-2h1a1 1 0 011 1v4a3 3 0 01-3 3h-4a1 1 0 110-2h4a.5.5 0 00.5-.5z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button 
              onClick={fetchSchedules}
              className="p-2 rounded-full bg-rose-800 bg-opacity-40 hover:bg-opacity-60 text-rose-100 hover:text-white transition-colors duration-200"
              title="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 relative z-10">
          <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-white border-opacity-20 w-full sm:w-auto justify-center sm:justify-start">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-black opacity-80 mr-1 sm:mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              ></path>
            </svg>
            <span className="text-black font-medium text-xs sm:text-sm whitespace-nowrap">
              Total: {schedules.length} schedules
            </span>
          </div>
          
          <Link to="/maintenance-add" className="w-full sm:w-auto">
            <ActionButton
              onClick={() => {}}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>}
              label="Add Schedule"
              color="green"
              fullWidth={true}
              className="w-full sm:w-auto"
            />
          </Link>
        </div>
      </div>
      
      {/* Search & Filters */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        placeholder="Search by ID, Type, or Description"
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={statusOptions}
        onAdvancedSearch={handleAdvancedSearchToggle}
        isAdvancedMode={isAdvancedSearchMode}
        advancedFilters={advancedFilters}
        onAdvancedFilterChange={handleAdvancedFilterChange}
      />

      {/* Enhanced Filters */}
      <div className="mb-6 animate-fadeIn" style={{ animationDelay: '0.25s' }}>
        <FilterPanel 
          onApplyFilters={(newFilters) => {
            setFilters(prevFilters => ({
              ...prevFilters,
              status: newFilters.status || 'ALL',
              type: newFilters.type || 'ALL',
              costRange: newFilters.costRange || { min: '', max: '' },
              equipmentId: newFilters.equipmentId || 'ALL',
              technician: newFilters.technician || 'ALL'
            }));
            
            setStatusFilter(newFilters.status || 'ALL');
            
            if (newFilters.searchTerm !== undefined) {
              setSearchTerm(newFilters.searchTerm);
            }
            
            applyAllFilters(newFilters);
          }}
          initialFilters={{
            status: filters.status,
            type: filters.type,
            costRange: filters.costRange,
            equipmentId: filters.equipmentId,
            technician: filters.technician,
            searchTerm: searchTerm
          }}
          equipmentIds={Array.from(new Set(schedules.map(s => s.equipmentId)))}
          technicianNames={Array.from(new Set(schedules.map(s => s.technician)))}
        />
        <button
          onClick={resetAllFilters}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset All Filters
        </button>
      </div>

      {/* Date Range Picker */}
      <div className="flex justify-end mb-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <DateRangePicker 
          onRangeChange={(range) => {
            setFilters(prevFilters => ({
              ...prevFilters,
              dateRange: range
            }));
            
            applyAllFilters({...filters, dateRange: range});
          }} 
          initialRange={filters.dateRange}
        />
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slideIn" style={{ animationDelay: '0.2s' }}>
        <StatsCard
          title="Total Schedules"
          value={schedules.length}
          previousValue={schedules.length - 3} // For demonstration - you should track previous value
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>}
          colorClass="text-blue-600"
        />
        <StatsCard
          title="Scheduled"
          value={schedules.filter(s => s.status === 'SCHEDULED').length}
          previousValue={Math.max(schedules.filter(s => s.status === 'SCHEDULED').length - 1, 0)}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>}
          colorClass="text-indigo-600"
        />
        <StatsCard
          title="In Progress"
          value={schedules.filter(s => s.status === 'INPROGRESS').length}
          previousValue={Math.max(schedules.filter(s => s.status === 'INPROGRESS').length - 2, 0)}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
          colorClass="text-yellow-600"
        />
        <StatsCard
          title="Completed"
          value={schedules.filter(s => s.status === 'COMPLETED').length}
          previousValue={Math.max(schedules.filter(s => s.status === 'COMPLETED').length - 1, 0)}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
          colorClass="text-green-600"
        />
      </div>

      {/* Cost Summary Chart */}
      <div className="mb-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <CostSummaryCard schedules={schedules} />
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow-md animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        {loading ? (
          <LoadingSkeleton />
        ) : schedules.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-md animate-scaleIn">
            <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
            <h3 className="mt-6 text-xl font-medium text-gray-900">No maintenance schedules found</h3>
            <p className="mt-2 text-base text-gray-500">Try changing your search or filter settings.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                fetchSchedules();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Reset Filters
            </button>
            <button
              onClick={resetAllFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700">
                  {columns.map((column, idx) => (
                    <th 
                      key={idx}
                      onClick={() => column.sortable && handleSort(column.field)} 
                      className={`p-3 border text-left text-sm font-medium ${column.sortable ? 'cursor-pointer hover:bg-blue-100' : ''} transition-colors duration-200`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && sortField === column.field && (
                          <span className="text-blue-500 ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((schedule, idx) => (
                  <ExpandableTableRow
                    key={schedule.scheduleId}
                    schedule={schedule}
                    onDelete={handleDelete}
                    onEdit={(field, id) => {
                      if (field === 'description') {
                        setEditDescription({ id: id, description: schedule.maintenanceDescription });
                      } else if (field === 'technician') {
                        setEditTechnician({ id: id, technician: schedule.technician });
                      }
                    }}
                  >
                    <td className="p-3 border">{schedule.scheduleId}</td>
                    <td className="p-3 border">{schedule.equipmentId}</td>
                    <td className="p-3 border">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {schedule.maintenanceType}
                      </span>
                    </td>
                    <td className="p-3 border">
                      <EditableCell
                        isEditing={editDescription.id === schedule.scheduleId}
                        value={schedule.maintenanceDescription}
                        editValue={editDescription.description}
                        onEditChange={(value) => setEditDescription({ ...editDescription, description: value })}
                        onSave={() => handleUpdateDescription(schedule.scheduleId)}
                        onEdit={() => setEditDescription({ id: schedule.scheduleId, description: schedule.maintenanceDescription })}
                        displayComponent={
                          <span className="truncate max-w-[150px]" title={schedule.maintenanceDescription}>
                            {schedule.maintenanceDescription}
                          </span>
                        }
                      />
                    </td>
                    <td className="p-3 border">
                      {editDate.id === schedule.scheduleId ? (
                        <div className="flex gap-2 animate-scaleIn">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="date"
                              value={editDate.date}
                              onChange={(e) => setEditDate({ ...editDate, date: e.target.value })}
                              className="p-2 pl-10 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
                            />
                          </div>
                          <button
                            onClick={() => handleUpdateDate(schedule.scheduleId)}
                            disabled={!editDate.date}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-300 transition-colors duration-300 shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditDate({ id: null, date: '' })}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors duration-300 shadow-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center group">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(schedule.maintenanceDate).toLocaleDateString()}</span>
                          </div>
                          <button
                            onClick={() => setEditDate({ id: schedule.scheduleId, date: schedule.maintenanceDate.split('T')[0] })}
                            className="opacity-0 group-hover:opacity-100 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-all duration-300 shadow-sm"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                    {/* Status field  */}
                    <td className="p-3 border">
                      {editStatus.id === schedule.scheduleId ? (
                        <div className="flex gap-2 animate-scaleIn">
                          <select
                            value={editStatus.status}
                            onChange={(e) => setEditStatus({ ...editStatus, status: e.target.value })}
                            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                          >
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="INPROGRESS">INPROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELED">CANCELED</option>
                          </select>
                          <button
                            onClick={() => handleUpdateStatus(schedule.scheduleId)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors duration-300 shadow-sm"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center group">
                          <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                            schedule.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                            schedule.status === 'INPROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                            schedule.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {schedule.status}
                          </span>
                          <button
                            onClick={() => setEditStatus({ id: schedule.scheduleId, status: schedule.status })}
                            className="opacity-0 group-hover:opacity-100 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-all duration-300 shadow-sm"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 border">
                      <EditableCell
                        isEditing={editTechnician.id === schedule.scheduleId}
                        value={schedule.technician}
                        editValue={editTechnician.technician}
                        onEditChange={(value) => setEditTechnician({ ...editTechnician, technician: value })}
                        onSave={() => handleUpdateTechnician(schedule.scheduleId)}
                        onEdit={() => setEditTechnician({ id: schedule.scheduleId, technician: schedule.technician })}
                        displayComponent={<TechnicianBadge name={schedule.technician} />}
                      />
                    </td>
                    {/* Cost field */}
                    <td className="p-3 border">
                      <EditableCell
                        isEditing={editCost.id === schedule.scheduleId}
                        value={`Rs ${parseFloat(schedule.maintenanceCost).toFixed(2)}`}
                        editValue={editCost.cost}
                        onEditChange={(value) => setEditCost({ ...editCost, cost: value })}
                        onSave={() => handleUpdateCost(schedule.scheduleId)}
                        onEdit={() => setEditCost({ id: schedule.scheduleId, cost: schedule.maintenanceCost })}
                        displayComponent={
                          <span className="font-medium">Rs {parseFloat(schedule.maintenanceCost).toFixed(2)}</span>
                        }
                      />
                    </td>
                  </ExpandableTableRow>
                ))}
              </tbody>
            </table>
          </div>
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