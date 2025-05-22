import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllAppointments, 
  getAppointmentsByTrainer,
  getEquipment,
  getMembers
} from '../../services/api';
import { getTicketCountBystaffId, getTicketsAssignedToStaff } from '../../services/ticketApi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    membersTotal: 0,
    membersActive: 0,
    equipmentTotal: 0,
    appointmentsToday: 0,
    inProgressTickets: 0 
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const id = localStorage.getItem('userId');
    const staffId = localStorage.getItem('staffId') || id;
    setUserRole(role || '');
    setUserId(id || '');
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        let appointments = [];
        try {
          if (role === 'TRAINER') {
            const appointmentsResponse = await getAppointmentsByTrainer(id);
            appointments = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];
          } else {
            const appointmentsResponse = await getAllAppointments();
            appointments = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];
          }
        } catch (appointmentError) {
          console.error("Error fetching appointments:", appointmentError);
        }
        
        let equipment = [];
        try {
          const equipmentResponse = await getEquipment();
          equipment = Array.isArray(equipmentResponse.data) ? equipmentResponse.data : [];
        } catch (equipmentError) {
          console.error("Error fetching equipment:", equipmentError);
        }
        
        let members = [];
        try {
          const membersResponse = await getMembers();
          console.log("Members response:", membersResponse);
          
          if (membersResponse) {
            if (Array.isArray(membersResponse)) {
              members = membersResponse;
            } else if (membersResponse.members && Array.isArray(membersResponse.members)) {
              members = membersResponse.members;
            } else if (typeof membersResponse === 'object') {
              members = [membersResponse];
            }
            console.log(`Found ${members.length} members`);
          }
        } catch (membersError) {
          console.error("Error fetching members:", membersError);
        }
        
        let inProgressTicketsCount = 0;
        if (staffId) {
          try {
            console.log("Fetching in-progress tickets count for staff ID:", staffId);
            const ticketCountResponse = await getTicketCountBystaffId(staffId);
            console.log("In-progress tickets count response:", ticketCountResponse);
            
            if (ticketCountResponse && ticketCountResponse.data !== undefined) {
              inProgressTicketsCount = parseInt(ticketCountResponse.data, 10) || 0;
            }
            
            console.log("In-progress tickets count:", inProgressTicketsCount);
          } catch (ticketCountError) {
            console.error("Error fetching in-progress tickets count:", ticketCountError);
          }
        }
        
        let tickets = [];
        if (staffId) {
          try {
            console.log("Fetching tickets for staff ID:", staffId);
            
            const ticketsResponse = await getTicketsAssignedToStaff(staffId);
            if (ticketsResponse && Array.isArray(ticketsResponse.data)) {
              tickets = ticketsResponse.data;
            } else if (ticketsResponse && ticketsResponse.data && Array.isArray(ticketsResponse.data.content)) {
              tickets = ticketsResponse.data.content;
            } else if (ticketsResponse && ticketsResponse.data && Array.isArray(ticketsResponse.data.tickets)) {
              tickets = ticketsResponse.data.tickets;
            }
          } catch (ticketError) {
            console.error("Error fetching assigned tickets for staff:", ticketError);
          }
        }
        
        const transformedTickets = Array.isArray(tickets) && tickets.length > 0
          ? tickets.map(item => ({
              id: item.ticketId,
              type: item.ticket?.type,
              description: item.ticket?.description,
              status: item.ticket?.status,
              priority: item.ticket?.priority,
              createdAt: item.ticket?.createdAt,
              updatedAt: item.ticket?.updatedAt,
              staffName: item.staff?.name,
              staffRole: item.staff?.role
            }))
          : [];
        const sortedTickets = transformedTickets.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.updatedAt || 0);
          const dateB = new Date(b.createdAt || b.updatedAt || 0);
          return dateB - dateA;
        });
        setRecentTickets(sortedTickets.slice(0, 3));
        
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = appointments.filter(app => 
          app.date && app.date.startsWith(today)
        ).length;
        
        const totalMemberCount = members.length;
        const activeMembers = members.filter(member => member.status && member.status.toUpperCase() === 'ACTIVE').length;
        
        console.log("Setting stats:", {
          membersTotal: totalMemberCount,
          membersActive: activeMembers,
          equipmentTotal: equipment.length,
          appointmentsToday: todaysAppointments,
          inProgressTickets: inProgressTicketsCount
        });
        
        setStats({
          membersTotal: totalMemberCount,
          membersActive: activeMembers,
          equipmentTotal: equipment.length,
          appointmentsToday: todaysAppointments,
          inProgressTickets: inProgressTicketsCount
        });
        
        setRecentAppointments(appointments.slice(0, 3)); 
        setRecentTickets(sortedTickets.slice(0, 3));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusBadgeColor = (status) => {
    if (!status) return "bg-gray-500";
    
    const statusStr = String(status).toUpperCase();
     
    if (statusStr === "PENDING") return "bg-yellow-500";
    if (statusStr === "ACCEPTED") return "bg-green-500"; 
    if (statusStr === "REJECTED") return "bg-red-500";
    if (statusStr === "COMPLETED") return "bg-blue-500";
    if (statusStr === "OPEN") return "bg-yellow-500";
    if (statusStr === "IN_PROGRESS") return "bg-blue-500";
    if (statusStr === "CLOSED") return "bg-green-500";
    
    return "bg-gray-500";
  };

  const getPriorityBadgeColor = (priority) => {
    if (!priority) return "bg-gray-500";
    
    const priorityStr = String(priority).toUpperCase();
    
    if (priorityStr === "HIGH") return "bg-red-500";
    if (priorityStr === "MEDIUM") return "bg-yellow-500";
    if (priorityStr === "LOW") return "bg-green-500";
    
    return "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-rose-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
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
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6">
            <div className="flex items-center mb-2">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3 shadow-inner">
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-red"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">Dashboard</h1>
            </div>
            <p className="text-rose-100 text-sm max-w-lg">
              Welcome to the GymSync Staff dashboard. Get a quick overview of gym operations and key metrics.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 bg-white">
            {/* Members Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm border border-blue-200 flex flex-col items-center justify-center transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-blue-200 p-3 rounded-full mb-2">
                <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 font-medium">Total Members</p>
              <p className="text-xl font-bold text-blue-700">{stats.membersTotal}</p>
              <Link to="/staff/members" className="text-xs text-blue-600 hover:underline mt-1">View all</Link>
            </div>

            {/* Active Members */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-sm border border-green-200 flex flex-col items-center justify-center transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-green-200 p-3 rounded-full mb-2">
                <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 font-medium">Active Members</p>
              <p className="text-xl font-bold text-green-700">{stats.membersActive ?? 0}</p>
              <span className="text-xs text-green-600 mt-1">
                {stats.membersTotal > 0 
                  ? `${Math.round((stats.membersActive/stats.membersTotal)*100)}% active` 
                  : '0% active'}
              </span>
            </div>

            {/* Equipment */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl shadow-sm border border-yellow-200 flex flex-col items-center justify-center transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-yellow-200 p-3 rounded-full mb-2">
                <svg className="w-6 h-6 text-yellow-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.121 10.48a1 1 0 00-1.414 0l-7.07 7.071-2.122-2.121a1 1 0 10-1.414 1.414L5.93 19.672a2 2 0 002.828 0l7.778-7.778a1 1 0 000-1.414z" />
                  <path d="M15.536 7.65l2.121-2.122a1 1 0 10-1.414-1.414l-2.122 2.122a1 1 0 101.414 1.414zM14.12 2.122a1 1 0 00-1.414 1.414l2.121 2.121a1 1 0 101.414-1.414l-2.121-2.121z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 font-medium">Equipment</p>
              <p className="text-xl font-bold text-yellow-700">{stats.equipmentTotal}</p>
              <Link to="/staff/equipment-list" className="text-xs text-yellow-600 hover:underline mt-1">View all</Link>
            </div>

            {/* Today's Appointments */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl shadow-sm border border-indigo-200 flex flex-col items-center justify-center transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-indigo-200 p-3 rounded-full mb-2">
                <svg className="w-6 h-6 text-indigo-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 font-medium">Today's Appointments</p>
              <p className="text-xl font-bold text-indigo-700">{stats.appointmentsToday}</p>
              <Link to="/staff/appointments" className="text-xs text-indigo-600 hover:underline mt-1">View all</Link>
            </div>

            {/* Changed from Open Tickets to In Progress Tickets */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm border border-blue-200 flex flex-col items-center justify-center transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-blue-200 p-3 rounded-full mb-2">
                <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 font-medium">In Progress Tickets</p>
              <p className="text-xl font-bold text-blue-700">{stats.inProgressTickets}</p>
              <Link to="/staff/tickets" className="text-xs text-blue-600 hover:underline mt-1">View all</Link>
            </div>
          </div>

          {/* Recent Data Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-50">
            {/* Recent Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Recent Appointments</h3>
                  <Link 
                    to="/staff/appointments" 
                    className="text-xs text-indigo-100 hover:text-white flex items-center"
                  >
                    View All
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                {recentAppointments.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Trainer</th>
                        <th className="px-4 py-3">Member</th>
                        <th className="px-4 py-3">Date & Time</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAppointments.map((appointment) => (
                        <tr key={appointment.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{appointment.trainerName || 'Unknown'}</td>
                          <td className="px-4 py-3">{appointment.traineeName || 'Unknown'}</td>
                          <td className="px-4 py-3">
                            {formatDate(appointment.date)} at {appointment.startTime ? appointment.startTime.substring(0, 5) : 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`${getStatusBadgeColor(appointment.status)} text-white text-xs px-2 py-1 rounded-full`}>
                              {appointment.status || 'UNKNOWN'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No recent appointments found
                  </div>
                )}
              </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">My Assigned Tickets</h3>
                  <Link 
                    to="/staff/tickets" 
                    className="text-xs text-red-100 hover:text-white flex items-center"
                  >
                    View All
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                {recentTickets && recentTickets.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Ticket</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTickets.map((ticket, index) => (
                        <tr key={ticket.id || index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">
                            {ticket.type || ticket.title || ticket.description || "Equipment Issue"}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                              {ticket.priority || 'MEDIUM'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              {ticket.status || 'OPEN'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {formatDate(ticket.createdAt) !== 'N/A' ? formatDate(ticket.createdAt) : 
                             formatDate(ticket.updatedAt) !== 'N/A' ? formatDate(ticket.updatedAt) : 
                             new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <div className="flex justify-center mb-4">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <p className="text-base font-medium">No tickets assigned to you</p>
                    <p className="text-sm mt-1">When tickets are assigned to you, they will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
