package com.example.Backend.repository;

import com.example.Backend.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByTrainerIdAndDate(Long trainerId, LocalDate date);
    List<TimeSlot> findByDateBetween(LocalDate start, LocalDate end);
}