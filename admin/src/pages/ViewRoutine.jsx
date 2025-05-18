import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRoutines, fetchRoutineDetails, renameRoutine, deleteRoutine, addExerciseToRoutine, removeExerciseFromRoutine } from '../services/api';
import ExerciseSelector from '../components/ExerciseSelector';

const ViewRoutine = () => {
    const { memberId } = useParams();
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
        <div className="container">
            <h2>Routines for Member ID: {memberId}</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            {!selectedRoutine ? (
                <>
                    <div className="routine-list">
                        {routines.length > 0 ? (
                            routines.map((routine) => (
                                <div
                                    key={routine.id}
                                    className="routine-bar"
                                    onClick={() => handleRoutineClick(routine.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h3>{routine.name}</h3>
                                    <div className="exercise-actions">
                                        <button
                                            className="ellipsis-button"
                                            onClick={(e) => toggleRoutineMenu(routine.id, e)}
                                        >
                                            ⋮
                                        </button>
                                        {menuOpenRoutine === routine.id && (
                                            <div className="action-menu">
                                                <button
                                                    className="action-menu-item"
                                                    onClick={(e) => handleRename(routine.id, routine.name, e)}
                                                >
                                                    Rename
                                                </button>
                                                <button
                                                    className="action-menu-item delete"
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
                            <p>No routines found for this member.</p>
                        )}
                    </div>
                    <div className="button-group">
                        <button
                            className="create-button"
                            onClick={() => navigate(`/create-routine/${memberId}`)}
                        >
                            Add Routine
                        </button>
                        <button
                            className="cancel-button"
                            onClick={() => navigate('/')}
                        >
                            Back to Members
                        </button>
                    </div>
                </>
            ) : (
                <div className="container">
                    <div className="routine-header">
                        <h3>{selectedRoutine.name}</h3>
                    </div>
                    <div className="exercise-list">
                        {selectedRoutine.exercises && selectedRoutine.exercises.length > 0 ? (
                            selectedRoutine.exercises.map((exercise) => (
                                <div key={exercise.id} className="exercise-bar">
                                    <div>
                                        <h4>{exercise.name}</h4>
                                        <p>Equipment: {exercise.equipment || 'None'}</p>
                                        <p>Primary Muscle: {exercise.primaryMuscleGroup || 'N/A'}</p>
                                        <p>Secondary Muscle: {exercise.secondaryMuscleGroup || 'N/A'}</p>
                                        <p>Sets: {exercise.sets}</p>
                                        <p>Reps: {exercise.reps}</p>
                                        {exercise.animationUrl && (
                                            <a href={exercise.animationUrl} target="_blank" rel="noopener noreferrer">
                                                View Animation
                                            </a>
                                        )}
                                    </div>
                                    <div className="exercise-actions">
                                        <button
                                            className="ellipsis-button"
                                            onClick={(e) => toggleExerciseMenu(exercise.id, e)}
                                        >
                                            ⋮
                                        </button>
                                        {menuOpenExercise === exercise.id && (
                                            <div className="action-menu">
                                                <button
                                                    className="action-menu-item delete"
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
                            <p>No exercises in this routine.</p>
                        )}
                    </div>
                    <div className="button-group">
                        <button className="create-button" onClick={handleAddExercise}>
                            Add Exercise
                        </button>
                        <button className="cancel-button" onClick={handleBackToList}>
                            Back to Routines
                        </button>
                    </div>
                </div>
            )}

            {renameModal && (
                <div className="exercise-form-overlay">
                    <div className="exercise-form">
                        <h3>Rename Routine</h3>
                        <div className="form-group">
                            <label>Routine Name</label>
                            <input
                                className="input"
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Enter new routine name"
                            />
                        </div>
                        <div className="form-actions">
                            <button className="save-button" onClick={submitRename}>
                                Save
                            </button>
                            <button className="cancel-button" onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {addExerciseModal && (
                <ExerciseSelector
                    onSelect={submitAddExercise}
                    onCancel={closeModal}
                    isModal={true}
                />
            )}
        </div>
    );
};

export default ViewRoutine;