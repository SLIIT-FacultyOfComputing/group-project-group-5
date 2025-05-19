import React, { useState, useEffect } from 'react';
import { getStaffById } from '../../services/api';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const staffId = localStorage.getItem('userId');
        if (!staffId) {
          throw new Error('User not found');
        }
        
        const response = await getStaffById(staffId);
        setProfileData(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "TRAINER":
        return "bg-blue-500";
      case "RECEPTIONIST":
        return "bg-green-500";
      case "CLEANING_STAFF":
        return "bg-yellow-500";
      case "MANAGER":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3 shadow-inner">
                <svg className="w-6 h-6 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">My Profile</h1>
            </div>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p>{error}</p>
              </div>
            </div>
          ) : profileData ? (
            <div className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="bg-gray-100 rounded-full p-8 w-40 h-40 flex items-center justify-center shadow-md">
                    <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  </div>
                </div>

                <div className="md:w-2/3 md:pl-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">{profileData.name}</h2>
                    <div className="mt-1 flex items-center">
                      <span className={`${getRoleBadgeColor(profileData.role)} text-white text-xs px-2.5 py-1 rounded-full`}>
                        {profileData.role}
                      </span>
                      {profileData.shift && (
                        <span className="ml-2 bg-gray-200 text-gray-800 text-xs px-2.5 py-1 rounded-full">
                          {profileData.shift} SHIFT
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">NIC</p>
                      <p className="font-medium">{profileData.nic}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="font-medium">{profileData.phone || 'N/A'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Start Date</p>
                      <p className="font-medium">{formatDate(profileData.startDate)}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <p className="font-medium flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Active
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Link to={`/staff/update-staff/${profileData.nic}`} className="px-4 py-2 bg-rose-600 text-white rounded-lg inline-flex items-center hover:bg-rose-700 transition-colors shadow-sm hover:shadow">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No profile data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
