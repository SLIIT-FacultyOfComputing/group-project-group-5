import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRoutines } from '../services/api';

const MemberDashboard = () => {
    const { memberId } = useParams();
    const effectiveMemberId = memberId || '1'; // Fallback to member ID 1
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRoutines = async () => {
            setLoading(true);
            try {
                const data = await fetchRoutines(effectiveMemberId);
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
    }, [effectiveMemberId]);

    if (loading) return <div className="container"><p>Loading...</p></div>;
    if (error) return <div className="container"><p className="error-message">{error}</p></div>;

    return (
        <div className="container">
            <h1>My Routines</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="routine-list">
                {routines.length > 0 ? (
                    routines.map((routine) => (
                        <div key={routine.id} className="routine-bar">
                            <h3>{routine.name}</h3>
                            <div className="button-group">
                                <Link
                                    to={`/view-routine/${routine.id}`}
                                    state={{ memberId: effectiveMemberId }}
                                >
                                    <button className="start-button">View Routine</button>
                                </Link>
                                <Link
                                    to={`/session/${routine.id}`}
                                    state={{ memberId: effectiveMemberId }}
                                >
                                    <button className="submit-button">Start Session</button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No routines found.</p>
                )}
            </div>
        </div>
    );
};

export default MemberDashboard;