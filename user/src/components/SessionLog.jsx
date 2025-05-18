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

    useEffect(() => {
        const loadRoutineDetails = async () => {
            try {
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
            navigate(`/dashboard/${memberId}`);
        } catch (err) {
            setError('Failed to log session.');
        }
    };

    if (!routine) return <div className="container"><p>Loading...</p></div>;

    return (
        <div className="container">
            <h2>{routine.name}</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="exercise-list">
                {routine.exercises.map((exercise, exerciseIndex) => (
                    <div key={exercise.id} className="exercise-bar">
                        <div className="exercise-header">
                            <h3>{exercise.name}</h3>
                            <span className="exercise-details">{exercise.equipment}</span>
                        </div>
                        <div className="exercise-details">
                            {exercise.sets} sets x {exercise.reps} reps
                        </div>
                        <div className="exercise-inputs">
                            <div className="input-group">
                                <label className="input-label">Weight (KG)</label>
                                <input
                                    type="number"
                                    className="weight-input"
                                    placeholder="0"
                                    value={exerciseLogs[exerciseIndex].weight}
                                    onChange={(e) => handleWeightChange(exerciseIndex, e.target.value)}
                                />
                            </div>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={exerciseLogs[exerciseIndex].completed}
                                    onChange={() => handleCompletionToggle(exerciseIndex)}
                                />
                                Completed
                            </label>
                        </div>
                    </div>
                ))}
            </div>
            <div className="button-group">
                <button className="submit-button" onClick={handleSubmit}>Finish Session</button>
                <button className="back-button" onClick={() => navigate(`/dashboard/${memberId}`)}>Cancel</button>
            </div>
        </div>
    );
};

export default SessionLog;