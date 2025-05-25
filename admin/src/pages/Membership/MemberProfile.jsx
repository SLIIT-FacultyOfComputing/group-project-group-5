import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MemberProfile = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8090/api/members/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMember(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member profile:', error);
        setError('Failed to load member profile');
        setLoading(false);
      }
    };

    fetchMemberProfile();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8090/api/members/${id}`, member, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating member profile:', error);
      setError('Failed to update member profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Member Profile</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-300"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                {member.firstName.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{member.firstName} {member.lastName}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                member.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {member.status}
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Membership Type</h3>
                <p className="mt-1 text-sm text-gray-900">{member.membershipType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p className="mt-1 text-sm text-gray-900">{member.joinDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Visit</h3>
                <p className="mt-1 text-sm text-gray-900">{member.lastVisit || 'Never'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Member Information</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={member.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={member.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={member.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={member.emergencyContact}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Fitness Goals</label>
                  <textarea
                    name="fitnessGoals"
                    value={member.fitnessGoals}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                  <textarea
                    name="medicalConditions"
                    value={member.medicalConditions}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Workout Time</label>
                  <select
                    name="preferredWorkoutTime"
                    value={member.preferredWorkoutTime}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm disabled:bg-gray-100"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile; 