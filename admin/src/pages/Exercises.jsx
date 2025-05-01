import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExercises, deleteExercise } from '../services/api';
import ExerciseForm from '../components/ExerciseForm';

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null); // Track which exercise's menu is open
    const navigate = useNavigate();

    useEffect(() => {
        fetchExercisesData();
    }, []);

    const fetchExercisesData = async () => {
        try {
            const response = await fetchExercises();
            setExercises(response || []);
        } catch (err) {
            console.error('Failed to fetch exercises:', err);
            setExercises([]);
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
        <div>
            <h2>Exercises</h2>
            <div className="button-group">
                <button
                    className="create-button"
                    onClick={() => {
                        setEditingExercise(null);
                        setShowForm(true);
                    }}
                >
                    Create Exercise
                </button>
                <button
                    className="cancel-button"
                    onClick={() => navigate('/')}
                >
                    Back to Members
                </button>
            </div>
            {showForm && (
                <ExerciseForm
                    onClose={() => {
                        setShowForm(false);
                        setEditingExercise(null);
                    }}
                    onExerciseCreated={handleExerciseCreated}
                    initialExercise={editingExercise}
                />
            )}
            <div className="exercise-list">
                {exercises.length === 0 ? (
                    <p>No exercises found.</p>
                ) : (
                    exercises.map((exercise) => (
                        <div key={exercise.id} className="exercise-bar">
                            <span>{exercise.name} - {exercise.primaryMuscleGroup}</span>
                            <div className="exercise-actions">
                                <button
                                    className="ellipsis-button"
                                    onClick={() => toggleMenu(exercise.id)}
                                >
                                    ⋮
                                </button>
                                {menuOpen === exercise.id && (
                                    <div className="action-menu">
                                        <button
                                            className="action-menu-item"
                                            onClick={() => handleUpdate(exercise)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="action-menu-item delete"
                                            onClick={() => handleDelete(exercise.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Exercises;