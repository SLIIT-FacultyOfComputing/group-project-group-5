import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/header";
import Footer from "../components/Footer";

const MemberProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [memberData, setMemberData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    membershipType: 'Premium',
    status: 'Active',
    joinDate: '2024-01-15',
    lastVisit: '2024-03-20',
    address: '123 Fitness St, Workout City, WC 12345',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543',
    fitnessGoals: 'Build muscle and improve endurance',
    medicalConditions: 'None',
    preferredWorkoutTime: 'Evening (6-8 PM)',
    membershipHistory: [
      { type: 'Premium', startDate: '2024-01-15', endDate: '2024-04-15', status: 'Current' },
      { type: 'Basic', startDate: '2023-10-15', endDate: '2024-01-14', status: 'Past' }
    ],
    attendance: {
      totalVisits: 45,
      lastMonthVisits: 12,
      currentStreak: 5
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to update member information
    console.log('Updating member data:', memberData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-rose-600">
                      {memberData.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-white">{memberData.name}</h1>
                    <p className="text-rose-100">{memberData.membershipType} Member</p>
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
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Profile Information */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={memberData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{memberData.phone}</p>
                      )}
                    </div>
                    <div>
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
                    <div>
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
                  <div>
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
                  <div>
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
                  <div>
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
                      <p className="mt-1 text-gray-900">{memberData.preferredWorkoutTime}</p>
                    )}
                  </div>
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

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors">
                    View Workout Plan
                  </button>
                  <button className="w-full px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors">
                    View QR Code
                  </button>
                  <button className="w-full px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors">
                    Book a Class
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MemberProfile; 