import { useState } from "react";
import { addEquipment } from "../../api";

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
      alert("Equipment added successfully");
      setFormData({
        name: "",
        category: "",
        status: "AVAILABLE",
        purchaseDate: "",
        lastMaintenanceDate: "",
        warrantyExpiry: "",
      });
    } catch (error) {
      console.error("Error adding equipment: ", error);
      setError("Failed to add equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipment-app-container">
      <h1 className="equipment-app-title">Add New Equipment</h1>
      <form onSubmit={handleSubmit} className="equipment-form">
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-gray-700 font-medium">
            Equipment Name
          </label>
          <input
            id="name"
            name="name"
            className="equipment-form-input"
            type="text"
            placeholder="Enter equipment name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-gray-700 font-medium">
            Category
          </label>
          <input
            id="category"
            name="category"
            className="equipment-form-input"
            type="text"
            placeholder="Enter category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="purchaseDate" className="text-gray-700 font-medium">
            Purchase Date
          </label>
          <input
            id="purchaseDate"
            name="purchaseDate"
            className="equipment-form-input"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="lastMaintenanceDate" className="text-gray-700 font-medium">
            Last Maintenance Date (Optional)
          </label>
          <input
            id="lastMaintenanceDate"
            name="lastMaintenanceDate"
            className="equipment-form-input"
            type="date"
            value={formData.lastMaintenanceDate}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="warrantyExpiry" className="text-gray-700 font-medium">
            Warranty Expiry Date (Optional)
          </label>
          <input
            id="warrantyExpiry"
            name="warrantyExpiry"
            className="equipment-form-input"
            type="date"
            value={formData.warrantyExpiry}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="text-gray-700 font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="equipment-form-select"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="AVAILABLE">Available</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            <option value="UNAVAILABLE">Unavailable</option>
            <option value="OUT_OF_ORDER">Out of Order</option>
          </select>
        </div>

        <button
          className="equipment-form-submit-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Equipment"}
        </button>
      </form>
    </div>
  );
};

export default AddEquipmentForm;