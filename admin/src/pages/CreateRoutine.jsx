import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExercises, createRoutine } from '../services/api';

const CreateRoutine = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const [routineName, setRoutineName] = useState('Workout Routine Title');
    const [selectedExercises, setSelectedExercises] = useState([]); // { exercise: ExerciseDTO, sets: number, reps: number }
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState('');
    const [equipment, setEquipment] = useState('');

    const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
    const equipmentOptions = ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Kettlebell', 'Resistance Band'];

    const handleSearch = async () => {
        try {
            const response = await fetchExercises(searchTerm, primaryMuscleGroup, equipment);
            setSearchResults(response);
        } catch (err) {
            console.error('Failed to search exercises:', err);
        }
    };

    const addExerciseToRoutine = (exercise) => {
        if (!selectedExercises.some((ex) => ex.exercise.id === exercise.id)) {
            const sets = prompt(`Enter sets for ${exercise.name}:`, '3');
            const reps = prompt(`Enter reps for ${exercise.name}:`, '10');
            if (sets && reps && !isNaN(sets) && !isNaN(reps) && sets > 0 && reps > 0) {
                setSelectedExercises([...selectedExercises, { exercise, sets: parseInt(sets), reps: parseInt(reps) }]);
            }
        }
    };

    const removeExerciseFromRoutine = (exerciseId) => {
        setSelectedExercises(selectedExercises.filter((ex) => ex.exercise.id !== exerciseId));
    };

    const handleSaveRoutine = async () => {
        if (!routineName || selectedExercises.length === 0) {
            alert('Please provide a routine name and at least one exercise.');
            return;
        }
        try {
            const routineRequest = {
                memberId: parseInt(memberId),
                name: routineName,
                exerciseAssignments: selectedExercises.map((item) => ({
                    exerciseId: item.exercise.id,
                    sets: item.sets,
                    reps: item.reps
                }))
            };
            await createRoutine(routineRequest);
            navigate(`/view-routine/${memberId}`);
        } catch (err) {
            console.error('Failed to save routine:', err);
        }
    };

    return (
        <div className="create-routine-container">
            <div className="routine-section">
                <div className="routine-header">
                    <button className="back-button" onClick={() => navigate(`/view-routine/${memberId}`)}>←</button>
                    <h2>Create Routine</h2>
                    <button className="save-button" onClick={handleSaveRoutine}>Save Routine</button>
                </div>
                <div className="form-group">
                    <label>Routine Title</label>
                    <input
                        type="text"
                        value={routineName}
                        onChange={(e) => setRoutineName(e.target.value)}
                        className="input"
                        required
                    />
                </div>
                <h3>{selectedExercises.length} Exercises in the Routine</h3>
                {selectedExercises.length === 0 ? (
                    <div className="no-exercises">
                    </div>
                ) : (
                    <div className="exercise-list">
                        {selectedExercises.map((item) => (
                            <div key={item.exercise.id} className="exercise-bar">
                                {item.exercise.name} - {item.sets} sets, {item.reps} reps
                                <button
                                    className="remove-button"
                                    onClick={() => removeExerciseFromRoutine(item.exercise.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="search-section">
                <h3>Add Exercises</h3>
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
                <button className="search-button" onClick={handleSearch}>Search</button>
                <h3>Results</h3>
                {searchResults.length === 0 ? (
                    <p>No exercises found.</p>
                ) : (
                    <div className="exercise-list">
                        {searchResults.map((exercise) => (
                            <div key={exercise.id} className="exercise-bar">
                                {exercise.name} - {exercise.primaryMuscleGroup}
                                <button
                                    className="add-button"
                                    onClick={() => addExerciseToRoutine(exercise)}
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateRoutine;