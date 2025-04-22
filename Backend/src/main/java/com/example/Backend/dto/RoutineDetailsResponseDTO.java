package com.example.Backend.dto;

import java.util.List;

public class RoutineDetailsResponseDTO {
    private Long id;
    private String name;
    private List<ExerciseDetailsDTO> exercises;

    public RoutineDetailsResponseDTO() {}

    public RoutineDetailsResponseDTO(Long id, String name, List<ExerciseDetailsDTO> exercises) {
        this.id = id;
        this.name = name;
        this.exercises = exercises;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public List<ExerciseDetailsDTO> getExercises() {
        return exercises;
    }
    public void setExercises(List<ExerciseDetailsDTO> exercises) {
        this.exercises = exercises;
    }
}