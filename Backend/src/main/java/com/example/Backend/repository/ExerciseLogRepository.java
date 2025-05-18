package com.example.Backend.repository;

import com.example.Backend.model.ExerciseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ExerciseLogRepository extends JpaRepository<ExerciseLog, Long> {

    @Query("SELECT MAX(el.sessionCounter) FROM ExerciseLog el WHERE el.member.id = :memberId AND el.routine.id = :routineId")
    Optional<Long> findMaxSessionCounterByMemberIdAndRoutineId(Long memberId, Long routineId);

    List<ExerciseLog> findByExerciseIdAndMemberIdOrderBySessionCounterAsc(Long exerciseId, Long memberId);
}