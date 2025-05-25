import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchRoutineDetails, logSession } from '../services/api';

const SessionLog = () => {
    const { routineId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { memberId } = location.state || { memberId: '1' }; // Fallback to '1' if state is missing
    const [routine, setRoutine] = useState(null);
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const loadRoutineDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchRoutineDetails(routineId);
                setRoutine(data);
                const initialLogs = data.exercises.map((exercise) => ({
                    exerciseId: exercise.id,
                    weight: '',
                    completed: false,
                }));
                setExerciseLogs(initialLogs);
            } catch (err) {
                setError('Failed to load routine details.');
            } finally {
                setLoading(false);
            }
        };
        loadRoutineDetails();
    }, [routineId]);

    const handleWeightChange = (exerciseIndex, value) => {
        const updatedLogs = [...exerciseLogs];
        updatedLogs[exerciseIndex].weight = value;
        setExerciseLogs(updatedLogs);
    };

    const handleCompletionToggle = (exerciseIndex) => {
        const updatedLogs = [...exerciseLogs];
        updatedLogs[exerciseIndex].completed = !updatedLogs[exerciseIndex].completed;
        setExerciseLogs(updatedLogs);
    };

    const handleSubmit = async () => {
        try {
            const sessionData = {
                memberId: parseInt(memberId),
                routineId: parseInt(routineId),
                exerciseLogs: exerciseLogs.map((log) => ({
                    exerciseId: log.exerciseId,
                    weight: log.weight ? parseFloat(log.weight) : 0,
                    completed: log.completed,
                })),
            };
            await logSession(sessionData);
            setShowSuccessModal(true);
            // Wait for 1 second before redirecting
            setTimeout(() => {
                navigate(`/members/workouts/${memberId}`);
            }, 1000);
        } catch (err) {
            setError('Failed to log session.');
        }
    };

    const handleBack = () => {
        navigate(`/dashboard/${memberId}`);
    };

    const handleVideoClick = (animationUrl) => {
        setSelectedVideo(animationUrl);
    };

    const handleCloseVideo = () => {
        setSelectedVideo(null);
    };

    if (loading) {
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

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Workout Session</h1>
                <div className="space-y-6">
                    {routine.exercises.map((exercise, exerciseIndex) => (
                        <div key={exercise.id} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{exercise.name}</h2>
                                    <p className="text-gray-600 mt-1">
                                        {exercise.sets} sets × {exercise.reps} reps
                                    </p>
                                </div>
                                {exercise.animationUrl && (
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
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        value={exerciseLogs[exerciseIndex].weight}
                                        onChange={(e) => handleWeightChange(exerciseIndex, e.target.value)}
                                        placeholder="Enter weight"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`completed-${exercise.id}`}
                                        className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                                        checked={exerciseLogs[exerciseIndex].completed}
                                        onChange={() => handleCompletionToggle(exerciseIndex)}
                                    />
                                    <label htmlFor={`completed-${exercise.id}`} className="ml-2 block text-sm text-gray-900">
                                        Completed
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-center space-x-4 mt-8">
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200"
                        >
                            Save Session
                        </button>
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-4 border border-green-200">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Session saved successfully!</p>
                                <p className="text-xs text-gray-500">Redirecting...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Exercise Tutorial</h3>
                            <button
                                onClick={handleCloseVideo}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="aspect-w-16 aspect-h-9">
                            <video
                                src={selectedVideo}
                                controls
                                autoPlay
                                className="w-full h-full rounded-lg"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionLog;