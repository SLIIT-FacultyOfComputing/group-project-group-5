package com.example.Backend.dto;

public class ExerciseAssignmentDTO {
    private Long exerciseId;
    private int sets;
    private int reps;

    public ExerciseAssignmentDTO() {}

    public ExerciseAssignmentDTO(Long exerciseId, int sets, int reps) {
        this.exerciseId = exerciseId;
        this.sets = sets;
        this.reps = reps;
    }

    public Long getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }
}