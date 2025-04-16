import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MemberDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // First verify the token and get the logged-in member's ID
                const profileResponse = await axios.get('http://localhost:8090/api/members/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const loggedInMemberId = profileResponse.data.id;

                // Check if the requested dashboard belongs to the logged-in member
                if (parseInt(id) !== loggedInMemberId) {
                    navigate('/login');
                    return;
                }

                // Fetch the member's data
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
                navigate('/login');
            }
        };

        fetchMemberProfile();
    }, [id, navigate]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    if (!member) {
        return <div className="text-center p-4">Member not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Member Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium">Name:</span> {member.firstName} {member.lastName}</p>
                        <p><span className="font-medium">Email:</span> {member.email}</p>
                        <p><span className="font-medium">Phone:</span> {member.phoneNumber}</p>
                        <p><span className="font-medium">Address:</span> {member.address}</p>
                        <p><span className="font-medium">Date of Birth:</span> {member.dateOfBirth}</p>
                    </div>
                </div>

                {/* Membership Information */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Membership Information</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium">Membership Type:</span> {member.membershipType}</p>
                        <p><span className="font-medium">Status:</span> {member.status}</p>
                        <p><span className="font-medium">Join Date:</span> {member.joinDate}</p>
                        <p><span className="font-medium">Last Visit:</span> {member.lastVisit || 'Never'}</p>
                    </div>
                </div>

                {/* Health Information */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Health Information</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium">Fitness Goals:</span> {member.fitnessGoals}</p>
                        <p><span className="font-medium">Medical Conditions:</span> {member.medicalConditions}</p>
                        <p><span className="font-medium">Preferred Workout Time:</span> {member.preferredWorkoutTime}</p>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
                    <p>{member.emergencyContact}</p>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard; 