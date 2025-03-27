import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  getEquipment,
  deleteEquipment,
  updateEquipmentStatus,
  getEquipmentById,
  updateEquipmentMaintenanceDate,
  searchEquipmentByName,
  filterEquipmentByStatus
} from "../../services/api";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const StatusBadge = ({ status }) => {
  const styles = {
    AVAILABLE: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    UNAVAILABLE: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    UNDER_MAINTENANCE: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    OUT_OF_ORDER: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      icon: (
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  };

  const style = styles[status] || styles.UNAVAILABLE;

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border flex items-center ${style.bg} ${style.text} ${style.border}`}>
      {style.icon}
      {status.replace(/_/g, " ")}
    </span>
  );
};

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [displayEquipment, setDisplayEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemUpdates, setItemUpdates] = useState({});
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [modalAction, setModalAction] = useState("");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await getEquipment();
        setEquipment(response.data);
        setDisplayEquipment(response.data);
      } catch (error) {
        setError("Failed to fetch equipment");
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  useEffect(() => {
    const fetchFilteredEquipment = async () => {
      try {
        setLoading(true);
        if (activeFilter === 'ALL') {
          const response = await getEquipment();
          setDisplayEquipment(response.data);
        } else {
          const response = await filterEquipmentByStatus(activeFilter);
          setDisplayEquipment(response.data);
        }
      } catch (error) {
        setError(`Failed to fetch equipment with status ${activeFilter}`);
        console.error("Error fetching filtered equipment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredEquipment();
  }, [activeFilter]);

  const openDeleteModal = (id) => {
    setSelectedItemId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteEquipment(selectedItemId);
      setEquipment(equipment.filter((item) => item.id !== selectedItemId));
      setDisplayEquipment(displayEquipment.filter((item) => item.id !== selectedItemId));
      
      setIsDeleteModalOpen(false);
      setModalMessage("Equipment successfully deleted");
      setIsSuccessModalOpen(true);
    } catch (error) {
      setIsDeleteModalOpen(false);
      setModalMessage("Failed to delete equipment");
      setIsErrorModalOpen(true);
      console.error("Error deleting equipment:", error);
    }
  };

  const confirmStatusUpdate = (id) => {
    setSelectedItemId(id);
    setModalAction("status");
    setModalMessage("Are you sure you want to update this equipment's status?");
    setIsDeleteModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    const newStatus = itemUpdates[selectedItemId]?.status || "AVAILABLE";
    try {
      await updateEquipmentStatus(selectedItemId, newStatus);
      setEquipment(
        equipment.map((item) =>
          item.id === selectedItemId ? { ...item, status: newStatus } : item
        )
      );
      setDisplayEquipment(
        displayEquipment.map((item) =>
          item.id === selectedItemId ? { ...item, status: newStatus } : item
        )
      );
      
      setIsDeleteModalOpen(false);
      setModalMessage("Status updated successfully");
      setIsSuccessModalOpen(true);
    } catch (error) {
      setIsDeleteModalOpen(false);
      setModalMessage("Failed to update equipment status");
      setIsErrorModalOpen(true);
      console.error("Error updating status:", error);
    }
  };

  const confirmMaintenanceUpdate = (id) => {
    const newDate = itemUpdates[id]?.maintenanceDate;
    if (!newDate) {
      setModalMessage("Please select a maintenance date first");
      setIsErrorModalOpen(true);
      return;
    }
    
    setSelectedItemId(id);
    setModalAction("maintenance");
    setModalMessage("Are you sure you want to update this equipment's maintenance date?");
    setIsDeleteModalOpen(true);
  };

  const handleMaintenanceUpdate = async () => {
    const newDate = itemUpdates[selectedItemId]?.maintenanceDate;
    try {
      await updateEquipmentMaintenanceDate(selectedItemId, newDate);
      setEquipment(
        equipment.map((item) =>
          item.id === selectedItemId ? { ...item, lastMaintenanceDate: newDate } : item
        )
      );
      setDisplayEquipment(
        displayEquipment.map((item) =>
          item.id === selectedItemId ? { ...item, lastMaintenanceDate: newDate } : item
        )
      );
      
      setIsDeleteModalOpen(false);
      setModalMessage("Maintenance date updated successfully");
      setIsSuccessModalOpen(true);
    } catch (error) {
      setIsDeleteModalOpen(false);
      setModalMessage("Failed to update maintenance date");
      setIsErrorModalOpen(true);
      console.error("Error updating maintenance date:", error);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      setDisplayEquipment(equipment);
      setSearchNotFound(false);
      return;
    }

    try {
      setLoading(true);
      setSearchNotFound(false);
      let response;
      if (!isNaN(search)) {
        response = await getEquipmentById(search);
        if (response.data) {
          setDisplayEquipment([response.data]);
        } else {
          setSearchNotFound(true);
          setDisplayEquipment(equipment);
        }
      } else {
        response = await searchEquipmentByName(search);
        if (response.data.length > 0) {
          setDisplayEquipment(response.data);
        } else {
          setSearchNotFound(true);
          setDisplayEquipment(equipment);
        }
      }
    } catch (error) {
      setError("Error searching equipment");
      setSearchNotFound(true);
      setDisplayEquipment(equipment);
      console.error("Error searching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setItemUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleConfirmAction = () => {
    if (modalAction === "status") {
      handleStatusUpdate();
    } else if (modalAction === "maintenance") {
      handleMaintenanceUpdate();
    } else {
      handleDelete();
    }
  };

  const getStatusCounts = () => {
    const counts = {
      ALL: equipment.length,
      AVAILABLE: 0,
      UNAVAILABLE: 0,
      UNDER_MAINTENANCE: 0,
      OUT_OF_ORDER: 0
    };
    
    equipment.forEach(item => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });
    
    return counts;
  };
  
  const statusCounts = getStatusCounts();

  const TableSkeleton = () => (
    <tbody className="animate-pulse">
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="bg-white border-b">
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
          <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-28"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
          <td className="px-6 py-4"><div className="h-12 bg-gray-200 rounded w-28"></div></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
          <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-16"></div></td>
        </tr>
      ))}
    </tbody>
  );
  
  const CardSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3 shadow-inner">
                <svg className="w-6 h-6 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                Equipment Inventory
              </h1>
            </div>
            <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white border-opacity-20">
              <svg className="w-5 h-5 text-red opacity-80 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
              <span className="text-red font-medium">Total: {equipment.length} items</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 border-b border-gray-200 overflow-x-auto">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center shadow-sm ${
                  activeFilter === 'ALL' 
                    ? 'bg-rose-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                </svg>
                All ({statusCounts.ALL})
              </button>
              
              <button 
                onClick={() => setActiveFilter('AVAILABLE')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center shadow-sm ${
                  activeFilter === 'AVAILABLE' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Available ({statusCounts.AVAILABLE})
              </button>
              
              <button 
                onClick={() => setActiveFilter('UNDER_MAINTENANCE')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center shadow-sm ${
                  activeFilter === 'UNDER_MAINTENANCE' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996-.608 2.296-.07 2.572 1.065"></path>
                </svg>
                Maintenance ({statusCounts.UNDER_MAINTENANCE})
              </button>
              
              <button 
                onClick={() => setActiveFilter('OUT_OF_ORDER')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center shadow-sm ${
                  activeFilter === 'OUT_OF_ORDER' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                Out of Order ({statusCounts.OUT_OF_ORDER})
              </button>
              
              <button 
                onClick={() => setActiveFilter('UNAVAILABLE')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center shadow-sm ${
                  activeFilter === 'UNAVAILABLE' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Unavailable ({statusCounts.UNAVAILABLE})
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Search by ID, Name or Category"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                className={`w-full md:w-auto px-6 py-3 text-white font-medium rounded-lg shadow-md transform transition-all duration-200 min-w-[100px] ${
                  loading
                    ? "bg-rose-400 cursor-not-allowed"
                    : "bg-rose-600 hover:bg-rose-700 hover:-translate-y-0.5 focus:ring-4 focus:ring-rose-300"
                }`}
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Search
                  </span>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 text-rose-600 p-4 bg-rose-50 border-l-4 border-rose-600 rounded-md flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {searchNotFound && (
              <div className="mt-4 text-yellow-600 p-4 bg-yellow-50 border-l-4 border-yellow-600 rounded-md flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span>No equipment found matching your search</span>
              </div>
            )}
          </div>

          <div className="hidden md:block overflow-x-auto rounded-lg mb-0">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-white uppercase bg-gradient-to-r from-rose-700 to-rose-600 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Purchase Date</th>
                  <th className="px-6 py-4 font-semibold">Last Maintenance</th>
                  <th className="px-6 py-4 font-semibold">Warranty Expiry</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              
              {loading ? (
                <TableSkeleton />
              ) : displayEquipment.length > 0 ? (
                <tbody>
                  {displayEquipment.map((item, index) => (
                    <tr key={item.id} className={`border-b hover:bg-rose-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <StatusBadge status={item.status} />
                          <select
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors duration-200 shadow-sm"
                            value={itemUpdates[item.id]?.status || item.status}
                            onChange={(e) =>
                              handleInputChange(item.id, "status", e.target.value)
                            }
                          >
                            <option value="AVAILABLE" className="text-gray-900">Available</option>
                            <option value="UNAVAILABLE" className="text-gray-900">Unavailable</option>
                            <option value="UNDER_MAINTENANCE" className="text-gray-900">Under Maintenance</option>
                            <option value="OUT_OF_ORDER" className="text-gray-900">Out of Order</option>
                          </select>
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 text-xs flex items-center justify-center"
                            onClick={() => confirmStatusUpdate(item.id)}
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Update Status
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {item.purchaseDate}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            {item.lastMaintenanceDate || "Not set"}
                          </span>
                          <input
                            type="date"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors duration-200 shadow-sm"
                            value={
                              itemUpdates[item.id]?.maintenanceDate ||
                              formatDateForInput(item.lastMaintenanceDate) ||
                              ""
                            }
                            onChange={(e) =>
                              handleInputChange(item.id, "maintenanceDate", e.target.value)
                            }
                          />
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 text-xs flex items-center justify-center"
                            onClick={() => confirmMaintenanceUpdate(item.id)}
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Update Date
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {item.warrantyExpiry}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 focus:ring-4 focus:ring-rose-300 transition-all duration-200 text-xs flex items-center justify-center"
                          onClick={() => {
                            setModalAction("delete");
                            openDeleteModal(item.id);
                          }}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-5 rounded-full mb-4">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No equipment found</h3>
                        <p className="text-gray-500 mb-4">Start by adding new gym equipment to your inventory.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>

          <div className="md:hidden p-4">
            {loading ? (
              <CardSkeleton />
            ) : displayEquipment.length > 0 ? (
              <div className="space-y-4">
                {displayEquipment.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-medium text-gray-500">ID: {item.id}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Category:</span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Purchase Date:</span>
                        <span className="text-sm text-gray-600">{item.purchaseDate}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Warranty Expiry:</span>
                        <span className="text-sm text-gray-600">{item.warrantyExpiry}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Last Maintenance:</span>
                        <span className="text-sm text-gray-600">{item.lastMaintenanceDate || "Not set"}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Status:</p>
                      <select
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors duration-200 shadow-sm w-full mb-2"
                        value={itemUpdates[item.id]?.status || item.status}
                        onChange={(e) =>
                          handleInputChange(item.id, "status", e.target.value)
                        }
                      >
                        <option value="AVAILABLE" className="text-gray-900">Available</option>
                        <option value="UNAVAILABLE" className="text-gray-900">Unavailable</option>
                        <option value="UNDER_MAINTENANCE" className="text-gray-900">Under Maintenance</option>
                        <option value="OUT_OF_ORDER" className="text-gray-900">Out of Order</option>
                      </select>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 text-xs flex items-center justify-center w-full"
                        onClick={() => confirmStatusUpdate(item.id)}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Update Status
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Maintenance Date:</p>
                      <input
                        type="date"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors duration-200 shadow-sm w-full mb-2"
                        value={
                          itemUpdates[item.id]?.maintenanceDate ||
                          formatDateForInput(item.lastMaintenanceDate) ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(item.id, "maintenanceDate", e.target.value)
                        }
                      />
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 text-xs flex items-center justify-center w-full"
                        onClick={() => confirmMaintenanceUpdate(item.id)}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Update Date
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 focus:ring-4 focus:ring-rose-300 transition-all duration-200 text-xs flex items-center justify-center w-full"
                        onClick={() => {
                          setModalAction("delete");
                          openDeleteModal(item.id);
                        }}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete Equipment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-gray-100 p-5 rounded-full mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No equipment found</h3>
                <p className="text-gray-500 mb-4 text-center">Start by adding new gym equipment to your inventory.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 to-rose-400"></div>
                  <div className="mt-3">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                    >
                      {modalAction === "delete" ? (
                        <svg className="w-6 h-6 text-rose-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                      )}
                      {modalAction === "delete" ? "Confirm Deletion" : "Confirm Update"}
                    </Dialog.Title>
                  </div>
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      {modalMessage || "Are you sure you want to proceed with this action?"}
                    </p>
                  </div>

                  <div className="mt-6 flex space-x-3 justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                        modalAction === "delete" 
                          ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white" 
                          : "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white"
                      }`}
                      onClick={handleConfirmAction}
                    >
                      {modalAction === "delete" ? (
                        <>
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Delete
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Update
                        </>
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isSuccessModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsSuccessModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-600 to-green-400"></div>
                  <div className="flex items-center justify-center my-4">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 animate-pulse">
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center mt-2">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Success!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {modalMessage || "The operation was successful."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      onClick={() => setIsSuccessModalOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Great!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isErrorModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsErrorModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 to-rose-400"></div>
                  <div className="flex items-center justify-center my-4">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-rose-100 text-rose-600">
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center mt-2">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Error
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {modalMessage || "An error occurred during the operation."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
                      onClick={() => setIsErrorModalOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default EquipmentList;