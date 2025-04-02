import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/header";
import Footer from "../components/Footer";

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
    dateOfBirth: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // TODO: Implement API call to register user
      console.log('Registration data:', formData);
      navigate('/members'); // Redirect to members page after successful registration
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-full sm:max-w-3xl mt-4 md:mt-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-5 sm:p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-rose-300 bg-opacity-20 backdrop-blur-sm"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 rounded-full bg-white bg-opacity-10"></div>
            
            <div className="relative">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="bg-white bg-opacity-25 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 shadow-inner">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
                  Create New Account
                </h1>
              </div>
              <p className="text-rose-100 text-sm sm:text-base max-w-md">
                Fill out the form below to create a new member account.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                    First Name 
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                    Last Name 
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                  Email 
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                    Password 
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                    Confirm Password 
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="phoneNumber" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                  Phone Number 
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                  Address 
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="dateOfBirth" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                  Date of Birth 
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-rose-700 to-rose-500 text-white text-sm font-medium rounded-lg shadow-lg hover:from-rose-600 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage; 