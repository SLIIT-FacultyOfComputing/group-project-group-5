"use client"

import { useState } from "react"
import { addStaff } from "../../services/api"
import { validateNIC, validatePhone, validatePassword } from "../../utils/validation"

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    role: "",
    shift: "",
    startDate: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    // NIC validation
    const nicError = validateNIC(formData.nic)
    if (nicError) errors.nic = nicError

    // Phone validation
    const phoneError = validatePhone(formData.phone)
    if (phoneError) errors.phone = phoneError

    // Role validation
    if (!formData.role) {
      errors.role = "Role is required"
    }

    // Date validation
    if (!formData.startDate) {
      errors.startDate = "Start date is required"
    } else {
      const selectedDate = new Date(formData.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate > today) {
        errors.startDate = "Start date cannot be in the future"
      }
    }

    // Password validation for roles that require it
    if (formData.role === "TRAINER" || formData.role === "RECEPTIONIST" || formData.role === "MANAGER") {
      const passwordError = validatePassword(formData.password)
      if (passwordError) {
        errors.password = passwordError
      }

      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(validationErrors)[0]
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setLoading(true)

    try {
      const dataToSubmit = { ...formData }
      delete dataToSubmit.confirmPassword

      await addStaff(dataToSubmit)
      setSuccess(true)
      setFormData({
        name: "",
        nic: "",
        role: "",
        shift: "",
        startDate: "",
        phone: "",
        password: "",
        confirmPassword: "",
      })
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Error adding staff: ", error)
      setError(error.response?.data?.message || "Failed to add staff. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-full sm:max-w-3xl">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-5 sm:p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-rose-300 bg-opacity-20 backdrop-blur-sm"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 rounded-full bg-white bg-opacity-10"></div>

            <div className="relative">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="bg-white bg-opacity-25 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 shadow-inner">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500"
                    fill="none"
                    stroke="red"
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
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">Add New Staff Member</h1>
              </div>
              <p className="text-rose-100 text-sm sm:text-base max-w-md">
                Fill out the form below to add a new staff member
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 md:p-8">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 flex flex-col xs:flex-row items-start xs:items-center shadow-sm animate-fadeIn">
                <div className="rounded-full bg-rose-100 p-1.5 sm:p-2 mb-2 xs:mb-0 mr-0 xs:mr-3 flex-shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Error</h3>
                  <p className="text-xs sm:text-sm text-rose-600">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 flex flex-col xs:flex-row items-start xs:items-center shadow-sm animate-fadeIn">
                <div className="rounded-full bg-green-100 p-1.5 sm:p-2 mb-2 xs:mb-0 mr-0 xs:mr-3 flex-shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Success</h3>
                  <p className="text-xs sm:text-sm text-green-600">Member added successfully!</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
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
                  Member Information
                </h2>

                <div className="space-y-4 sm:space-y-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Member Name
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                          validationErrors.name ? "border-rose-500" : "border-gray-300"
                        } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                        type="text"
                        placeholder="Enter member name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      {validationErrors.name && <p className="mt-1 text-xs text-rose-500">{validationErrors.name}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="nic"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      NIC
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 mr-2 text-gray-400"
                        >
                          <path d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75zM6.75 9a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM10.5 14.25a3 3 0 00-6 0v.75h6v-.75zm2.25-4.5h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 010-1.5zm0 3h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 010-1.5z" />
                        </svg>
                      </div>
                      <input
                        id="nic"
                        name="nic"
                        className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                          validationErrors.nic ? "border-rose-500" : "border-gray-300"
                        } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                        type="text"
                        placeholder="Enter NIC No. (e.g., 123456789V or 123456789012)"
                        value={formData.nic}
                        onChange={handleChange}
                        required
                      />
                      {validationErrors.nic && <p className="mt-1 text-xs text-rose-500">{validationErrors.nic}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Mobile No.
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 mr-2 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75C3.5 14 10 20.5 17.25 21.75c.69.12 1.31-.38 1.31-1.09v-3a1.25 1.25 0 00-.94-1.22l-3.12-.78a1.25 1.25 0 00-1.28.37l-1.5 1.5a16.49 16.49 0 01-7.5-7.5l1.5-1.5a1.25 1.25 0 00.37-1.28l-.78-3.12A1.25 1.25 0 005.34 3H2.25c-.71 0-1.21.62-1.09 1.31z"
                          />
                        </svg>
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                          validationErrors.phone ? "border-rose-500" : "border-gray-300"
                        } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                        type="text"
                        placeholder="Enter mobile number (e.g., 0712345678)"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                      {validationErrors.phone && <p className="mt-1 text-xs text-rose-500">{validationErrors.phone}</p>}
                    </div>
                  </div>

                  {/* Email input field */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Email
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 mr-2 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0l-8-8-8 8"
                          />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                          validationErrors.email ? "border-rose-500" : "border-gray-300"
                        } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                        type="email"
                        placeholder="Enter email address (optional)"
                        value={formData.email || ""}
                        onChange={handleChange}
                      />
                      {validationErrors.email && <p className="mt-1 text-xs text-rose-500">{validationErrors.email}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Role and Shift Information
                </h2>
                <div className="space-y-1.5 sm:space-y-2">
                  <label
                    htmlFor="role"
                    className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                  >
                    Role
                    <span className="text-rose-500 ml-1">*</span>
                    <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 mr-2 text-gray-400"
                      >
                        <path d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75zM6.75 9a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM10.5 14.25a3 3 0 00-6 0v.75h6v-.75zm2.25-4.5h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 010-1.5zm0 3h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 010-1.5z" />
                      </svg>
                    </div>
                    <select
                      id="role"
                      name="role"
                      className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                        validationErrors.role ? "border-rose-500" : "border-gray-300"
                      } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400 appearance-none`}
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select a role
                      </option>
                      <option value="TRAINER">TRAINER</option>
                      <option value="RECEPTIONIST">RECEPTIONIST</option>
                      <option value="CLEANING_STAFF">CLEANING STAFF</option>
                      <option value="MANAGER">MANAGER</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                    {validationErrors.role && <p className="mt-1 text-xs text-rose-500">{validationErrors.role}</p>}
                  </div>

                  {formData.role === "TRAINER" && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <label
                        htmlFor="shift"
                        className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                      >
                        Shift
                        <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2 text-gray-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6l4 2m6-2a9 9 0 11-4.219-7.516M20.25 4.5V9h-4.5"
                            />
                          </svg>
                        </div>
                        <select
                          id="shift"
                          name="shift"
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                          type="text"
                          placeholder="Enter shift (Morning or Evening)"
                          value={formData.shift}
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            Select a shift
                          </option>
                          <option value="MORNING">MORNING</option>
                          <option value="EVENING">EVENING</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {(formData.role === "TRAINER" || formData.role === "RECEPTIONIST" || formData.role === "MANAGER") && (
                    <>
                      <div className="space-y-1.5 sm:space-y-2">
                        <label
                          htmlFor="password"
                          className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                        >
                          Password
                          <span className="text-rose-500 ml-1">*</span>
                          <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 mr-2 text-gray-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                              />
                            </svg>
                          </div>
                          <input
                            id="password"
                            name="password"
                            className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                              validationErrors.password ? "border-rose-500" : "border-gray-300"
                            } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                            type="password"
                            placeholder="Enter password"
                            value={formData.password || ""}
                            onChange={handleChange}
                            required
                          />
                          {validationErrors.password && (
                            <p className="mt-1 text-xs text-rose-500">{validationErrors.password}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <label
                          htmlFor="confirmPassword"
                          className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                        >
                          Confirm Password
                          <span className="text-rose-500 ml-1">*</span>
                          <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 mr-2 text-gray-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                              />
                            </svg>
                          </div>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                              validationErrors.confirmPassword ? "border-rose-500" : "border-gray-300"
                            } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword || ""}
                            onChange={handleChange}
                            required
                          />
                          {validationErrors.confirmPassword && (
                            <p className="mt-1 text-xs text-rose-500">{validationErrors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Dates Information
                </h2>

                <div className="mt-4 sm:mt-5 space-y-1.5 sm:space-y-2">
                  <label
                    htmlFor="startDate"
                    className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                  >
                    Starting Date
                    <span className="text-rose-500 ml-1">*</span>
                    <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      id="startDate"
                      name="startDate"
                      className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                        validationErrors.startDate ? "border-rose-500" : "border-gray-300"
                      } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split("T")[0]}
                    />
                    {validationErrors.startDate && (
                      <p className="mt-1 text-xs text-rose-500">{validationErrors.startDate}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 sm:pt-4">
                <button
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-rose-700 to-rose-500 text-white font-medium rounded-lg sm:rounded-xl shadow-lg hover:from-rose-800 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding Staff...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"
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
                      Add Staff
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddStaff
