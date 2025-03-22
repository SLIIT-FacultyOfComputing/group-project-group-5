import { useEffect, useState } from "react";
import {
  getEquipment,
  deleteEquipment,
  updateEquipmentStatus,
  getEquipmentById,
  updateEquipmentMaintenanceDate,
  searchEquipmentByName,
} from "../../api";

// Utility function to format date for input (YYYY-MM-DD)
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
  const [searchNotFound, setSearchNotFound] = useState(false); // New state for search not found

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await deleteEquipment(id);
        setEquipment(equipment.filter((item) => item.id !== id));
        setDisplayEquipment(displayEquipment.filter((item) => item.id !== id));
      } catch (error) {
        setError("Failed to delete equipment");
        console.error("Error deleting equipment:", error);
      }
    }
  };

  const handleStatusUpdate = async (id) => {
    const newStatus = itemUpdates[id]?.status || "AVAILABLE";
    try {
      await updateEquipmentStatus(id, newStatus);
      setEquipment(
        equipment.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      setDisplayEquipment(
        displayEquipment.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      setError("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const handleMaintenanceUpdate = async (id) => {
    const newDate = itemUpdates[id]?.maintenanceDate;
    if (!newDate) return;
    
    try {
      await updateEquipmentMaintenanceDate(id, newDate);
      setEquipment(
        equipment.map((item) =>
          item.id === id ? { ...item, lastMaintenanceDate: newDate } : item
        )
      );
      setDisplayEquipment(
        displayEquipment.map((item) =>
          item.id === id ? { ...item, lastMaintenanceDate: newDate } : item
        )
      );
    } catch (error) {
      setError("Failed to update maintenance date");
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
      setSearchNotFound(false); // Reset not found state
      let response;
      if (!isNaN(search)) {
        response = await getEquipmentById(search);
        if (response.data) {
          setDisplayEquipment([response.data]);
        } else {
          setSearchNotFound(true); // Set not found if no data
          setDisplayEquipment(equipment); // Keep original list
        }
      } else {
        response = await searchEquipmentByName(search);
        if (response.data.length > 0) {
          setDisplayEquipment(response.data);
        } else {
          setSearchNotFound(true); // Set not found if empty
          setDisplayEquipment(equipment); // Keep original list
        }
      }
    } catch (error) {
      setError("Error searching equipment");
      setSearchNotFound(true);
      setDisplayEquipment(equipment); // Keep original list on error
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

  return (
    <div className="equipment-app-container">
      <h1 className="equipment-app-title">Equipment Inventory</h1>

      <div className="equipment-search-section">
        <input
          className="equipment-search-input"
          placeholder="Search by ID, Name or Category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="equipment-search-button"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      {searchNotFound && (
        <div className="text-yellow-600 mb-4 text-center">
          No equipment found matching your search
        </div>
      )}

      <div className="equipment-table-container">
        <table className="equipment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Purchase Date</th>
              <th>Last Maintenance</th>
              <th>Warranty Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayEquipment.length > 0 ? (
              displayEquipment.map((item) => (
                <tr key={item.id}>
                  <td data-label="ID">{item.id}</td>
                  <td data-label="Name">{item.name}</td>
                  <td data-label="Category">{item.category}</td>
                  <td data-label="Status">
                    <select
                      className="equipment-status-select"
                      value={itemUpdates[item.id]?.status || item.status}
                      onChange={(e) =>
                        handleInputChange(item.id, "status", e.target.value)
                      }
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="UNAVAILABLE">Unavailable</option>
                      <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                      <option value="OUT_OF_ORDER">Out of Order</option>
                    </select>
                    <button
                      className="equipment-update-button"
                      onClick={() => handleStatusUpdate(item.id)}
                    >
                      Update
                    </button>
                  </td>
                  <td data-label="Purchase Date">{item.purchaseDate}</td>
                  <td data-label="Last Maintenance">
                    <div className="flex flex-col gap-2">
                      <input
                        type="date"
                        className="equipment-maintenance-date-input"
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
                        className="equipment-update-button"
                        onClick={() => handleMaintenanceUpdate(item.id)}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                  <td data-label="Warranty Expiry">{item.warrantyExpiry}</td>
                  <td data-label="Actions">
                    <button
                      className="equipment-delete-button"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  {loading ? "Loading..." : "No equipment available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentList;