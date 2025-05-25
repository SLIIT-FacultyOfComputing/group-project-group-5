package com.example.Backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Trainer must not be null")
    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = true)
    private Staff trainer;

    @ManyToOne
    @JoinColumn(name = "trainee_id", nullable = true)
    private Member trainee;

    @NotNull(message = "Status must not be null")
    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        PENDING, ACCEPTED, REJECTED, COMPLETED
    }

    // Default constructor
    public Appointment() {
    }

    // Parameterized constructor
    public Appointment(Long id, Staff trainer, Member trainee, Status status) {
        this.id = id;
        this.trainer = trainer;
        this.trainee = trainee;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Staff getTrainer() {
        return trainer;
    }

    public void setTrainer(Staff trainer) {
        this.trainer = trainer;
    }

    public Member getTrainee() {
        return trainee;
    }

    public void setTrainee(Member trainee) {
        this.trainee = trainee;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getTrainerId() {
        return trainer != null ? trainer.getNIC() : null;
    }
}
