import React, { useState, useEffect } from 'react';
import { fetchExercises } from '../services/api';

const ExerciseSelector = ({ onSelect, onCancel, isModal = false }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState('');
    const [equipment, setEquipment] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [error, setError] = useState(null);

    const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Bicep', 'Tricep', 'Core'];
    const equipmentOptions = ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Kettlebell', 'Resistance Band'];

    useEffect(() => {
        handleSearch();
    }, [searchTerm, primaryMuscleGroup, equipment]); // Trigger search when these change

    const handleSearch = async () => {
        try {
            const response = await fetchExercises(searchTerm, primaryMuscleGroup, equipment);
            setSearchResults(response || []);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Failed to search exercises.');
            setSearchResults([]);
        }
    };

    const handleAddExercise = (exercise) => {
        setSelectedExercise(exercise);
        setSets('');
        setReps('');
    };

    const submitExercise = () => {
        if (!selectedExercise || !sets || !reps || sets <= 0 || reps <= 0) {
            setError('Please select an exercise and enter valid sets and reps.');
            return;
        }
        onSelect({ exerciseId: selectedExercise.id, sets: parseInt(sets), reps: parseInt(reps), exercise: selectedExercise });
        setSelectedExercise(null);
        setSets('');
        setReps('');
        setError(null);
        if (isModal) {
            onCancel();
        }
    };

    const closeModal = () => {
        setSelectedExercise(null);
        setSets('');
        setReps('');
        setError(null);
        onCancel();
    };

    return (
        <div className={isModal ? 'exercise-form-overlay' : 'search-section'}>
            <div className={isModal ? 'exercise-form' : ''}>
                {isModal && (
                    <>
                        <button className="modal-close-button" onClick={closeModal}>×</button>
                        <h3>Add Exercise</h3>
                    </>
                )}
                <div className={isModal ? 'exercise-form-content' : ''}>
                    {!selectedExercise ? (
                        <>
                            <div className="form-group">
                                <label>Search by Name:</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input"
                                    placeholder="Search exercises..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Primary Muscle Group:</label>
                                <select
                                    value={primaryMuscleGroup}
                                    onChange={(e) => setPrimaryMuscleGroup(e.target.value)}
                                    className="input"
                                >
                                    <option value="">All</option>
                                    {muscleGroups.map((group) => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Equipment:</label>
                                <select
                                    value={equipment}
                                    onChange={(e) => setEquipment(e.target.value)}
                                    className="input"
                                >
                                    <option value="">All</option>
                                    {equipmentOptions.map((equip) => (
                                        <option key={equip} value={equip}>{equip}</option>
                                    ))}
                                </select>
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <h3>Results</h3>
                            {searchResults.length === 0 ? (
                                <p>No exercises found.</p>
                            ) : (
                                <div className="exercise-list">
                                    {searchResults.map((exercise) => (
                                        <div key={exercise.id} className="exercise-bar">
                                            <span>{exercise.name} - {exercise.primaryMuscleGroup}</span>
                                            <button
                                                className="create-button"
                                                onClick={() => handleAddExercise(exercise)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Exercise: {selectedExercise.name}</label>
                            </div>
                            <div className="form-group">
                                <label>Sets</label>
                                <input
                                    className="input"
                                    type="number"
                                    min="1"
                                    value={sets}
                                    onChange={(e) => setSets(e.target.value)}
                                    placeholder="Enter number of sets"
                                />
                            </div>
                            <div className="form-group">
                                <label>Reps</label>
                                <input
                                    className="input"
                                    type="number"
                                    min="1"
                                    value={reps}
                                    onChange={(e) => setReps(e.target.value)}
                                    placeholder="Enter number of reps"
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <div className="form-actions">
                                <button className="save-button" onClick={submitExercise}>
                                    Save
                                </button>
                                <button className="cancel-button" onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExerciseSelector;