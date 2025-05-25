package com.example.Backend.dto;

import java.util.List;

public class RoutineRequestDTO {
    private Long memberId;
    private String name;
    private List<ExerciseAssignment> exerciseAssignments;

    public RoutineRequestDTO() {}

    public RoutineRequestDTO(Long memberId, String name, List<ExerciseAssignment> exerciseAssignments) {
        this.memberId = memberId;
        this.name = name;
        this.exerciseAssignments = exerciseAssignments;
    }

    public Long getMemberId() {
        return memberId;
    }
    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public List<ExerciseAssignment> getExerciseAssignments() {
        return exerciseAssignments;
    }
    public void setExerciseAssignments(List<ExerciseAssignment> exerciseAssignments) {
        this.exerciseAssignments = exerciseAssignments;
    }

    public static class ExerciseAssignment {
        private Long exerciseId;
        private int sets;
        private int reps;

        public ExerciseAssignment() {}

        public ExerciseAssignment(Long exerciseId, int sets, int reps) {
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
}