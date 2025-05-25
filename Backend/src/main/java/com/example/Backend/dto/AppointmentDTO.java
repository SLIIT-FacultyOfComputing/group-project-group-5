package com.example.Backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentDTO {
    private Long id;
    private String trainerId;
    private String trainerName;
    private Long traineeId;
    private String traineeName;
    private String status;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate date;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTrainerId() { return trainerId; }
    public void setTrainerId(String trainerId) { this.trainerId = trainerId; }
    public String getTrainerName() { return trainerName; }
    public void setTrainerName(String trainerName) { this.trainerName = trainerName; }
    public Long getTraineeId() { return traineeId; }
    public void setTraineeId(Long traineeId) { this.traineeId = traineeId; }
    public String getTraineeName() { return traineeName; }
    public void setTraineeName(String traineeName) { this.traineeName = traineeName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}