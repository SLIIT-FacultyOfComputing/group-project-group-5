import React, { useState, useEffect } from 'react';
import { createExercise, updateExercise } from '../services/api';

const ExerciseForm = ({ onClose, onExerciseCreated, initialExercise }) => {
    const isUpdate = !!initialExercise;
    const [formData, setFormData] = useState({
        name: '',
        equipment: '',
        primaryMuscleGroup: '',
        secondaryMuscleGroup: '',
        animationUrl: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialExercise) {
            setFormData({
                name: initialExercise.name || '',
                equipment: initialExercise.equipment || '',
                primaryMuscleGroup: initialExercise.primaryMuscleGroup || '',
                secondaryMuscleGroup: initialExercise.secondaryMuscleGroup || '',
                animationUrl: initialExercise.animationUrl || ''
            });
        }
    }, [initialExercise]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isUpdate) {
                await updateExercise(initialExercise.id, formData);
            } else {
                await createExercise(formData);
            }
            onExerciseCreated();
            onClose();
        } catch (err) {
            console.error(isUpdate ? 'Failed to update exercise:' : 'Failed to create exercise:', err);
            setError(isUpdate ? 'Failed to update exercise.' : 'Failed to create exercise.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {isUpdate ? 'Update Exercise' : 'Create Exercise'}
                    </h3>
                    <button 
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        onClick={onClose}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
                                required
                                placeholder="Enter exercise name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Equipment
                            </label>
                            <input
                                type="text"
                                name="equipment"
                                value={formData.equipment}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
                                required
                                placeholder="Enter equipment type"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Muscle Group
                            </label>
                            <input
                                type="text"
                                name="primaryMuscleGroup"
                                value={formData.primaryMuscleGroup}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
                                required
                                placeholder="Enter primary muscle group"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Secondary Muscle Group
                            </label>
                            <input
                                type="text"
                                name="secondaryMuscleGroup"
                                value={formData.secondaryMuscleGroup}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
                                placeholder="Enter secondary muscle group (optional)"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Animation URL
                            </label>
                            <input
                                type="text"
                                name="animationUrl"
                                value={formData.animationUrl}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors duration-200"
                                placeholder="Enter animation URL (optional)"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200 flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isUpdate ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                isUpdate ? 'Update' : 'Create'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExerciseForm;