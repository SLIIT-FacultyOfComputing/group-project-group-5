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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        }
    };

    return (
        <div className="exercise-form-overlay">
            <div className="exercise-form">
                <h3>{isUpdate ? 'Update Exercise' : 'Create Exercise'}</h3>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Equipment:</label>
                    <input
                        type="text"
                        name="equipment"
                        value={formData.equipment}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Primary Muscle Group:</label>
                    <input
                        type="text"
                        name="primaryMuscleGroup"
                        value={formData.primaryMuscleGroup}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Secondary Muscle Group:</label>
                    <input
                        type="text"
                        name="secondaryMuscleGroup"
                        value={formData.secondaryMuscleGroup}
                        onChange={handleChange}
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label>Animation URL:</label>
                    <input
                        type="text"
                        name="animationUrl"
                        value={formData.animationUrl}
                        onChange={handleChange}
                        className="input"
                    />
                </div>
                <div className="form-actions">
                    <button className="save-button" onClick={handleSubmit}>
                        {isUpdate ? 'Update' : 'Create'}
                    </button>
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseForm;