import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MemberDashboard = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8090/api/members/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMember(response.data);
      } catch (err) {
        setError('Failed to fetch member data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!member) return <div>Member not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Member Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <p><span className="font-medium">Name:</span> {member.firstName} {member.lastName}</p>
            <p><span className="font-medium">Email:</span> {member.email}</p>
            <p><span className="font-medium">Phone:</span> {member.phoneNumber}</p>
            <p><span className="font-medium">Address:</span> {member.address}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Membership Details</h2>
            <p><span className="font-medium">Membership Type:</span> {member.membershipType}</p>
            <p><span className="font-medium">Status:</span> {member.status}</p>
            <p><span className="font-medium">Join Date:</span> {new Date(member.joinDate).toLocaleDateString()}</p>
            <p><span className="font-medium">Last Visit:</span> {member.lastVisit ? new Date(member.lastVisit).toLocaleDateString() : 'Never'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard; 