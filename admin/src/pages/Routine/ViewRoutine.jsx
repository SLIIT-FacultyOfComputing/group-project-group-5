import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRoutines, fetchRoutineDetails, renameRoutine, deleteRoutine, addExerciseToRoutine, removeExerciseFromRoutine } from '../../services/api';
import ExerciseSelector from '../../components/ExerciseSelector';

const ViewRoutine = () => {
    const { id: memberId } = useParams();
    const navigate = useNavigate();
    const [routines, setRoutines] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [menuOpenRoutine, setMenuOpenRoutine] = useState(null);
    const [menuOpenExercise, setMenuOpenExercise] = useState(null);
    const [renameModal, setRenameModal] = useState(null);
    const [addExerciseModal, setAddExerciseModal] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        const loadRoutines = async () => {
            setLoading(true);
            try {
                const data = await fetchRoutines(memberId);
                setRoutines(data || []);
            } catch (err) {
                setError('Failed to load routines.');
            } finally {
                setLoading(false);
            }
        };
        loadRoutines();
    }, [memberId]);

    const handleRoutineClick = async (routineId) => {
        setLoading(true);
        try {
            const data = await fetchRoutineDetails(routineId);
            setSelectedRoutine(data);
            setMenuOpenRoutine(null);
        } catch (err) {
            setError('Failed to load routine details.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setSelectedRoutine(null);
        setError(null);
    };

    const toggleRoutineMenu = (routineId, event) => {
        event.stopPropagation();
        setMenuOpenRoutine(menuOpenRoutine === routineId ? null : routineId);
    };

    const handleRename = (routineId, currentName, event) => {
        event.stopPropagation();
        setRenameModal(routineId);
        setNewName(currentName);
        setMenuOpenRoutine(null);
    };

    const submitRename = async () => {
        if (!newName.trim()) {
            setError('Routine name cannot be empty.');
            return;
        }
        setLoading(true);
        try {
            await renameRoutine(renameModal, newName);
            const data = await fetchRoutines(memberId);
            setRoutines(data || []);
            setRenameModal(null);
            setNewName('');
            setError(null);
        } catch (err) {
            setError(err.response?.status === 404 ? 'Routine not found.' : 'Failed to rename routine.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoutine = async (routineId, event) => {
        event.stopPropagation();
        setLoading(true);
        try {
            await deleteRoutine(routineId);
            const data = await fetchRoutines(memberId);
            setRoutines(data || []);
            setMenuOpenRoutine(null);
            setError(null);
        } catch (err) {
            setError(err.response?.status === 404 ? 'Routine not found.' : 'Failed to delete routine.');
        } finally {
            setLoading(false);
        }
    };

    const toggleExerciseMenu = (exerciseId, event) => {
        event.stopPropagation();
        setMenuOpenExercise(menuOpenExercise === exerciseId ? null : exerciseId);
    };

    const handleDeleteExercise = async (exerciseId, event) => {
        event.stopPropagation();
        setLoading(true);
        try {
            await removeExerciseFromRoutine(selectedRoutine.id, exerciseId);
            const data = await fetchRoutineDetails(selectedRoutine.id);
            setSelectedRoutine(data);
            setMenuOpenExercise(null);
            setError(null);
        } catch (err) {
            setError(err.response?.status === 404 ? 'Exercise or routine not found.' : 'Failed to remove exercise.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddExercise = () => {
        setAddExerciseModal(true);
    };

    const submitAddExercise = async (assignment) => {
        setLoading(true);
        try {
            await addExerciseToRoutine(selectedRoutine.id, {
                exerciseId: assignment.exerciseId,
                sets: assignment.sets,
                reps: assignment.reps
            });
            const data = await fetchRoutineDetails(selectedRoutine.id);
            setSelectedRoutine(data);
            setAddExerciseModal(false);
            setError(null);
        } catch (err) {
            setError(err.response?.status === 404 ? 'Routine or exercise not found.' : 'Failed to add exercise. It may already be assigned.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setRenameModal(null);
        setAddExerciseModal(false);
        setNewName('');
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Routines for Member ID: {memberId}</h2>
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
                    </div>
                )}
                {error && <p className="text-red-600 text-center py-4">{error}</p>}

                {!selectedRoutine ? (
                    <>
                        <div className="space-y-4">
                            {routines.length > 0 ? (
                                routines.map((routine) => (
                                    <div
                                        key={routine.id}
                                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer relative"
                                        onClick={() => handleRoutineClick(routine.id)}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900">{routine.name}</h3>
                                        <div className="absolute top-4 right-4">
                                            <button
                                                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                                                onClick={(e) => toggleRoutineMenu(routine.id, e)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                            {menuOpenRoutine === routine.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                                                        onClick={(e) => handleRename(routine.id, routine.name, e)}
                                                    >
                                                        Rename
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                        onClick={(e) => handleDeleteRoutine(routine.id, e)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No routines found for this member.</p>
                            )}
                        </div>
                        <div className="mt-6 flex space-x-4">
                            <button
                                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200"
                                onClick={() => navigate(`/create-routine/${memberId}`)}
                            >
                                Add Routine
                            </button>                            <button
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => navigate('/admin/members')}
                            >
                                Back to Members
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{selectedRoutine.name}</h3>
                            <button
                                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200"
                                onClick={handleAddExercise}
                            >
                                Add Exercise
                            </button>
                        </div>
                        <div className="space-y-4">
                            {selectedRoutine.exercises && selectedRoutine.exercises.length > 0 ? (
                                selectedRoutine.exercises.map((exercise) => (
                                    <div key={exercise.id} className="bg-gray-50 rounded-lg p-4 relative">
                                        <div className="space-y-2">
                                            <h4 className="text-lg font-semibold text-gray-900">{exercise.name}</h4>
                                            <p className="text-gray-600">Equipment: {exercise.equipment || 'None'}</p>
                                            <p className="text-gray-600">Primary Muscle: {exercise.primaryMuscleGroup || 'N/A'}</p>
                                            <p className="text-gray-600">Secondary Muscle: {exercise.secondaryMuscleGroup || 'N/A'}</p>
                                            <p className="text-gray-600">Sets: {exercise.sets}</p>
                                            <p className="text-gray-600">Reps: {exercise.reps}</p>
                                            {exercise.animationUrl && (
                                                <a 
                                                    href={exercise.animationUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-rose-600 hover:text-rose-700"
                                                >
                                                    View Animation
                                                </a>
                                            )}
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <button
                                                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                                                onClick={(e) => toggleExerciseMenu(exercise.id, e)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                            {menuOpenExercise === exercise.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                        onClick={(e) => handleDeleteExercise(exercise.id, e)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No exercises in this routine.</p>
                            )}
                        </div>
                        <div className="mt-6">
                            <button
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                onClick={handleBackToList}
                            >
                                Back to Routines
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Rename Modal */}
            {renameModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rename Routine</h3>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                            placeholder="Enter new name"
                        />
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitRename}
                                className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                            >
                                Rename
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Exercise Modal */}
            {addExerciseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Exercise</h3>
                        <ExerciseSelector onSelect={submitAddExercise} onCancel={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewRoutine;