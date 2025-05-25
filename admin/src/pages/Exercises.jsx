import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExercises, deleteExercise } from '../services/api';
import ExerciseForm from '../components/ExerciseForm';

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExercisesData();
    }, []);

    const fetchExercisesData = async () => {
        setLoading(true);
        try {
            const response = await fetchExercises();
            setExercises(response || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch exercises:', err);
            setExercises([]);
            setError('Failed to load exercises. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleExerciseCreated = () => {
        setEditingExercise(null);
        fetchExercisesData();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exercise?')) {
            try {
                await deleteExercise(id);
                setMenuOpen(null);
                fetchExercisesData();
            } catch (err) {
                console.error('Failed to delete exercise:', err);
                setError('Exercise is already in Routines. Failed to delete exercise.');
            }
        }
    };

    const handleUpdate = (exercise) => {
        setEditingExercise(exercise);
        setShowForm(true);
        setMenuOpen(null);
    };

    const toggleMenu = (id) => {
        setMenuOpen(menuOpen === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Exercises</h2>
                    <div className="flex space-x-4">
                        <button
                            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200"
                            onClick={() => {
                                setEditingExercise(null);
                                setShowForm(true);
                            }}
                        >
                            Create Exercise
                        </button>
                        
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
                            <ExerciseForm
                                onClose={() => {
                                    setShowForm(false);
                                    setEditingExercise(null);
                                }}
                                onExerciseCreated={handleExerciseCreated}
                                initialExercise={editingExercise}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {exercises.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No exercises found.</p>
                    ) : (
                        exercises.map((exercise) => (
                            <div key={exercise.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 relative">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                                        <p className="text-gray-600">Primary Muscle: {exercise.primaryMuscleGroup}</p>
                                    </div>
                                    <div className="relative">
                                        <button
                                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                                            onClick={() => toggleMenu(exercise.id)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                        {menuOpen === exercise.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                                                    onClick={() => handleUpdate(exercise)}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(exercise.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Exercises;