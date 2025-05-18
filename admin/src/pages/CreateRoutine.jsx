import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createRoutine } from '../services/api';
import ExerciseSelector from '../components/ExerciseSelector';

const CreateRoutine = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const [routineName, setRoutineName] = useState('Workout Routine Title');
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [error, setError] = useState(null);

    const handleAddExercise = (assignment) => {
        if (!selectedExercises.some((ex) => ex.exercise.id === assignment.exerciseId)) {
            setSelectedExercises([...selectedExercises, assignment]);
        } else {
            setError('Exercise already added.');
        }
    };

    const removeExerciseFromRoutine = (exerciseId) => {
        setSelectedExercises(selectedExercises.filter((ex) => ex.exercise.id !== exerciseId));
    };

    const handleSaveRoutine = async () => {
        if (!routineName || selectedExercises.length === 0) {
            setError('Please provide a routine name and at least one exercise.');
            return;
        }
        try {
            const routineRequest = {
                memberId: parseInt(memberId),
                name: routineName,
                exerciseAssignments: selectedExercises.map((item) => ({
                    exerciseId: item.exerciseId,
                    sets: item.sets,
                    reps: item.reps
                }))
            };
            await createRoutine(routineRequest);
            navigate(`/view-routine/${memberId}`);
        } catch (err) {
            setError('Failed to save routine.');
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
                {error && <p className="error-message">{error}</p>}
                <h3>{selectedExercises.length} Exercises in the Routine</h3>
                {selectedExercises.length === 0 ? (
                    <div className="no-exercises"></div>
                ) : (
                    <div className="exercise-list">
                        {selectedExercises.map((item) => (
                            <div key={item.exercise.id} className="exercise-bar">
                                <span>{item.exercise.name} - {item.sets} sets, {item.reps} reps</span>
                                <button
                                    className="create-button"
                                    onClick={() => removeExerciseFromRoutine(item.exercise.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ExerciseSelector
                onSelect={handleAddExercise}
                onCancel={() => {}}
                isModal={false}
            />
        </div>
    );
};

export default CreateRoutine;