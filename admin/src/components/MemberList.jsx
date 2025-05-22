import React from 'react';
import { Link } from 'react-router-dom';

const MemberList = ({ members }) => {
    return (
        <div className="space-y-4">
            {members.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No members found.</p>
            ) : (
                members.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow duration-200">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-gray-600">ID: {member.id}</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link to={`/create-routine/${member.id}`}>
                                <button className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200">
                                    Create Routine
                                </button>
                            </Link>
                            <Link to={`/view-routine/${member.id}`}>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    View Routines
                                </button>
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MemberList;