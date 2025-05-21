package com.example.Backend.repository;

import com.example.Backend.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    List<Exercise> findByNameContainingIgnoreCase(String name);
    List<Exercise> findByPrimaryMuscleGroupIgnoreCase(String primaryMuscleGroup);
    List<Exercise> findByNameContainingIgnoreCaseAndPrimaryMuscleGroupIgnoreCase(String name, String primaryMuscleGroup);
    List<Exercise> findByEquipmentIgnoreCase(String equipment);
    List<Exercise> findByNameContainingIgnoreCaseAndEquipmentIgnoreCase(String name, String equipment);
    List<Exercise> findByPrimaryMuscleGroupIgnoreCaseAndEquipmentIgnoreCase(String primaryMuscleGroup, String equipment);
    List<Exercise> findByNameContainingIgnoreCaseAndPrimaryMuscleGroupIgnoreCaseAndEquipmentIgnoreCase(String name, String primaryMuscleGroup, String equipment);

}