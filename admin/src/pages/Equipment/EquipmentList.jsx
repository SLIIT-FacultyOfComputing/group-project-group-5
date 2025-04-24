import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import {
  getEquipment,
  deleteEquipment,
  updateEquipmentStatus,
  updateEquipmentMaintenanceDate,
  searchEquipment,
  filterEquipmentByStatus
} from "../../services/api";
import {
  FilterButtons,
  SearchBar,
  TableView,
  CardView,
  EmptyState,
  LoadingSkeletons,
} from "../../components/EquipmentList";
import Modal from "../../components/Modal";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
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

  const handleInputChange = (id, field, value) => {
    setItemUpdates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  useEffect(() => {
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
    setModalAction("delete");
    setModalMessage("Are you sure you want to delete this equipment? This action cannot be undone.");
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
      const updatedEquipment = equipment.map(item =>
        item.id === selectedItemId ? { ...item, status: newStatus } : item
      );
      setEquipment(updatedEquipment);
      setDisplayEquipment(
        displayEquipment.map(item =>
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
        equipment.map(item =>
          item.id === selectedItemId ? { ...item, lastMaintenanceDate: newDate } : item
        )
      );
      setDisplayEquipment(
        displayEquipment.map(item =>
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
      
      const response = await searchEquipment(search);
      if (response.data && response.data.length > 0) {
        setDisplayEquipment(response.data);
      } else {
        setSearchNotFound(true);
        setDisplayEquipment([]);
      }
    } catch (error) {
      setError("Error searching for equipment");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = () => {
    if (modalAction === "delete") {
      handleDelete();
    } else if (modalAction === "status") {
      handleStatusUpdate();
    } else if (modalAction === "maintenance") {
      handleMaintenanceUpdate();
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

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3 shadow-inner">
                <svg
                  className="w-6 h-6 text-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                Equipment Inventory
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white border-opacity-20">
                <svg
                  className="w-5 h-5 text-red opacity-80 mr-2"
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
                <span className="text-red font-medium">Total: {equipment.length} items</span>
              </div>
              
              <Link to="/add-equipment">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow flex items-center transition-colors duration-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add New Equipment
                </button>
              </Link>
            </div>
          </div>

          <FilterButtons 
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            statusCounts={getStatusCounts()}
          />

          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            loading={loading}
            error={error}
            searchNotFound={searchNotFound}
          />

          <div className="hidden md:block overflow-x-auto rounded-lg mb-0">
            {loading ? (
              <LoadingSkeletons.TableSkeleton />
            ) : displayEquipment.length > 0 ? (
              <TableView
                displayEquipment={displayEquipment}
                itemUpdates={itemUpdates}
                handleInputChange={handleInputChange}
                confirmStatusUpdate={confirmStatusUpdate}
                confirmMaintenanceUpdate={confirmMaintenanceUpdate}
                formatDateForInput={formatDateForInput}
                setModalAction={setModalAction}
                openDeleteModal={openDeleteModal}
              />
            ) : (
              <EmptyState view="table" />
            )}
          </div>

          <div className="md:hidden p-4">
            {loading ? (
              <LoadingSkeletons.CardSkeleton />
            ) : displayEquipment.length > 0 ? (
              <CardView
                displayEquipment={displayEquipment}
                itemUpdates={itemUpdates}
                handleInputChange={handleInputChange}
                confirmStatusUpdate={confirmStatusUpdate}
                confirmMaintenanceUpdate={confirmMaintenanceUpdate}
                formatDateForInput={formatDateForInput}
                setModalAction={setModalAction}
                openDeleteModal={openDeleteModal}
              />
            ) : (
              <EmptyState view="card" />
            )}
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal*/}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={modalAction === "delete" ? "Confirm Deletion" : 
               modalAction === "status" ? "Confirm Status Update" : 
               "Confirm Maintenance Update"}
        message={modalMessage}
        confirmText={modalAction === "delete" ? "Delete" : 
                   modalAction === "status" ? "Update Status" : 
                   "Update Maintenance"}
        type="warning"
        showCancel={true}
      />

      {/* Success Modal*/}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onConfirm={() => setIsSuccessModalOpen(false)}
        title="Success!"
        message={modalMessage}
        confirmText="Great!"
        type="success"
        showCancel={false}
      />

      {/* Error Modal*/}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        onConfirm={() => setIsErrorModalOpen(false)}
        title="Error"
        message={modalMessage}
        confirmText="OK"
        type="danger"
        showCancel={false}
      />
    </div>
  );
};

export default EquipmentList;