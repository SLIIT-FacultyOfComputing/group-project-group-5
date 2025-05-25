package com.example.Backend.dto;

import java.util.List;

public class SessionRequestDTO {

    private Long memberId;
    private Long routineId;
    private List<ExerciseLogDTO> exerciseLogs;

    public static class ExerciseLogDTO {
        private Long exerciseId;
        private Double weight;
        private boolean completed;

        // Getters and Setters
        public Long getExerciseId() { return exerciseId; }
        public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }

        public Double getWeight() { return weight; }
        public void setWeight(Double weight) { this.weight = weight; }

        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }

    // Getters and Setters
    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public Long getRoutineId() { return routineId; }
    public void setRoutineId(Long routineId) { this.routineId = routineId; }

    public List<ExerciseLogDTO> getExerciseLogs() { return exerciseLogs; }
    public void setExerciseLogs(List<ExerciseLogDTO> exerciseLogs) { this.exerciseLogs = exerciseLogs; }
}