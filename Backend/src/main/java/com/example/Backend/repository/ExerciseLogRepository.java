package com.example.Backend.repository;

import com.example.Backend.model.ExerciseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExerciseLogRepository extends JpaRepository<ExerciseLog, Long> {

    @Query("SELECT e FROM ExerciseLog e WHERE e.member.id = :memberId AND e.routine.id = :routineId AND e.exercise.id = :exerciseId " +
            "AND e.sessionCounter = (SELECT MAX(e2.sessionCounter) FROM ExerciseLog e2 WHERE e2.member.id = :memberId " +
            "AND e2.routine.id = :routineId AND e2.exercise.id = :exerciseId)")
    List<ExerciseLog> findLastLogByMemberIdAndRoutineIdAndExerciseId(
            @Param("memberId") Long memberId,
            @Param("routineId") Long routineId,
            @Param("exerciseId") Long exerciseId);

    @Query("SELECT MAX(e.sessionCounter) FROM ExerciseLog e WHERE e.member.id = :memberId AND e.routine.id = :routineId")
    Optional<Long> findMaxSessionCounterByMemberIdAndRoutineId(
            @Param("memberId") Long memberId,
            @Param("routineId") Long routineId);
}