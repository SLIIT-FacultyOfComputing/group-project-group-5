package com.example.Backend.service;

import com.example.Backend.model.Appointment;
import com.example.Backend.model.TimeSlot;
import com.example.Backend.repository.AppointmentRepository;
import com.example.Backend.repository.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepo;

    @Autowired
    private TimeSlotRepository timeSlotRepo;

    public Appointment bookAppointment(Appointment appointment) {
        // Check if slot is available
        List<TimeSlot> slots = timeSlotRepo.findByTrainerIdAndDate(appointment.getTrainerId(), appointment.getDate());
        boolean isAvailable = slots.stream().anyMatch(slot ->
                slot.getTime().equals(appointment.getTimeSlot()) &&
                        slot.getStatus() == TimeSlot.SlotStatus.AVAILABLE
        );

        if (!isAvailable) {
            throw new RuntimeException("Time slot not available");
        }

        appointment.setStatus(Appointment.Status.PENDING);

        // Mark time slot as booked
        slots.stream().filter(slot -> slot.getTime().equals(appointment.getTimeSlot()))
                .forEach(slot -> {
                    slot.setStatus(TimeSlot.SlotStatus.BOOKED);
                    timeSlotRepo.save(slot);
                });

        return appointmentRepo.save(appointment);
    }

    public List<Appointment> getAppointmentsForNextThreeDays() {
        LocalDate now = LocalDate.now();
        LocalDate end = now.plusDays(3);
        return appointmentRepo.findByDateBetween(now, end);
    }

    public List<TimeSlot> getAvailableSlotsForNextThreeDays() {
        LocalDate now = LocalDate.now();
        LocalDate end = now.plusDays(3);
        return timeSlotRepo.findByDateBetween(now, end);
    }

    public Appointment updateStatus(Long id, Appointment.Status status) {
        Optional<Appointment> optional = appointmentRepo.findById(id);
        if (optional.isPresent()) {
            Appointment app = optional.get();
            app.setStatus(status);
            return appointmentRepo.save(app);
        }
        return null;
    }
}