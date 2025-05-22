import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMemberById, updateMember } from '../../services/memberService';

const MemberProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [memberData, setMemberData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    membershipType: '',
    status: '',
    joinDate: '',
    lastVisit: '',
    address: '',
    emergencyContact: '',
    fitnessGoals: '',
    medicalConditions: '',
    preferredWorkoutTime: '',
    membershipHistory: [],
    attendance: {
      totalVisits: 0,
      lastMonthVisits: 0,
      currentStreak: 0
    }
  });

  useEffect(() => {
    const fetchMemberProfile = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          navigate('/login');
          return;
        }
        
        // Make sure each field gets its correct value, not just email
        const response = await getMemberById(userId);
        console.log('Response from API:', response); // Debug API response
        
        // Transform API response to match our state structure
        setMemberData({
          id: response.id || userId,
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          email: response.email || '',
          phoneNumber: response.phoneNumber || '',
          membershipType: response.membershipType || 'Standard',
          status: response.status || 'Active',
          joinDate: response.joinDate || new Date().toISOString().split('T')[0],
          lastVisit: response.lastVisit || null,
          address: response.address || '',
          emergencyContact: response.emergencyContact || '',
          fitnessGoals: response.fitnessGoals || 'Not specified',
          medicalConditions: response.medicalConditions || 'None',
          preferredWorkoutTime: response.preferredWorkoutTime || 'Not specified',
          membershipHistory: response.membershipHistory || [],
          attendance: response.attendance || {
            totalVisits: 0,
            lastMonthVisits: 0,
            currentStreak: 0
          }
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching member profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchMemberProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Create a copy of the data to send to the API, with proper date handling
      const dataToSubmit = {
        ...memberData,
        // Ensure lastVisit is null instead of "Never" when submitting
        lastVisit: memberData.lastVisit === "Never" ? null : memberData.lastVisit
      };
      await updateMember(memberData.id, dataToSubmit);
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-gray-50 font-sans">        
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto">
            
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
              {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                  <p>{successMessage}</p>
                </div>
              )}
            
              {/* Profile Header */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-rose-600">
                          {memberData.firstName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h1 className="text-2xl font-bold text-white">{memberData.firstName} {memberData.lastName}</h1>                      <p className="text-rose-100">{memberData.membershipType} Member</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                      >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>            </div>

                {/* Profile Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Main Profile Information */}
                <div className="md:col-span-2 space-y-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email Field */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={memberData.email}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{memberData.email}</p>
                          )}
                        </div>
                        
                        {/* Phone Field */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={memberData.phoneNumber}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{memberData.phoneNumber}</p>
                          )}
                        </div>
                        
                        {/* Address Field */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700">Address</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="address"
                              value={memberData.address}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{memberData.address}</p>
                          )}
                        </div>
                        
                        {/* Emergency Contact Field */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="emergencyContact"
                              value={memberData.emergencyContact}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{memberData.emergencyContact}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Fitness Goals Field */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700">Fitness Goals</label>
                        {isEditing ? (
                          <textarea
                            name="fitnessGoals"
                            value={memberData.fitnessGoals}
                            onChange={handleInputChange}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{memberData.fitnessGoals}</p>
                        )}
                      </div>
                      
                      {/* Medical Conditions Field */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                        {isEditing ? (
                          <textarea
                            name="medicalConditions"
                            value={memberData.medicalConditions}
                            onChange={handleInputChange}
                            rows="2"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{memberData.medicalConditions}</p>
                        )}
                      </div>
                      
                      {/* Preferred Workout Time Field */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700">Preferred Workout Time</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="preferredWorkoutTime"
                            value={memberData.preferredWorkoutTime}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                          />
                        ) : (
                          <p className="mt-1 px-3 py-1 bg-rose-50 inline-block rounded-full text-rose-600">
                            {memberData.preferredWorkoutTime}
                          </p>
                        )}
                      </div>
                      
                      {/* Save Button */}
                      {isEditing && (
                        <div className="pt-4">
                          <button
                            type="submit"
                            className="w-full px-4 py-2 bg-gradient-to-r from-rose-700 to-rose-500 text-white rounded-lg shadow-lg hover:from-rose-600 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </form>
                  </div>

                  {/* Membership History */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Membership History</h2>
                    <div className="space-y-4">
                      {memberData.membershipHistory.map((membership, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{membership.type}</p>
                            <p className="text-sm text-gray-500">
                              {membership.startDate} - {membership.endDate}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            membership.status === 'Current'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {membership.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Attendance Stats */}
                <div className="space-y-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Statistics</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-rose-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Visits</p>
                        <p className="text-2xl font-bold text-rose-600">{memberData.attendance.totalVisits}</p>
                      </div>
                      <div className="p-4 bg-rose-50 rounded-lg">
                        <p className="text-sm text-gray-600">Last Month Visits</p>
                        <p className="text-2xl font-bold text-rose-600">{memberData.attendance.lastMonthVisits}</p>
                      </div>
                      <div className="p-4 bg-rose-50 rounded-lg">
                        <p className="text-sm text-gray-600">Current Streak</p>
                        <p className="text-2xl font-bold text-rose-600">{memberData.attendance.currentStreak} days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;