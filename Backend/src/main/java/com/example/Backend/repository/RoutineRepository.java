package com.example.Backend.repository;

import com.example.Backend.model.Exercise;
import com.example.Backend.model.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface RoutineRepository extends JpaRepository<Routine, Long> {
    List<Routine> findByMemberId(Long memberId);

    // New filter: Find routines by name (partial match, case-insensitive)
    List<Routine> findByNameContainingIgnoreCase(String name);

    // Combined filter: Find routines by member ID and name
    List<Routine> findByMemberIdAndNameContainingIgnoreCase(Long memberId, String name);

}