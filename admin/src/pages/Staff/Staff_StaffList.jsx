"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getStaff, searchStaffByName, deleteStaff } from "../../services/api"

const StaffList = () => {
  const [staff, setStaff] = useState([])
  const [displayStaff, setDisplayStaff] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("table")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true)
        const response = await getStaff()
        setStaff(response.data)
        setDisplayStaff(response.data)
      } catch (error) {
        setError("Failed to fetch staff")
        console.error("Error fetching staff:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStaff()
  }, [])

  const handleSearch = async () => {
    if (!search.trim()) {
      setDisplayStaff(staff)
      setCurrentPage(1)
      return
    }

    try {
      setLoading(true)
      const response = await searchStaffByName(search)
      setDisplayStaff(response.data.length > 0 ? response.data : [])
      setCurrentPage(1)
    } catch (error) {
      setError("Error searching staff")
      console.error("Error searching staff:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(newDirection)

    const sortedStaff = [...displayStaff].sort((a, b) => {
      if (a[field] === null) return 1
      if (b[field] === null) return -1

      if (typeof a[field] === "string") {
        return newDirection === "asc" ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field])
      } else {
        return newDirection === "asc" ? a[field] - b[field] : b[field] - a[field]
      }
    })

    setDisplayStaff(sortedStaff)
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "TRAINER":
        return "bg-blue-500"
      case "RECEPTIONIST":
        return "bg-green-500"
      case "CLEANING_STAFF":
        return "bg-yellow-500"
      case "MANAGER":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSortIcon = (field) => {
    if (field !== sortField) return null

    return sortDirection === "asc" ? (
      <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    )
  }

  const getStaffStats = () => {
    const roleCount = staff.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1
      return acc
    }, {})

    return {
      total: staff.length,
      roles: roleCount,
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = displayStaff.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(displayStaff.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const stats = getStaffStats()

  const handleDeleteClick = (staff) => {
    setStaffToDelete(staff)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return
    
    try {
      setLoading(true)
      await deleteStaff(staffToDelete.nic)
      
      const updatedStaff = staff.filter(member => member.nic !== staffToDelete.nic)
      setStaff(updatedStaff)
      setDisplayStaff(updatedStaff)
      
      setShowDeleteModal(false)
      setStaffToDelete(null)
    } catch (error) {
      console.error("Error deleting staff:", error)
      setError("Failed to delete staff member. Please try again.")
    } finally {
      setLoading(false)
    }
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">Staff Overview</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-rose bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white border-opacity-20">
                <svg
                  className="w-5 h-5 text-white opacity-80 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 17v-3H8v-7c0-1.1.9-2 2-2h6V2l5 5-5 5V9h-6v3h8v7c0 1.1-.9 2-2 2H8v3l-5-5 5-5z" />
                </svg>
                <span className="text-white font-medium">Total: {stats.total} members</span>
              </div>
              <Link
                to="/admin/staff/add-staff"
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
                <span className="font-medium">Add Staff</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Trainers</p>
                <p className="text-lg font-semibold">{stats.roles.TRAINER || 0}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm7 9H5v-1c0-1.66 2.34-3 5-3h4c2.66 0 5 1.34 5 3v1z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Receptionists</p>
                <p className="text-lg font-semibold">{stats.roles.RECEPTIONIST || 0}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.36 10.27L12 2.91 4.64 10.27C3.09 11.82 2.41 14.1 3.13 16.32c.63 1.94 2.02 3.33 3.96 3.96 2.22.72 4.5.04 6.05-1.5l.32-.32.32.32c1.55 1.55 3.83 2.23 6.05 1.5 1.94-.63 3.33-2.02 3.96-3.96.72-2.22.04-4.5-1.5-6.05z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Cleaning Staff</p>
                <p className="text-lg font-semibold">{stats.roles.CLEANING_STAFF || 0}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Managers</p>
                <p className="text-lg font-semibold">{stats.roles.MANAGER || 0}</p>
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
                  placeholder="Search by name..."
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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-rose-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading staff data...</p>
            </div>
          ) : displayStaff.length === 0 ? (
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Staff Found</h3>
              <p className="text-gray-500 max-w-md mb-6">
                We couldn't find any staff members matching your search criteria. Try adjusting your search or add a new
                staff member.
              </p>
              <Link
                to="/admin/staff/add-staff"
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
                Add New Staff Member
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-white uppercase bg-rose-600">
                  <tr>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">Name {getSortIcon("name")}</div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("nic")}
                    >
                      <div className="flex items-center">NIC {getSortIcon("nic")}</div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("role")}
                    >
                      <div className="flex items-center">Role {getSortIcon("role")}</div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("phone")}
                    >
                      <div className="flex items-center">Phone {getSortIcon("phone")}</div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("shift")}
                    >
                      <div className="flex items-center">Shift {getSortIcon("shift")}</div>
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-rose-700 transition-colors"
                      onClick={() => handleSort("startDate")}
                    >
                      <div className="flex items-center">Start Date {getSortIcon("startDate")}</div>
                    </th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((member) => (
                    <tr key={member.nic} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{member.name}</td>
                      <td className="px-6 py-4">{member.nic}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`${getRoleBadgeColor(member.role)} text-white text-xs px-2.5 py-1 rounded-full`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">{member.phone || "N/A"}</td>
                      <td className="px-6 py-4">
                        {member.shift ? (
                          <span className={`bg-gray-200 text-gray-800 text-xs px-2.5 py-1 rounded-full`}>
                            {member.shift}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4">{member.startDate}</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <Link
                          to={`/admin/staff/update-staff/${member.nic}`}
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg inline-flex items-center hover:bg-rose-700 transition-colors shadow-sm hover:shadow transform hover:scale-105"
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
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(member)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg inline-flex items-center hover:bg-red-700 transition-colors shadow-sm hover:shadow transform hover:scale-105"
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
          {displayStaff.length > 0 && (
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, displayStaff.length)} of{" "}
                {displayStaff.length} staff members
              </p>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Staff Member</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this staff member? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffList
