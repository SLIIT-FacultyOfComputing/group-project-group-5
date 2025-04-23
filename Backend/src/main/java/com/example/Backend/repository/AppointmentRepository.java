package com.example.Backend.repository;

import com.example.Backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByTrainerIdAndDate(Long trainerId, LocalDate date);
    List<Appointment> findByTraineeId(Long traineeId);
    List<Appointment> findByDateBetween(LocalDate start, LocalDate end);
}