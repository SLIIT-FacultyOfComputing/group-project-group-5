import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import useTokenExpirationCheck from '../../hooks/useTokenExpirationCheck';

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('members');
    const [activeCategory, setActiveCategory] = useState('members');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [adminName, setAdminName] = useState('Admin');
    
    // Use token expiration check hook
    useTokenExpirationCheck();

    useEffect(() => {
        // Check if admin is authenticated
        if (!authService.isAdminAuthenticated()) {
            navigate('/admin/login');
            return;
        }

        // Check if token is expired
        const token = authService.getToken();
        if (authService.isTokenExpired(token)) {
            authService.logoutAdmin();
            navigate('/admin/login');
            return;
        }

        // Get admin data from service
        const adminData = authService.getAdminData();
        if (adminData && adminData.name) {
            setAdminName(adminData.name);
        }
    }, [navigate]);

    useEffect(() => {
        // Extract the current tab from the URL path
        const currentPath = location.pathname;
        if (currentPath === '/admin' || currentPath === '/admin/dashboard') {
            setActiveTab('dashboard');
            setActiveCategory('dashboard');
        } else if (currentPath.includes('/members')) {
            setActiveTab('members');
            setActiveCategory('members');
        } else if (currentPath.includes('/attendance')) {
            setActiveTab('attendance');
            setActiveCategory('members');
        } else if (currentPath.includes('/payments')) {
            setActiveTab('payments');
            setActiveCategory('members');
        } else if (currentPath.includes('/equipment')) {
            setActiveTab('equipment');
            setActiveCategory('equipment');
        } else if (currentPath.includes('/maintenance-list') || currentPath.includes('/maintenance-add')) {
            setActiveTab('maintenance');
            setActiveCategory('equipment');
        } else if (currentPath.includes('/exercises')) {
            setActiveTab('manage-exercises');
            setActiveCategory('exercises');
        } else if (currentPath.includes('/tickets')) {
            setActiveTab('tickets');
            setActiveCategory('tickets');
        } else if (currentPath.includes('/staff')) {
            setActiveTab('staff');
            setActiveCategory('staff');
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        // Use authService to logout admin
        await authService.logoutAdmin();
        
        // Force a page reload before redirecting
        window.location.href = '/admin/login';
    };

    const handleScanQR = () => {
        navigate('/membership/scan-qr');
    };

    const categories = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: (
                <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            ),
            items: [
                { id: 'dashboard', label: 'Dashboard Home', path: '/admin/dashboard' }
            ]
        },
        {
            id: 'members',
            label: 'Members',
            icon: (
                <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),            items: [
                { id: 'members', label: 'Members List', path: '/admin/members' },
                { id: 'attendance', label: 'Attendance Log', path: '/admin/attendance' },
                { id: 'payments', label: 'Payments', path: '/admin/payments' }
            ]
        },
        {
            id: 'equipment',
            label: 'Equipment',
            icon: (
                <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),            items: [
                { id: 'equipment', label: 'View Gym Equipment', path: '/admin/equipment' },
                { id: 'maintenance', label: 'Maintenance', path: '/admin/maintenance-list' },
                { id: 'maintenance-cost', label: 'Maintenance Cost', path: '/admin/maintenance-cost' }
            ]
        },
        {
            id: 'exercises',
            label: 'Exercises',
            icon: (
                <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            items: [
                { id: 'manage-exercises', label: 'Manage Exercises', path: '/admin/exercises' }
            ]
        },
        {
            id: 'tickets',
            label: 'Tickets',
            icon: (
                <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
            ),            items: [
                { id: 'tickets', label: 'View Tickets', path: '/admin/tickets' },
            ]
        },
        {
            id: 'staff',
            label: 'Staff',
            icon: (
                <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            items: [
                { id: 'staff', label: 'View Staff', path: '/admin/staff' }
            ]
        }
    ];

    const toggleDropdown = (categoryId) => {
        setDropdownOpen(dropdownOpen === categoryId ? null : categoryId);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Admin Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-rose-600">GYMSYNC Admin</h1>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center mr-4">
                                <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-medium">
                                    {adminName.charAt(0)}
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">
                                    Welcome, {adminName}
                                </span>
                            </div>
                            <button
                                onClick={handleScanQR}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v2m0 5h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Scan QR
                            </button>
                            <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile Menu Toggle */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                    >
                        <span className="font-medium text-gray-700">Menu</span>
                        <svg
                            className={`w-5 h-5 transition-transform duration-200 ${mobileMenuOpen ? 'transform rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 neu-convex mb-8">
                    <nav className={`flex flex-col md:flex-row ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
                        {categories.map((category) => (
                            <div key={category.id} className="relative">
                                <div
                                    onClick={() => toggleDropdown(category.id)}
                                    className={`w-full px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center justify-between cursor-pointer transition-all duration-300 ${
                                        activeCategory === category.id
                                            ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        {category.icon}
                                        {category.label}
                                    </div>
                                    <svg
                                        className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                                            dropdownOpen === category.id ? 'transform rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                
                                {/* Dropdown Menu */}
                                {dropdownOpen === category.id && (
                                    <div className="absolute left-0 w-48 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                                        {category.items.map((item) => (
                                            <Link
                                                key={item.id}
                                                to={item.path}
                                                className={`block px-4 py-3 text-sm transition-colors duration-200 ${
                                                    activeTab === item.id
                                                        ? 'bg-rose-50 text-rose-700'
                                                        : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
                                                }`}
                                                onClick={() => {
                                                    setActiveTab(item.id);
                                                    setMobileMenuOpen(false);
                                                    setDropdownOpen(null);
                                                }}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className={`bg-white rounded-xl shadow-lg p-6 ${activeTab !== 'equipment' ? 'glass-effect' : ''}`}>
                    <Outlet />
                </div>
            </main>

            {/* Admin Footer */}
            <footer className="bg-white shadow-sm mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-center">

                    </div>
                </div>
            </footer>

            <style>
                {`
                .neu-convex {
                    background: linear-gradient(145deg, #e2e8ec, #ffffff);
                    box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
                }
                
                .glass-effect {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                @media (max-width: 640px) {
                    .glass-effect {
                        background: rgba(255, 255, 255, 0.1);
                    }
                    
                    .neu-convex {
                        box-shadow: 3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default AdminDashboard;