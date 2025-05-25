import React, { useState, useEffect } from 'react';
import { getAppointmentsByTrainee, deleteAppointment } from '../../services/Appointment';
import { useNavigate } from 'react-router-dom';

function MyAppointmentsView() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Try different ways to get the user ID
        let userId = localStorage.getItem('userId');
        const memberId = localStorage.getItem('memberId');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Use the first available ID
        userId = userId || memberId || user.id || user.userId;
        
        console.log('User ID from localStorage:', userId);
        
        if (!userId) {
          setError('User ID not found. Please log in again.');
          navigate('/login');
          return;
        }
        
        // Add debugging console logs
        console.log('Fetching appointments for user ID:', userId);
        
        const response = await getAppointmentsByTrainee(userId);
        console.log('Raw API response:', response);
        
        // In most axios responses, the actual data is in the .data property
        // Let's handle various possible response structures
        let appointmentsData = [];
        
        if (response && response.data) {
          // If response has a data property (standard axios response)
          appointmentsData = Array.isArray(response.data) ? response.data : [];
          console.log('Using response.data:', appointmentsData);
        } else if (Array.isArray(response)) {
          // If response is directly an array
          appointmentsData = response;
          console.log('Using direct response array:', appointmentsData);
        }
        console.log('Final appointments data:', appointmentsData);
        
        // Update appointments data
        setAppointments(appointmentsData);
        setTotalAppointments(appointmentsData.length);
        
        // Calculate status counts
        const counts = {
          pending: 0,
          accepted: 0,
          rejected: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0
        };
        
        appointmentsData.forEach(appointment => {
          const status = (appointment.status || 'pending').toLowerCase();
          if (counts.hasOwnProperty(status)) {
            counts[status]++;
          }
        });
        
        setStatusCounts(counts);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Could not load your appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);  const handleCancelAppointment = async (id) => {
    if (!id) {
      setError("Cannot cancel appointment: Invalid appointment ID");
      return;
    }
    
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        console.log('Cancelling appointment with ID:', id);
        const response = await deleteAppointment(id);
        console.log('Cancel appointment response:', response);
        
        // Update the appointment list by filtering out the cancelled appointment
        const updatedAppointments = appointments.filter(apt => apt.id !== id);
        setAppointments(updatedAppointments);
        setTotalAppointments(updatedAppointments.length);
        
        // Update status counts - decrease pending count, increase cancelled count
        setStatusCounts(prevCounts => {
          const appointmentToCancel = appointments.find(apt => apt.id === id);
          const prevStatus = (appointmentToCancel?.status || 'pending').toLowerCase();
          
          return {
            ...prevCounts,
            [prevStatus]: Math.max(0, prevCounts[prevStatus] - 1),
            cancelled: prevCounts.cancelled + 1
          };
        });
        
        // Show a success message
        alert('Appointment cancelled successfully');
      } catch (err) {
        console.error('Error cancelling appointment:', err);
        setError('Failed to cancel appointment. Please try again.');
      }
    }
  };
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);
  const firstItemIndex = appointments.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, appointments.length);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Formatting helpers
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString || 'N/A';
    }
  };
  
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      return timeString.substring(0, 5);
    } catch (error) {
      return timeString || 'N/A';
    }
  };
  
  const getStatusBadgeColor = (status) => {
    status = status?.toUpperCase();
    switch (status) {
      case "PENDING": return "bg-yellow-500";
      case "ACCEPTED": return "bg-green-500";
      case "CONFIRMED": return "bg-green-500";
      case "REJECTED": return "bg-red-500";
      case "COMPLETED": return "bg-blue-500";
      case "CANCELLED": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => navigate(0)} // Refresh the page
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3 shadow-inner">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-5 h-5 text-red"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                My Appointments
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white border-opacity-20">
                <svg
                  className="w-5 h-5 text-red opacity-80 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                </svg>
                <span className="text-black font-medium">Total: {totalAppointments} appointments</span>
              </div>
              
              <button
                onClick={() => navigate('/members/my-appointments/book-appointment')}
                className="flex items-center bg-white text-rose-600 px-4 py-2 rounded-lg border border-white shadow-sm hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                <span className="font-medium">Book Appointment</span>
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-semibold">
                  {statusCounts.pending}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17l-3.59-3.59L4 14l5 5 10-10-1.41-1.42L9 16.17z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Accepted/Confirmed</p>
                <p className="text-lg font-semibold">
                  {statusCounts.accepted + statusCounts.confirmed}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-lg font-semibold">
                  {statusCounts.completed}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Rejected/Cancelled</p>
                <p className="text-lg font-semibold">
                  {statusCounts.rejected + statusCounts.cancelled}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-rose-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Found</h3>
              <p className="text-gray-500 max-w-md mb-6">
                You don't have any appointments scheduled yet.
              </p>
              <button
                onClick={() => navigate('/members/book-appointment')}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-white uppercase bg-rose-600">
                    <tr>
                      <th className="px-6 py-4">Trainer</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAppointments.map((appointment, index) => (
                      <tr key={appointment.id || index} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium">
                          {appointment.trainer?.name || appointment.trainerName || 'Unknown Trainer'}
                        </td>
                        <td className="px-6 py-4">
                          {formatDate(appointment.date)}
                        </td>
                        <td className="px-6 py-4">
                          {formatTime(appointment.time) || formatTime(appointment.startTime)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`${getStatusBadgeColor(appointment.status)} text-white text-xs px-2.5 py-1 rounded-full`}>
                            {appointment.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            disabled={appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED'}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {appointments.length > itemsPerPage && (
                <div className="p-4 border-t border-gray-200 flex flex-col items-center">
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`mx-1 w-10 h-10 rounded-full flex items-center justify-center ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Page number circles */}
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`mx-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          currentPage === i + 1
                            ? "bg-rose-600 text-white shadow-md transform scale-110"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-rose-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`mx-1 w-10 h-10 rounded-full flex items-center justify-center ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mt-3">
                    Showing {firstItemIndex} to {lastItemIndex} of {appointments.length} appointments
                  </p>                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAppointmentsView;
