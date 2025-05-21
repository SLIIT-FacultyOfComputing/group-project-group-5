package com.example.Backend.service;

import com.example.Backend.model.Exercise;
import com.example.Backend.model.Routine;
import com.example.Backend.model.RoutineExercise;
import com.example.Backend.repository.ExerciseRepository;
import com.example.Backend.repository.RoutineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final RoutineRepository routineRepository;

    public ExerciseService(ExerciseRepository exerciseRepository, RoutineRepository routineRepository) {
        this.exerciseRepository = exerciseRepository;
        this.routineRepository = routineRepository;
    }

    public Exercise createExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

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

    public Exercise updateExercise(Long exerciseId, Exercise updatedExercise) {
        Optional<Exercise> exerciseOpt = exerciseRepository.findById(exerciseId);
        if (exerciseOpt.isEmpty()) {
            return null;
        }
        Exercise exercise = exerciseOpt.get();
        exercise.setName(updatedExercise.getName());
        exercise.setEquipment(updatedExercise.getEquipment());
        exercise.setPrimaryMuscleGroup(updatedExercise.getPrimaryMuscleGroup());
        exercise.setSecondaryMuscleGroup(updatedExercise.getSecondaryMuscleGroup());
        exercise.setAnimationUrl(updatedExercise.getAnimationUrl());
        return exerciseRepository.save(exercise);
    }

   /* @Transactional
    public boolean deleteExercise(Long exerciseId) {
        Optional<Exercise> exerciseOpt = exerciseRepository.findById(exerciseId);
        if (exerciseOpt.isEmpty()) {
            return false;
        }
        exerciseRepository.delete(exerciseOpt.get());
        return true;
    }

    */
    @Transactional
    public boolean deleteExercise(Long exerciseId) {
        Optional<Exercise> exerciseOpt = exerciseRepository.findById(exerciseId);
        if (exerciseOpt.isEmpty()) {
            return false;
        }
        Exercise exercise = exerciseOpt.get();
        List<Routine> routines = routineRepository.findByExercisesContaining(exercise);
        for (Routine routine : routines) {
            List<RoutineExercise> routineExercises = routine.getRoutineExercises();
            routineExercises.removeIf(re -> re.getExercise().equals(exercise));
        }
        routineRepository.saveAll(routines);
        exerciseRepository.delete(exercise);
        return true;
    }
}