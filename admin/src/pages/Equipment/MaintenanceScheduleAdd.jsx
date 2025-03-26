import React, { useState } from 'react';
import { addMaintenanceSchedule, getEquipment } from "../../api";

const MaintenanceScheduleAdd = () => {
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEquipments = async () => {
    try {
      const response = await getEquipment();
      setEquipments(response.data);
    } catch (error) {
      console.error('Error fetching equipments:', error);
    }
  };

  React.useEffect(() => {
    fetchEquipments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scheduleData = {
        ...formData,
        maintenanceCost: parseFloat(formData.maintenanceCost)
      };
      await addMaintenanceSchedule(scheduleData);
      setSuccess('Maintenance schedule added successfully!');
      setError('');
      setFormData({
        equipmentId: '',
        maintenanceType: '',
        maintenanceDate: '',
        maintenanceDescription: '',
        status: 'SCHEDULED',
        technician: '',
        maintenanceCost: ''
      });
    } catch (error) {
      setError('Error adding maintenance schedule');
      setSuccess('');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Maintenance Schedule</h2>
      
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block mb-1">Equipment</label>
          <input
            type="text"
            name="equipmentId"
            value={formData.equipmentId}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
        />
        </div>

        <div>
          <label className="block mb-1">Maintenance Type</label>
          <input
            type="text"
            name="maintenanceType"
            value={formData.maintenanceType}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Maintenance Date</label>
          <input
            type="date"
            name="maintenanceDate"
            value={formData.maintenanceDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="maintenanceDescription"
            value={formData.maintenanceDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="3"
          />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Technician</label>
          <input
            type="text"
            name="technician"
            value={formData.technician}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Cost ($)</label>
          <input
            type="number"
            name="maintenanceCost"
            value={formData.maintenanceCost}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            step="0.01"
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Schedule
        </button>
      </form>
    </div>
  );
};

export default MaintenanceScheduleAdd;