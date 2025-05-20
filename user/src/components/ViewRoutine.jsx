import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchRoutineDetails } from '../services/api';
import Chart from 'chart.js/auto';

const ViewRoutine = () => {
    const { routineId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { memberId } = location.state || { memberId: '1' };
    const [routine, setRoutine] = useState(null);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({});
    const [chartInstances, setChartInstances] = useState({});
    const [showVideo, setShowVideo] = useState(null);

    useEffect(() => {
        const loadRoutineDetails = async () => {
            try {
                const data = await fetchRoutineDetails(routineId);
                setRoutine(data);
            } catch (err) {
                setError('Failed to load routine details.');
            }
        };
        loadRoutineDetails();
    }, [routineId]);

    const fetchStats = async (exerciseId) => {
        try {
            const response = await fetch(`/api/exercise-stats/${exerciseId}/${memberId}`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();
            setStats(prev => ({ ...prev, [exerciseId]: data }));
            renderChart(exerciseId, data);
        } catch (err) {
            setError('Failed to load statistics.');
        }
    };

    const renderChart = (exerciseId, data) => {
        const ctx = document.getElementById(`chart-${exerciseId}`).getContext('2d');
        if (chartInstances[exerciseId]) chartInstances[exerciseId].destroy();
        const newChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(stat => stat.sessionCounter),
                datasets: [{
                    label: 'Weight (KG)',
                    data: data.map(stat => stat.weight),
                    borderColor: '#ff9500',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Session Counter' } },
                    y: { title: { display: true, text: 'Weight (KG)' }, beginAtZero: true }
                }
            }
        });
        setChartInstances(prev => ({ ...prev, [exerciseId]: newChart }));
    };

    const closeVideo = () => setShowVideo(null);

    if (!routine) return <div className="container"><p>Loading...</p></div>;

    return (
        <div className="container">
            <h2>{routine.name}</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="exercise-list">
                {routine.exercises.map((exercise) => (
                    <div key={exercise.id} className="exercise-bar">
                        <div className="exercise-header">
                            <h3>{exercise.name}</h3>
                            <span className="exercise-details">{exercise.equipment}</span>
                        </div>
                        <div className="exercise-details">
                            {exercise.sets} sets x {exercise.reps} reps
                        </div>
                        <button
                            className="start-button"
                            onClick={() => fetchStats(exercise.id)}
                        >
                            Show Statistics
                        </button>
                        <button
                            className="start-button"
                            onClick={() => setShowVideo(exercise.id)}
                            disabled={!exercise.animationUrl}
                        >
                            Show Tutorial
                        </button>
                        <canvas id={`chart-${exercise.id}`} style={{ maxHeight: '200px' }}></canvas>
                        {stats[exercise.id] && stats[exercise.id].length === 0 && <p>No previous data</p>}
                        {showVideo === exercise.id && exercise.animationUrl && (
                            <div className="video-popup" onClick={closeVideo}>
                                <div className="video-content" onClick={e => e.stopPropagation()}>
                                    <video
                                        src={exercise.animationUrl}
                                        controls
                                        autoPlay
                                        onError={() => setError('Failed to load video. Check the file path or URL.')}
                                        style={{ maxWidth: '600px', maxHeight: '500px' }}
                                    />
                                    <button className="close-button" onClick={closeVideo}>X</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="button-group">
                <button className="back-button" onClick={() => navigate(`/dashboard/${memberId}`)}>Back</button>
            </div>
        </div>
    );
};

export default ViewRoutine;