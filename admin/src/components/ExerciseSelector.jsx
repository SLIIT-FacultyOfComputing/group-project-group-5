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
    const [loading, setLoading] = useState(false);

    const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Bicep', 'Tricep', 'Core'];
    const equipmentOptions = ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Kettlebell', 'Resistance Band'];

    useEffect(() => {
        handleSearch();
    }, [searchTerm, primaryMuscleGroup, equipment]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await fetchExercises(searchTerm, primaryMuscleGroup, equipment);
            setSearchResults(response || []);
            setError(null);
        } catch (err) {
            setError('Failed to search exercises.');
            setSearchResults([]);
        } finally {
            setLoading(false);
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
        <div className={isModal ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' : ''}>
            <div className={isModal ? 'bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full' : 'w-full'}>
                {isModal && (
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Add Exercise</h3>
                        <button 
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            onClick={closeModal}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {!selectedExercise ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
                                    placeholder="Search exercises..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Muscle Group</label>
                                <select
                                    value={primaryMuscleGroup}
                                    onChange={(e) => setPrimaryMuscleGroup(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
                                >
                                    <option value="">All</option>
                                    {muscleGroups.map((group) => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                                <select
                                    value={equipment}
                                    onChange={(e) => setEquipment(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
                                >
                                    <option value="">All</option>
                                    {equipmentOptions.map((equip) => (
                                        <option key={equip} value={equip}>{equip}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>
                            {loading ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No exercises found.</p>
                            ) : (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {searchResults.map((exercise) => (
                                        <div key={exercise.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-all duration-200">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">{exercise.name}</h4>
                                                <p className="text-gray-600">{exercise.primaryMuscleGroup}</p>
                                            </div>
                                            <button
                                                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200"
                                                onClick={() => handleAddExercise(exercise)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Selected Exercise</h4>
                            <p className="text-gray-600">{selectedExercise.name}</p>
                            <p className="text-gray-500 text-sm">{selectedExercise.primaryMuscleGroup}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sets</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={sets}
                                    onChange={(e) => setSets(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
                                    placeholder="Enter number of sets"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reps</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={reps}
                                    onChange={(e) => setReps(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
                                    placeholder="Enter number of reps"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200"
                                onClick={submitExercise}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciseSelector;