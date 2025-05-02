import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('members');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

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
        } else if (currentPath.includes('/payments')) {
            setActiveTab('payments');
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    const handleScanQR = () => {
        navigate('/membership/scan-qr');
    };

    const tabs = [
        { id: 'members', label: 'Members', path: '/admin/dashboard/members' },
        { id: 'attendance', label: 'Attendance Log', path: '/admin/dashboard/attendance' },
        { id: 'payments', label: 'Payments', path: '/admin/dashboard/payments' },
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
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleScanQR}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                            >
                                Scan QR
                            </button>
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-rose-600 transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
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

            {/* Admin Footer */}
            <footer className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-center">
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard; 