package com.example.Backend.controller;

import com.example.Backend.dto.AppointmentBookingRequest;
import com.example.Backend.dto.AppointmentDTO;
import com.example.Backend.model.Appointment;
import com.example.Backend.model.TimeSlot;
import com.example.Backend.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService service;

    @PostMapping
    public String book(@RequestBody AppointmentBookingRequest request) {
        return service.bookAppointment(request);
    }

    @GetMapping
    public List<AppointmentDTO> getAllAppointments() {
        return service.getAllAppointments();
    }

    @GetMapping("/upcoming")
    public List<Appointment> getUpcomingAppointments() {
        return service.getAppointmentsForNextThreeDays();
    }

    @GetMapping("/slots")
    public List<TimeSlot> getAvailableSlots() {
        return service.getAvailableSlotsForNextThreeDays();
    }

    @PutMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @RequestParam Appointment.Status status) {
        return service.updateStatus(id, status);
    }

    @GetMapping("/trainer/{trainerId}")
    public List<AppointmentDTO> getAppointmentsByTrainer(@PathVariable String trainerId) {
        return service.getAppointmentsByTrainerId(trainerId);
    }

    @GetMapping("/trainee/{traineeId}")
    public List<AppointmentDTO> getAppointmentsByTrainee(@PathVariable Long traineeId) {
        return service.getAppointmentsByTraineeId(traineeId);
    }

}