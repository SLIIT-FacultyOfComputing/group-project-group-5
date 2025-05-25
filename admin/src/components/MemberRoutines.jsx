import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRoutines } from '../services/api';

const MemberRoutines = () => {
    const { id } = useParams();
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRoutines = async () => {
            setLoading(true);
            try {
                const data = await fetchRoutines(id);
                console.log('API Response:', data);
                setRoutines(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Failed to load routines.');
                console.error('Error fetching routines:', err);
            } finally {
                setLoading(false);
            }
        };
        loadRoutines();
    }, [id]);

    if (loading) return <div className="container"><p>Loading...</p></div>;
    if (error) return <div className="container"><p className="error-message">{error}</p></div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Routines</h1>
                <div className="space-y-4">
                    {routines.map((routine) => (
                        <div key={routine.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{routine.name}</h2>
                                    <p className="text-gray-600 mt-1">{routine.description}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link 
                                        to={`/members/session/${routine.id}`}
                                        state={{ memberId: id }}
                                    >
                                        <button className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200">
                                            Start Session
                                        </button>
                                    </Link>
                                    <Link 
                                        to={`/members/view-routine/${routine.id}`}
                                        state={{ memberId: id }}
                                    >
                                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MemberRoutines;