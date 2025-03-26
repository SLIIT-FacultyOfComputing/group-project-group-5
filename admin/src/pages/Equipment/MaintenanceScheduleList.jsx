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
  updateMaintenanceDescription
} from "../../api";
import { Link } from 'react-router-dom';
import MaintenanceScheduleAdd from "./MaintenanceScheduleAdd";

const MaintenanceScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editDate, setEditDate] = useState({ id: null, date: '' });
  const [editStatus, setEditStatus] = useState({ id: null, status: '' });
  const [editCost, setEditCost] = useState({ id: null, cost: '' });
  const [editDescription, setEditDescription] = useState({ id: null, description: '' });
  const [editTechnician, setEditTechnician] = useState({ id: null, technician: '' });

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await getMaintenanceSchedule();
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
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
        alert("No results found. Showing all equipment.");
        fetchSchedules();
      } else {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Error searching schedules:', error);
      alert("An error occurred while searching. Showing all equipment.");
      fetchSchedules();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteMaintenanceSchedule(id);
        fetchSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const handleUpdateDate = async (id) => {
    if (window.confirm('Are you sure you want to save this date change?')) {
      try {
        await updateMaintenanceDate(id, editDate.date);
        alert('Date updated successfully!');
        setEditDate({ id: null, date: '' });
        fetchSchedules();
      } catch (error) {
        console.error('Error updating date:', error);
        alert('Failed to update date');
      }
    }
  };

  const handleUpdateStatus = async (id) => {
    if (window.confirm('Are you sure you want to save this status change?')) {
      try {
        await updateMaintenanceStatus(id, editStatus.status);
        alert('Status updated successfully!');
        setEditStatus({ id: null, status: '' });
        fetchSchedules();
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status');
      }
    }
  };

  const handleUpdateCost = async (id) => {
    if (window.confirm('Are you sure you want to save this cost change?')) {
      try {
        await updateMaintenanceCost(id, parseFloat(editCost.cost));
        alert('Cost updated successfully!');
        setEditCost({ id: null, cost: '' });
        fetchSchedules();
      } catch (error) {
        console.error('Error updating cost:', error);
        alert('Failed to update cost');
      }
    }
  };

  const handleUpdateDescription = async (id) => {
    if (window.confirm('Are you sure you want to save this description change?')) {
      try {
        await updateMaintenanceDescription(id, editDescription.description);
        alert('Description updated successfully!');
        setEditDescription({ id: null, description: '' });
        fetchSchedules();
      } catch (error) {
        console.error('Error updating description:', error);
        alert('Failed to update description');
      }
    }
  };

  const handleUpdateTechnician = async (id) => {
    if (window.confirm('Are you sure you want to save this technician change?')) {
      try {
        await updateMaintenanceTechnician(id, editTechnician.technician);
        alert('Technician updated successfully!');
        setEditTechnician({ id: null, technician: '' });
        fetchSchedules();
      } catch (error) {
        console.error('Error updating technician:', error);
        alert('Failed to update technician');
      }
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Maintenance Schedules</h2>
        <Link to="/maintenance-list">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Add Schedule
          </button>
        </Link>
      </div>
      
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by ID or Maintenance Type"
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Equipment ID</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Technician</th>
                <th className="p-2 border">Cost</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.scheduleId} className="hover:bg-gray-50">
                  <td className="p-2 border">{schedule.scheduleId}</td>
                  <td className="p-2 border">{schedule.equipmentId}</td>
                  <td className="p-2 border">{schedule.maintenanceType}</td>
                  <td className="p-2 border">
                    {editDescription.id === schedule.scheduleId ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editDescription.description}
                          onChange={(e) => setEditDescription({ ...editDescription, description: e.target.value })}
                          className="p-1 border rounded w-40"
                        />
                        <button
                          onClick={() => handleUpdateDescription(schedule.scheduleId)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {schedule.maintenanceDescription}
                        <button
                          onClick={() => setEditDescription({ id: schedule.scheduleId, description: schedule.maintenanceDescription })}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-2 border">
                    {editDate.id === schedule.scheduleId ? (
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={editDate.date}
                          onChange={(e) => setEditDate({ ...editDate, date: e.target.value })}
                          className="p-1 border rounded"
                        />
                        <button
                          onClick={() => handleUpdateDate(schedule.scheduleId)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {schedule.maintenanceDate}
                        <button
                          onClick={() => setEditDate({ id: schedule.scheduleId, date: schedule.maintenanceDate })}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-2 border">
                    {editStatus.id === schedule.scheduleId ? (
                      <div className="flex gap-2">
                        <select
                          value={editStatus.status}
                          onChange={(e) => setEditStatus({ ...editStatus, status: e.target.value })}
                          className="p-1 border rounded"
                        >
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="INPROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELED">Canceled</option>
                        </select>
                        <button
                          onClick={() => handleUpdateStatus(schedule.scheduleId)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {schedule.status}
                        <button
                          onClick={() => setEditStatus({ id: schedule.scheduleId, status: schedule.status })}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-2 border">
                    {editTechnician.id === schedule.scheduleId ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editTechnician.technician}
                          onChange={(e) => setEditTechnician({ ...editTechnician, technician: e.target.value })}
                          className="p-1 border rounded w-32"
                        />
                        <button
                          onClick={() => handleUpdateTechnician(schedule.scheduleId)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {schedule.technician}
                        <button
                          onClick={() => setEditTechnician({ id: schedule.scheduleId, technician: schedule.technician })}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-2 border">
                    {editCost.id === schedule.scheduleId ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={editCost.cost}
                          onChange={(e) => setEditCost({ ...editCost, cost: e.target.value })}
                          className="p-1 border rounded w-24"
                          step="0.01"
                        />
                        <button
                          onClick={() => handleUpdateCost(schedule.scheduleId)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        ${schedule.maintenanceCost}
                        <button
                          onClick={() => setEditCost({ id: schedule.scheduleId, cost: schedule.maintenanceCost })}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(schedule.scheduleId)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MaintenanceScheduleList;