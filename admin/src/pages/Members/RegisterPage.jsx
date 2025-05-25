import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    membershipType: 'BASIC',
    emergencyContact: '',
    fitnessGoals: '',
    medicalConditions: '',
    preferredWorkoutTime: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = "Phone number should be 10 digits";
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    
    try {
      // Format the date to ISO format (YYYY-MM-DD)
      const formattedData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : null
      };

      const response = await fetch('http://localhost:8090/api/members/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        
        // Try to parse error response
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
            // If parsing fails, use default message
            console.log('Could not parse error response:', parseError);
            errorMessage = `Registration failed with status ${response.status}`;
        }
        
        throw new Error(errorMessage);
    }
    

      const data = await response.json();
      console.log('Registration successful:', data);
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        membershipType: 'BASIC',
        emergencyContact: '',
        fitnessGoals: '',
        medicalConditions: '',
        preferredWorkoutTime: ''
      });
      
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      setTimeout(() => {
        navigate('/admin/members');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    ></path>
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">Register New Member</h1>
              </div>
              <p className="text-rose-100 text-sm sm:text-base max-w-md">
                Fill out the form below to register a new member
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
                  <p className="text-xs sm:text-sm text-green-600">Member registered successfully!</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Basic Information */}
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
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="firstName"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      First Name
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                          validationErrors.firstName ? "border-rose-500" : "border-gray-300"
                        } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                        type="text"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                      {validationErrors.firstName && <p className="mt-1 text-xs text-rose-500">{validationErrors.firstName}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="lastName"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Last Name
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                          validationErrors.lastName ? "border-rose-500" : "border-gray-300"
                        } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                        type="text"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                      {validationErrors.lastName && <p className="mt-1 text-xs text-rose-500">{validationErrors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Email
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                          validationErrors.email ? "border-rose-500" : "border-gray-300"
                        } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {validationErrors.email && <p className="mt-1 text-xs text-rose-500">{validationErrors.email}</p>}
                    </div>
                  </div>

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
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      {validationErrors.password && <p className="mt-1 text-xs text-rose-500">{validationErrors.password}</p>}
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
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      {validationErrors.confirmPassword && <p className="mt-1 text-xs text-rose-500">{validationErrors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
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
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Phone Number
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
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                          />
                        </svg>
                      </div>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                          validationErrors.phoneNumber ? "border-rose-500" : "border-gray-300"
                        } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                      {validationErrors.phoneNumber && <p className="mt-1 text-xs text-rose-500">{validationErrors.phoneNumber}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="emergencyContact"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Emergency Contact
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
                            d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M12 19.5v.75m0 0v.75m0-.75h.75m-1.5 0h.75"
                          />
                        </svg>
                      </div>
                      <input
                        id="emergencyContact"
                        name="emergencyContact"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="text"
                        placeholder="Name & phone number"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Address
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Optional)</span>
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <input
                        id="address"
                        name="address"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="text"
                        placeholder="Enter address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Information */}
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Membership Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="membershipType"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Membership Type
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
                          <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                          <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <select
                        id="membershipType"
                        name="membershipType"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400 appearance-none"
                        value={formData.membershipType}
                        onChange={handleChange}
                        required
                      >
                        <option value="BASIC">Basic</option>
                        <option value="PREMIUM">Premium</option>
                        <option value="VIP">VIP</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Date of Birth
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
                        id="dateOfBirth"
                        name="dateOfBirth"
                        className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border ${
                          validationErrors.dateOfBirth ? "border-rose-500" : "border-gray-300"
                        } text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400`}
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        max={new Date().toISOString().split("T")[0]}
                      />
                      {validationErrors.dateOfBirth && <p className="mt-1 text-xs text-rose-500">{validationErrors.dateOfBirth}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="preferredWorkoutTime"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Preferred Workout Time
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
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <input
                        id="preferredWorkoutTime"
                        name="preferredWorkoutTime"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="text"
                        placeholder="e.g., Morning, Evening"
                        value={formData.preferredWorkoutTime}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  Additional Information
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="fitnessGoals"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Fitness Goals
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="fitnessGoals"
                      name="fitnessGoals"
                      rows="3"
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                      placeholder="Describe your fitness goals..."
                      value={formData.fitnessGoals}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="medicalConditions"
                      className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center"
                    >
                      Medical Conditions
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="medicalConditions"
                      name="medicalConditions"
                      rows="3"
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                      placeholder="List any medical conditions or allergies..."
                      value={formData.medicalConditions}
                      onChange={handleChange}
                    ></textarea>
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
                      Registering Member...
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
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        ></path>
                      </svg>
                      Register Member
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;