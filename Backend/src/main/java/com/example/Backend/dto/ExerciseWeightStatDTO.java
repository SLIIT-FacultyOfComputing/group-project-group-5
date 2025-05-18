package com.example.Backend.dto;

public class ExerciseWeightStatDTO {
    private Long sessionCounter;
    private double weight;

    public ExerciseWeightStatDTO() {
        // Default constructor for Jackson deserialization
    }

    public ExerciseWeightStatDTO(Long sessionCounter, double weight) {
        this.sessionCounter = sessionCounter;
        this.weight = weight;
    }

    public Long getSessionCounter() {
        return sessionCounter;
    }

    public void setSessionCounter(Long sessionCounter) {
        this.sessionCounter = sessionCounter;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }
}