import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from "../../components/header";
import Footer from "../../components/Footer";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nic: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
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
    setError('');
    setLoading(true);

    try {
      console.log('Submitting login with:', formData);

      const response = await fetch('http://localhost:8090/api/staff/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        throw new Error('Invalid NIC or password');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.staff.nic);
      localStorage.setItem('userName', data.staff.name);
      localStorage.setItem('userRole', data.staff.role);
      
      window.location.href = '/staff/dashboard';
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid NIC or password');
      setLoading(false);
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
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
                  Staff Login
                </h1>
              </div>
              <p className="text-rose-100 text-sm sm:text-base max-w-md">
                Sign in to access the admin dashboard and manage gym operations.
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
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="nic" className="block text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                  NIC 
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block transition-all duration-200 shadow-sm hover:border-gray-400"
                  placeholder="Enter your NIC"
                />
              </div>

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
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-rose-700 to-rose-500 text-white text-sm font-medium rounded-lg shadow-lg hover:from-rose-600 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Go back to{' '}
                        <a href="/" className="font-medium text-rose-600 hover:text-rose-500">
                            Homepage
                        </a>
                    </p>
                </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLogin;
