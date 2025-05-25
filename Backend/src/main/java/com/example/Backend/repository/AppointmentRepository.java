package com.example.Backend.repository;

import com.example.Backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByTrainer_NIC(String trainerId);

    List<Appointment> findByTraineeId(Long traineeId);
}