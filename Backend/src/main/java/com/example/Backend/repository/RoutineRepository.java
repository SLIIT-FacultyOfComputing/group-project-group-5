package com.example.Backend.repository;

import com.example.Backend.model.Exercise;
import com.example.Backend.model.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface RoutineRepository extends JpaRepository<Routine, Long> {
    List<Routine> findByMemberId(Long memberId);

    List<Routine> findByNameContainingIgnoreCase(String name);

    List<Routine> findByMemberIdAndNameContainingIgnoreCase(Long memberId, String name);

    @Query("SELECT DISTINCT re.routine FROM RoutineExercise re WHERE re.exercise = :exercise")
    List<Routine> findByExercisesContaining(Exercise exercise);
}