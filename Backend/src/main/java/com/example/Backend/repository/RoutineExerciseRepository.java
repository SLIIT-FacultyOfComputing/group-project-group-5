package com.example.Backend.repository;

import com.example.Backend.model.RoutineExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoutineExerciseRepository extends JpaRepository<RoutineExercise, RoutineExercise.RoutineExerciseId> {
    List<RoutineExercise> findByRoutineId(Long routineId);

    @Query("SELECT CASE WHEN COUNT(re) > 0 THEN true ELSE false END FROM RoutineExercise re WHERE re.exercise.id = :exerciseId")
    boolean existsByExerciseId(Long exerciseId);
}