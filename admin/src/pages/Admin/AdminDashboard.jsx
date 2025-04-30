import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('members');

    useEffect(() => {
        // Extract the current tab from the URL path
        const currentPath = location.pathname;
        if (currentPath.includes('/members')) {
            setActiveTab('members');
        } else if (currentPath.includes('/equipment')) {
            setActiveTab('equipment');
        } else if (currentPath.includes('/reports')) {
            setActiveTab('reports');
        } else if (currentPath.includes('/attendance')) {
            setActiveTab('attendance');
        }
    }, [location.pathname]);

    const tabs = [
        { id: 'members', label: 'Members', path: '/admin/dashboard/members' },
        { id: 'attendance', label: 'Attendance Log', path: '/admin/dashboard/attendance' },
        { id: 'equipment', label: 'Equipment', path: '/admin/dashboard/equipment' },
        { id: 'reports', label: 'Reports', path: '/admin/dashboard/reports' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Admin Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-rose-600">GYMSYNC Admin</h1>
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-rose-600 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.id}
                                to={tab.path}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-rose-600 text-rose-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard; 