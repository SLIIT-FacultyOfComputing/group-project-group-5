import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMembers, getEquipment, monthlyMaintenanceCost } from '../../services/api';
import { getTicketCountByStatus } from '../../services/ticketApi';

const DashboardHome = () => {  const [stats, setStats] = useState({
    membersTotal: 0,
    membersActive: 0,
    equipmentTotal: 0,
    equipmentMaintenance: 0,
    openTickets: 0,
    maintenanceCost: 0,
    costChange: 0
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch members data
        let members = [];
        try {
          const membersResponse = await getMembers();
          
          if (membersResponse) {
            if (Array.isArray(membersResponse)) {
              members = membersResponse;
            } else if (membersResponse.members && Array.isArray(membersResponse.members)) {
              members = membersResponse.members;
            } else if (typeof membersResponse === 'object') {
              members = [membersResponse];
            }
          }
          
          // Sort members by join date to get most recent
          const sortedMembers = [...members].sort((a, b) => {
            return new Date(b.joinDate || 0) - new Date(a.joinDate || 0);
          });
          
          setRecentMembers(sortedMembers.slice(0, 5));
        } catch (error) {
          console.error("Error fetching members:", error);
        }
        
        // Fetch equipment data
        let equipment = [];
        try {
          const equipmentResponse = await getEquipment();
          equipment = Array.isArray(equipmentResponse.data) ? equipmentResponse.data : [];
          
          // Count equipment in maintenance
          const maintenanceCount = equipment.filter(item => 
            item.status && 
            (item.status.toUpperCase() === 'MAINTENANCE' || 
             item.status.toUpperCase() === 'NEEDS_REPAIR')
          ).length;
          
          setStats(prev => ({
            ...prev,
            equipmentTotal: equipment.length,
            equipmentMaintenance: maintenanceCount
          }));
        } catch (error) {
          console.error("Error fetching equipment:", error);
        }
        
        // Fetch ticket data
        try {
          const openTicketsResponse = await getTicketCountByStatus('OPEN');
          const openTicketsCount = openTicketsResponse?.data ? parseInt(openTicketsResponse.data, 10) : 0;
          
          setStats(prev => ({
            ...prev,
            openTickets: openTicketsCount
          }));        } catch (error) {
          console.error("Error fetching ticket count:", error);
        }
        
        // Fetch maintenance cost data
        try {
          const costResponse = await monthlyMaintenanceCost();
          if (costResponse && Array.isArray(costResponse.data) && costResponse.data.length > 0) {
            // Sort by most recent month
            const sortedCosts = [...costResponse.data].sort((a, b) => {
              return new Date(b.month) - new Date(a.month);
            });
            
            // Latest month's cost
            const latestCost = sortedCosts[0];
            
            // Get previous month's cost if available for comparison
            let costChange = 0;
            if (sortedCosts.length > 1) {
              const previousCost = sortedCosts[1];
              if (previousCost && previousCost.totalCost > 0) {
                // Calculate percentage change
                costChange = ((latestCost.totalCost - previousCost.totalCost) / previousCost.totalCost) * 100;
              }
            }
            
            setStats(prev => ({
              ...prev,
              maintenanceCost: latestCost.totalCost,
              costChange: costChange
            }));
          }
        } catch (error) {
          console.error("Error fetching maintenance costs:", error);
        }
        
        // Calculate member stats
        const totalMemberCount = members.length;
        const activeMembers = members.filter(member => 
          member.status && member.status.toUpperCase() === 'ACTIVE'
        ).length;
        
        setStats(prev => ({
          ...prev,
          membersTotal: totalMemberCount,
          membersActive: activeMembers
        }));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
    
    if (statusStr === "ACTIVE") return "bg-green-500";
    if (statusStr === "INACTIVE") return "bg-red-500";
    if (statusStr === "PENDING") return "bg-yellow-500";
    
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
    <div className="pt-4">

        {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/admin/members"
          className="flex items-center justify-center gap-3 bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-xl shadow-sm border border-blue-200 transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="font-medium">Manage Members</span>
        </Link>
        
        <Link
          to="/admin/equipment"
          className="flex items-center justify-center gap-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-4 rounded-xl shadow-sm border border-yellow-200 transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Manage Equipment</span>
        </Link>
        
        <Link 
          to="/membership/scan-qr"
          className="flex items-center justify-center gap-3 bg-rose-100 hover:bg-rose-200 text-rose-800 p-4 rounded-xl shadow-sm border border-rose-200 transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v2m0 5h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">Scan Member QR</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {/* Members Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm border border-blue-200 flex flex-col items-center justify-center transform transition-all hover:scale-105 hover:shadow-md">
          <div className="bg-blue-200 p-3 rounded-full mb-2">
            <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 font-medium">Total Members</p>
          <p className="text-xl font-bold text-blue-700">{stats.membersTotal}</p>
          <Link to="/admin/members" className="text-xs text-blue-600 hover:underline mt-1">View all</Link>
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
          <Link to="/admin/equipment" className="text-xs text-yellow-600 hover:underline mt-1">View all</Link>
        </div>

        {/* Equipment in Maintenance */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl shadow-sm border border-orange-200 flex flex-col items-center justify-center transform transition-all hover:scale-105 hover:shadow-md">
          <div className="bg-orange-200 p-3 rounded-full mb-2">
            <svg className="w-6 h-6 text-orange-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM12 20c-4.411 0-8-3.589-8-8s3.567-8 7.953-8C16.391 4 20 7.589 20 12s-3.589 8-8 8z" />
              <path d="M11 7h2v7h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 font-medium">In Maintenance</p>
          <p className="text-xl font-bold text-orange-700">{stats.equipmentMaintenance}</p>
          <Link to="/admin/maintenance-list" className="text-xs text-orange-600 hover:underline mt-1">View all</Link>
        </div>

        {/* Open Tickets */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl shadow-sm border border-red-200 flex flex-col items-center justify-center transform transition-all hover:scale-105 hover:shadow-md">
          <div className="bg-red-200 p-3 rounded-full mb-2">
            <svg className="w-6 h-6 text-red-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 font-medium">Open Tickets</p>
          <p className="text-xl font-bold text-red-700">{stats.openTickets}</p>
          <Link to="/admin/tickets" className="text-xs text-red-600 hover:underline mt-1">View all</Link>
        </div>
      </div>

      {/* Maintenance Cost Box */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Maintenance Cost Overview</h3>
            <Link 
              to="/admin/maintenance-cost" 
              className="text-xs text-purple-100 hover:text-white flex items-center"
            >
              Full Report
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-purple-800 font-medium">Latest Month Cost</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${stats.costChange > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {stats.costChange > 0 ? `↑ ${stats.costChange.toFixed(1)}%` : stats.costChange < 0 ? `↓ ${Math.abs(stats.costChange).toFixed(1)}%` : 'No change'}
                </span>
              </div>
              <div className="flex items-end">
                <span className="text-3xl font-bold text-purple-700">${stats.maintenanceCost.toLocaleString()}</span>
                <span className="text-sm text-purple-500 ml-2 mb-1">total</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Includes parts, labor, and external services</p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 flex flex-col justify-between">
              <h4 className="text-purple-800 font-medium mb-2">Quick Actions</h4>
              <div className="flex flex-col space-y-2">
                <Link to="/admin/maintenance-list" className="text-sm text-purple-700 hover:text-purple-900 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View Maintenance Schedule
                </Link>
                <Link to="/admin/maintenance-add" className="text-sm text-purple-700 hover:text-purple-900 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Schedule New Maintenance
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Members */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Recent Members</h3>
            <Link 
              to="/admin/members" 
              className="text-xs text-blue-100 hover:text-white flex items-center"
            >
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          {recentMembers.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Join Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="px-4 py-3">{member.email}</td>
                    <td className="px-4 py-3">{formatDate(member.joinDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`${getStatusBadgeColor(member.status)} text-white text-xs px-2 py-1 rounded-full`}>
                        {member.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        to={`/admin/members/edit/${member.id}`}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </Link>
                      <Link 
                        to={`/admin/view-routine/${member.id}`}
                        className="text-green-600 hover:text-green-800"
                      >
                        Routines
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No members found
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default DashboardHome;
