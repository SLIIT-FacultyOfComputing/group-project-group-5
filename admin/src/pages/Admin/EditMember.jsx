import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditMember = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        membershipType: '',
        status: ''
    });

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8090/api/members/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMember(response.data);
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    phoneNumber: response.data.phoneNumber,
                    membershipType: response.data.membershipType,
                    status: response.data.status
                });
            } catch (err) {
                setError('Failed to fetch member details');
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:8090/api/members/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }            });
            if (response.status === 200) {
                navigate('/admin/members');
            }
        } catch (err) {
            setError('Failed to update member. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 text-center py-4">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Member</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="membershipType" className="block text-sm font-medium text-gray-700">
                            Membership Type
                        </label>
                        <select
                            id="membershipType"
                            name="membershipType"
                            value={formData.membershipType}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="BASIC">Basic</option>
                            <option value="PREMIUM">Premium</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="SUSPENDED">Suspended</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end space-x-4">                    <button
                        type="button"
                        onClick={() => navigate('/admin/members')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditMember; 