import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchRoutineDetails, fetchExerciseStats } from '../services/api';
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
    const [showStats, setShowStats] = useState({});

    useEffect(() => {
        const loadRoutineDetails = async () => {
            try {
                const data = await fetchRoutineDetails(routineId);
                console.log('Routine data:', data); // Debug log
                setRoutine(data);
            } catch (err) {
                console.error('Error loading routine:', err); // Debug log
                setError('Failed to load routine details.');
            }
        };
        loadRoutineDetails();
    }, [routineId]);

    const fetchStats = async (exerciseId) => {
        try {
            const data = await fetchExerciseStats(exerciseId, memberId);
            if (!data || data.length === 0) {
                setError('No statistics available for this exercise.');
                return;
            }
            setStats(prev => ({ ...prev, [exerciseId]: data }));
            renderChart(exerciseId, data);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to load statistics. Please try again later.');
        }
    };

    const renderChart = (exerciseId, data) => {
        const ctx = document.getElementById(`chart-${exerciseId}`).getContext('2d');
        if (chartInstances[exerciseId]) chartInstances[exerciseId].destroy();

        // Create gradient for the line
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(255, 149, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 149, 0, 0)');

        const newChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(stat => `Session ${stat.sessionCounter}`),
                datasets: [{
                    label: 'Weight Progress',
                    data: data.map(stat => stat.weight),
                    borderColor: '#ff9500',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ff9500',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#ff9500',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                            family: "'Inter', sans-serif"
                        },
                        bodyFont: {
                            size: 13,
                            family: "'Inter', sans-serif"
                        },
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Weight: ${context.parsed.y} KG`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12
                            },
                            color: '#6B7280'
                        },
                        title: {
                            display: true,
                            text: 'Session Number',
                            font: {
                                size: 13,
                                weight: 'bold',
                                family: "'Inter', sans-serif"
                            },
                            color: '#374151',
                            padding: { top: 10 }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12
                            },
                            color: '#6B7280',
                            padding: 10
                        },
                        title: {
                            display: true,
                            text: 'Weight (KG)',
                            font: {
                                size: 13,
                                weight: 'bold',
                                family: "'Inter', sans-serif"
                            },
                            color: '#374151',
                            padding: { bottom: 10 }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
        setChartInstances(prev => ({ ...prev, [exerciseId]: newChart }));
    };

    const handleVideoClick = (animationUrl) => {
        console.log('Animation URL:', animationUrl); // Debug log
        if (!animationUrl) {
            setError('No animation available for this exercise.');
            return;
        }
        setShowVideo(animationUrl);
    };

    const handleStatsClick = (exerciseId) => {
        if (!showStats[exerciseId]) {
            fetchStats(exerciseId);
        }
        setShowStats(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
    };

    const handleBack = () => {
        navigate(-1);
    };

    const closeVideo = () => setShowVideo(null);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={handleBack}
                            className="mt-4 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!routine) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-gray-600">Loading routine details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Routine Details</h1>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">{routine.name}</h2>
                    <p className="text-gray-600 mb-6">{routine.description}</p>
                    <div className="space-y-4">
                        {routine.exercises.map((exercise) => (
                            <div key={exercise.id} className="border-b border-gray-200 pb-4 last:border-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{exercise.name}</h3>
                                        <p className="text-gray-600 mt-1">
                                            {exercise.sets} sets × {exercise.reps} reps
                                        </p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleVideoClick(exercise.animationUrl)}
                                            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200 flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            View Tutorial
                                        </button>
                                        <button
                                            onClick={() => handleStatsClick(exercise.id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            {showStats[exercise.id] ? 'Hide Statistics' : 'Show Statistics'}
                                        </button>
                                    </div>
                                </div>
                                {showStats[exercise.id] && (
                                    <div className="mt-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Chart</h4>
                                        <div className="h-[300px]">
                                            <canvas id={`chart-${exercise.id}`}></canvas>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
            {showVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-4 rounded-lg max-w-4xl w-full relative">
                        <button
                            onClick={closeVideo}
                            className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="relative pb-[56.25%] h-0">
                            <video
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src={showVideo}
                                controls
                                autoPlay
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewRoutine;