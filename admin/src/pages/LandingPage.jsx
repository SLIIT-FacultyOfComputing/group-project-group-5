import React from 'react';
import { Link } from 'react-router-dom';
import MemberList from '../components/MemberList';

const LandingPage = ({ members }) => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Members</h2>
                    <Link to="/exercises">
                        <button className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200">
                            Manage Exercises
                        </button>
                    </Link>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <MemberList members={members} />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;