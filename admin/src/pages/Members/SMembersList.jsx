import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [displayMembers, setDisplayMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8090/api/members', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMembers(response.data);
        setDisplayMembers(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/admin/login');
        } else {
          setError('Failed to fetch members');
        }
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleEdit = (memberId) => {
    navigate(`/staff/member/edit-member/${memberId}`);
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      setDisplayMembers(members);
      setCurrentPage(1);
      return;
    }

    try {
      const filteredMembers = members.filter(member => 
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()) ||
        (member.phoneNumber && member.phoneNumber.includes(search))
      );
      setDisplayMembers(filteredMembers);
      setCurrentPage(1);
    } catch (err) {
      setError('Error searching members');
    }
  };

  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);

    const sortedMembers = [...displayMembers].sort((a, b) => {
      if (a[field] === null) return 1;
      if (b[field] === null) return -1;

      if (typeof a[field] === "string") {
        return newDirection === "asc" ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
      } else {
        return newDirection === "asc" ? a[field] - b[field] : b[field] - a[field];
      }
    });

    setDisplayMembers(sortedMembers);
  };

  const getSortIcon = (field) => {
    if (field !== sortField) return null;

    return sortDirection === "asc" ? (
      <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    );
  };

  const getMemberStats = () => {
    const membershipTypes = members.reduce((acc, member) => {
      acc[member.membershipType] = (acc[member.membershipType] || 0) + 1;
      return acc;
    }, {});

    const statusCount = members.reduce((acc, member) => {
      acc[member.status] = (acc[member.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: members.length,
      membershipTypes,
      status: statusCount
    };
  };

  const handleDelete = async (memberId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8090/api/members/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 204 || response.status === 200) {
        const updatedMembers = members.filter(member => member.id !== memberId);
        setMembers(updatedMembers);
        setDisplayMembers(updatedMembers);
        setShowDeleteConfirm(false);
        setMemberToDelete(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      } else {
        setError('Failed to delete member. Please try again.');
      }
      setShowDeleteConfirm(false);
      setMemberToDelete(null);
    }
  };

  const confirmDelete = (member) => {
    setMemberToDelete(member);
    setShowDeleteConfirm(true);
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = displayMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayMembers.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const stats = getMemberStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-rose-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading member data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="red"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">Member Management</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white border-opacity-20">
                <svg
                  className="w-5 h-5 text-red opacity-80 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className="text-red font-medium">Total: {stats.total} members</span>
              </div>              <button
                onClick={() => {
                  console.log("Navigating to add member page");
                  navigate('/staff/member/register-member');
                }}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-lg hover:from-rose-700 hover:to-rose-600 transition-all duration-300 flex items-center shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                <span className="font-medium">Add New Member</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Basic Members</p>
                <p className="text-lg font-semibold">{stats.membershipTypes.BASIC || 0}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Premium Members</p>
                <p className="text-lg font-semibold">{stats.membershipTypes.PREMIUM || 0}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Members</p>
                <p className="text-lg font-semibold">{stats.status.ACTIVE || 0}</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-all"
                  placeholder="Search by name, email or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all duration-200 flex items-center shadow-sm hover:shadow"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>

          {displayMembers.length === 0 ? (
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Members Found</h3>
              <p className="text-gray-500 max-w-md mb-6">
                We couldn't find any members matching your search criteria. Try adjusting your search or add a new member.
              </p>
              <button
                onClick={() => navigate('/staff/member/register-member')}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-lg hover:from-rose-700 hover:to-rose-600 transition-all duration-300 flex items-center shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add New Member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-white uppercase bg-rose-600">
                  <tr>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">ID {getSortIcon("id")}</div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("firstName")}
                    >
                      <div className="flex items-center">Name {getSortIcon("firstName")}</div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">Email {getSortIcon("email")}</div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("phoneNumber")}
                    >
                      <div className="flex items-center">Phone {getSortIcon("phoneNumber")}</div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("membershipType")}
                    >
                      <div className="flex items-center">Membership {getSortIcon("membershipType")}</div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">Status {getSortIcon("status")}</div>
                    </th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMembers.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{member.id}</td>
                      <td className="px-6 py-4">{member.firstName} {member.lastName}</td>
                      <td className="px-6 py-4">{member.email}</td>
                      <td className="px-6 py-4">{member.phoneNumber || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className={`${member.membershipType === 'PREMIUM' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} text-xs px-2.5 py-1 rounded-full`}>
                          {member.membershipType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(member.id)}
                          className="px-3 py-1.5 bg-rose-600 text-white rounded-lg inline-flex items-center hover:bg-rose-700 transition-colors shadow-sm hover:shadow transform hover:scale-105"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            ></path>
                          </svg>
                          Edit
                        </button>
                        <Link to={`/staff/member/create-routine/${member.id}`} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg inline-flex items-center hover:bg-blue-700 transition-colors shadow-sm hover:shadow transform hover:scale-105">
                          <svg
                            className="w-4 h-4 mr-1"
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
                          Routine
                        </Link>
                        <Link to={`/staff/member/view-routine/${member.id}`} className="px-3 py-1.5 bg-green-600 text-white rounded-lg inline-flex items-center hover:bg-green-700 transition-colors shadow-sm hover:shadow transform hover:scale-105">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 17h5l-1.405-1.405M19 13V7a2 2 0 00-2-2h-4a2 2 0 00-2 2v6m6 4v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m10 0H5"
                            ></path>
                          </svg>
                          View Routines
                        </Link>
                        <button
                          onClick={() => confirmDelete(member)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg inline-flex items-center hover:bg-red-700 transition-colors shadow-sm hover:shadow transform hover:scale-105"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {displayMembers.length > 0 && (
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, displayMembers.length)} of{" "}
                {displayMembers.length} members
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && memberToDelete && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Member</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {memberToDelete.firstName} {memberToDelete.lastName}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setMemberToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(memberToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersList;