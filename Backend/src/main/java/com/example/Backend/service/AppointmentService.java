package com.example.Backend.service;

import com.example.Backend.dto.AppointmentBookingRequest;
import com.example.Backend.dto.AppointmentDTO;
import com.example.Backend.model.Appointment;
import com.example.Backend.model.Member;
import com.example.Backend.model.Staff;
import com.example.Backend.model.TimeSlot;
import com.example.Backend.repository.AppointmentRepository;
import com.example.Backend.repository.MemberRepository;
import com.example.Backend.repository.StaffRepository;
import com.example.Backend.repository.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private TimeSlotRepository timeSlotRepo;

    @Autowired
    private StaffRepository staffRepo;

    public String bookAppointment(AppointmentBookingRequest request) {
        if (request == null || request.getTrainerId() == null || request.getStatus() == null ||
                request.getDate() == null || request.getStartTime() == null || request.getEndTime() == null) {
            return "Invalid appointment data";
        }

        Staff trainer = staffRepo.findById(request.getTrainerId()).orElse(null);
        if (trainer == null) {
            return "Trainer not found";
        }

        Member trainee = null;
        if (request.getTraineeId() != null) {
            trainee = memberRepo.findById(request.getTraineeId()).orElse(null);
            if (trainee == null) {
                return "Trainee not found";
            }
        }

        List<TimeSlot> overlappingSlots = timeSlotRepo
                .findByDateAndAppointment_Trainer_NICAndStartTimeLessThanAndEndTimeGreaterThan(
                        request.getDate(),
                        request.getTrainerId(),
                        request.getEndTime(),
                        request.getStartTime()
                );

        boolean hasConflict = overlappingSlots.stream()
                .anyMatch(slot -> slot.getStatus() == TimeSlot.SlotStatus.BOOKED
                        || slot.getStatus() == TimeSlot.SlotStatus.IN_PROGRESS);

        if (hasConflict) {
            return "Trainer already has a booking in this time period";
        }

        TimeSlot slot = timeSlotRepo.findByDateAndStartTimeAndEndTime(
                request.getDate(), request.getStartTime(), request.getEndTime()
        ).orElse(null);

        if (slot != null) {
            if (slot.getStatus() != TimeSlot.SlotStatus.AVAILABLE) {
                return "Time slot is already booked";
            }
        } else {
            slot = new TimeSlot();
            slot.setDate(request.getDate());
            slot.setStartTime(request.getStartTime());
            slot.setEndTime(request.getEndTime());
            slot.setStatus(TimeSlot.SlotStatus.AVAILABLE);
            slot = timeSlotRepo.save(slot);
        }

        Appointment appointment = new Appointment();
        appointment.setTrainer(trainer);
        appointment.setTrainee(trainee);
        appointment.setStatus(Appointment.Status.valueOf(request.getStatus()));

        Appointment savedAppointment = appointmentRepo.save(appointment);

        slot.setAppointment(savedAppointment);
        slot.setStatus(TimeSlot.SlotStatus.BOOKED);
        timeSlotRepo.save(slot);

        return "Appointment Booked Successfully";
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepo.findAll().stream().map(appointment -> {
            AppointmentDTO dto = new AppointmentDTO();
            dto.setId(appointment.getId());
            if (appointment.getTrainer() != null) {
                dto.setTrainerId(appointment.getTrainer().getNIC());
                dto.setTrainerName(appointment.getTrainer().getName());
            }
            if (appointment.getTrainee() != null) {
                dto.setTraineeId(appointment.getTrainee().getId());
                dto.setTraineeName(appointment.getTrainee().getFirstName());
            }

            dto.setStatus(appointment.getStatus().name());
            Optional<TimeSlot> timeSlot = timeSlotRepo.findByAppointmentId(appointment.getId());
            if (timeSlot.isPresent()) {
                dto.setStartTime(timeSlot.get().getStartTime());
                dto.setEndTime(timeSlot.get().getEndTime());
                dto.setDate(timeSlot.get().getDate());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public List<Appointment> getAppointmentsForNextThreeDays() {
        List<Appointment> appointments = appointmentRepo.findAll();
        return appointments.stream()
                .filter(appointment -> {
                    Optional<TimeSlot> timeSlot = timeSlotRepo.findByAppointmentId(appointment.getId());
                    return timeSlot.isPresent() &&
                            !timeSlot.get().getDate().isBefore(LocalDate.now()) &&
                            !timeSlot.get().getDate().isAfter(LocalDate.now().plusDays(3));
                })
                .collect(Collectors.toList());
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

    public List<AppointmentDTO> getAppointmentsByTrainerId(String trainerId) {
        return appointmentRepo.findByTrainer_NIC(trainerId).stream().map(appointment -> {
            AppointmentDTO dto = new AppointmentDTO();
            dto.setId(appointment.getId());
            if (appointment.getTrainer() != null) {
                dto.setTrainerId(appointment.getTrainer().getNIC());
                dto.setTrainerName(appointment.getTrainer().getName());
            }
            if (appointment.getTrainee() != null) {
                dto.setTraineeId(appointment.getTrainee().getId());
                dto.setTraineeName(appointment.getTrainee().getFirstName());
            }
            dto.setStatus(appointment.getStatus().name());
            Optional<TimeSlot> timeSlot = timeSlotRepo.findByAppointmentId(appointment.getId());
            if (timeSlot.isPresent()) {
                dto.setStartTime(timeSlot.get().getStartTime());
                dto.setEndTime(timeSlot.get().getEndTime());
                dto.setDate(timeSlot.get().getDate());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByTraineeId(Long traineeId) {
        return appointmentRepo.findByTraineeId(traineeId).stream().map(appointment -> {
            AppointmentDTO dto = new AppointmentDTO();
            dto.setId(appointment.getId());
            if (appointment.getTrainer() != null) {
                dto.setTrainerId(appointment.getTrainer().getNIC());
                dto.setTrainerName(appointment.getTrainer().getName());
            }
            if (appointment.getTrainee() != null) {
                dto.setTraineeId(appointment.getTrainee().getId());
                dto.setTraineeName(appointment.getTrainee().getFirstName());
            }
            dto.setStatus(appointment.getStatus().name());
            Optional<TimeSlot> timeSlot = timeSlotRepo.findByAppointmentId(appointment.getId());
            if (timeSlot.isPresent()) {
                dto.setStartTime(timeSlot.get().getStartTime());
                dto.setEndTime(timeSlot.get().getEndTime());
                dto.setDate(timeSlot.get().getDate());
            }
            return dto;
        }).collect(Collectors.toList());
    }
}