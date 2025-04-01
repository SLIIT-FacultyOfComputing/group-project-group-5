import { useState } from "react";
import { registerMember } from "../../services/api";
import Modal from "../../components/Modal";
import ActionButton from "../../components/ActionButton";
import StatusBadge from "../../components/StatusBadge";

const MemberRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    birthDate: "",
    membershipType: "STANDARD",
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const memberData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      birthDate: formData.birthDate,
      membershipType: formData.membershipType,
      joinDate: formData.joinDate,
    };

    try {
      await registerMember(memberData);
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        birthDate: "",
        membershipType: "STANDARD",
        joinDate: new Date().toISOString().split('T')[0],
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error registering member: ", error);
      setError(error.response?.data?.message || "Failed to register member. Please try again.");
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
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
                  Member Registration
                </h1>
              </div>
              <p className="text-rose-100 text-sm sm:text-base max-w-md">
                Fill out the form below to register as a new member at our gym.
              </p>
            </div>
          </div>
          
          <div className="p-5 sm:p-6 md:p-8">

            {error && (
                <Modal
                type="error"
                title="Registration Error"
                message={error}
                onClose={() => setError(null)}
                />)
            }

            {success && (
                <Modal
                type="success"
                title="Registration Successful"
                message="Member registered successfully! A confirmation email has been sent."
                onClose={() => setSuccess(false)}
                />)
            }
            
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                      First Name 
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="text"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                      Last Name 
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="text"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 space-y-1.5 sm:space-y-2">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                    Email Address 
                    <span className="text-rose-500 ml-1">*</span>
                    <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                      Password 
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="8"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                      Confirm Password 
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                      Phone Number 
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="birthDate" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                      Date of Birth 
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <input
                        id="birthDate"
                        name="birthDate"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 space-y-1.5 sm:space-y-2">
                  <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                    Address
                    <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <input
                      id="address"
                      name="address"
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                      type="text"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  Membership Details
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="membershipType" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                      Membership Type 
                      <span className="text-rose-500 ml-1">*</span>
                      <span className="ml-1 sm:ml-2 text-xs text-gray-400 font-normal">(Required)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <select
                        id="membershipType"
                        name="membershipType"
                        className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block appearance-none transition-all duration-200 shadow-sm hover:border-gray-400"
                        value={formData.membershipType}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="STANDARD" className="py-1">Standard</option>
                        <option value="PREMIUM" className="py-1">Premium</option>
                        <option value="VIP" className="py-1">VIP</option>
                        <option value="STUDENT" className="py-1">Student</option>
                        <option value="SENIOR" className="py-1">Senior</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="joinDate" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                      Join Date 
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <input
                        id="joinDate"
                        name="joinDate"
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                        type="date"
                        value={formData.joinDate}
                        onChange={handleChange}
                        required
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                    
                    <StatusBadge
                    type={formData.membershipType === 'STANDARD' ? 'active' : 'inactive'}
                    text="Standard"
                    />
                    
                    <StatusBadge
                    type={formData.membershipType === 'PREMIUM' ? 'active' : 'inactive'}
                    text="Premium"
                    />
                    
                    <StatusBadge
                    type={formData.membershipType === 'Student' ? 'active' : 'inactive'}
                    text="Student"
                    />

                    /*add memebrship plans*/


                </div>
              </div>

              <div className="pt-2 sm:pt-4">


              <ActionButton
              type="submit"
              loading={loading}
              loadingText="Registering..."
              icon={
              <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>}>

                Register Member

                </ActionButton>
                


              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRegistration;