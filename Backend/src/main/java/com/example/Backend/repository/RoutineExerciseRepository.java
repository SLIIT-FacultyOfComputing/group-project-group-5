package com.example.Backend.repository;

import com.example.Backend.model.RoutineExercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoutineExerciseRepository extends JpaRepository<RoutineExercise, RoutineExercise.RoutineExerciseId> {
    List<RoutineExercise> findByRoutineId(Long routineId);
}