import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createRoutine } from '../../services/api';
import ExerciseSelector from '../../components/ExerciseSelector';

const CreateRoutine = () => {
    // Accept both memberId and id from params for compatibility
    const params = useParams();
    const memberId = params.memberId || params.id;
    const navigate = useNavigate();
    const [routineName, setRoutineName] = useState('Workout Routine Title');
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [error, setError] = useState(null);

    const handleAddExercise = (assignment) => {
        if (!selectedExercises.some((ex) => ex.exercise.id === assignment.exerciseId)) {
            setSelectedExercises([...selectedExercises, assignment]);
            setError(null);
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
            navigate(`/Staff/members`);
        } catch (err) {
            setError('Failed to save routine.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">                        <button 
                            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                            onClick={() => navigate(`/staff/members`)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900">Create Routine</h2>
                        <button 
                            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200"
                            onClick={handleSaveRoutine}
                        >
                            Save Routine
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Routine Title</label>
                        <input
                            type="text"
                            value={routineName}
                            onChange={(e) => setRoutineName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {selectedExercises.length} Exercises in the Routine
                        </h3>
                        {selectedExercises.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No exercises added yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {selectedExercises.map((item) => (
                                    <div key={item.exercise.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">{item.exercise.name}</h4>
                                            <p className="text-gray-600">{item.sets} sets, {item.reps} reps</p>
                                        </div>
                                        <button
                                            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            onClick={() => removeExerciseFromRoutine(item.exercise.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <ExerciseSelector
                            onSelect={handleAddExercise}
                            onCancel={() => {}}
                            isModal={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRoutine;