package com.example.Backend.service;

import com.example.Backend.model.Exercise;
import com.example.Backend.model.Routine;
import com.example.Backend.model.RoutineExercise;
import com.example.Backend.repository.ExerciseRepository;
import com.example.Backend.repository.RoutineExerciseRepository;
import com.example.Backend.repository.RoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

// Custom exception class for error messages
class ExerciseServiceException extends RuntimeException {
    public ExerciseServiceException(String message) {
        super(message);
    }
}

@Service
public class ExerciseService {

    @Autowired
    private final ExerciseRepository exerciseRepository;
    @Autowired
    private final RoutineRepository routineRepository;
    @Autowired
    private RoutineExerciseRepository routineExerciseRepository;

    // Constructor to inject repositories
    public ExerciseService(ExerciseRepository exerciseRepository, RoutineRepository routineRepository) {
        this.exerciseRepository = exerciseRepository;
        this.routineRepository = routineRepository;
    }

    // Create a new exercise
    public Exercise createExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    // Get exercises with optional filters for name, muscle group, and equipment
    public List<Exercise> getAllExercises(String name, String primaryMuscleGroup, String equipment) {
        if (name != null && primaryMuscleGroup != null && equipment != null) {
            return exerciseRepository.findByNameContainingIgnoreCaseAndPrimaryMuscleGroupIgnoreCaseAndEquipmentIgnoreCase(
                    name, primaryMuscleGroup, equipment);
        } else if (name != null && primaryMuscleGroup != null) {
            return exerciseRepository.findByNameContainingIgnoreCaseAndPrimaryMuscleGroupIgnoreCase(name, primaryMuscleGroup);
        } else if (name != null && equipment != null) {
            return exerciseRepository.findByNameContainingIgnoreCaseAndEquipmentIgnoreCase(name, equipment);
        } else if (primaryMuscleGroup != null && equipment != null) {
            return exerciseRepository.findByPrimaryMuscleGroupIgnoreCaseAndEquipmentIgnoreCase(primaryMuscleGroup, equipment);
        } else if (name != null) {
            return exerciseRepository.findByNameContainingIgnoreCase(name);
        } else if (primaryMuscleGroup != null) {
            return exerciseRepository.findByPrimaryMuscleGroupIgnoreCase(primaryMuscleGroup);
        } else if (equipment != null) {
            return exerciseRepository.findByEquipmentIgnoreCase(equipment);
        } else {
            return exerciseRepository.findAll();
        }
    }

    // Update an existing exercise
    public Exercise updateExercise(Long exerciseId, Exercise updatedExercise) {
        Optional<Exercise> exerciseOpt = exerciseRepository.findById(exerciseId);
        if (exerciseOpt.isEmpty()) {
            throw new ExerciseServiceException("Exercise not found");
        }
        Exercise exercise = exerciseOpt.get();
        exercise.setName(updatedExercise.getName());
        exercise.setEquipment(updatedExercise.getEquipment());
        exercise.setPrimaryMuscleGroup(updatedExercise.getPrimaryMuscleGroup());
        exercise.setSecondaryMuscleGroup(updatedExercise.getSecondaryMuscleGroup());
        exercise.setAnimationUrl(updatedExercise.getAnimationUrl());
        return exerciseRepository.save(exercise);
    }

    // Delete an exercise if it's not used in any routines
    @Transactional
    public boolean deleteExercise(Long exerciseId) {
        // Check if exercise exists
        if (!exerciseRepository.existsById(exerciseId)) {
            throw new ExerciseServiceException("Exercise not found");
        }

        // Check if exercise is used in any routines
        if (routineExerciseRepository.existsByExerciseId(exerciseId)) {
            throw new ExerciseServiceException("Cannot delete exercise: it is used in one or more routines");
        }

        // Delete the exercise
        exerciseRepository.deleteById(exerciseId);
        return true;
    }
}