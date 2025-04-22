package com.example.Backend.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "routine_exercise")
public class RoutineExercise {

    @EmbeddedId
    private RoutineExerciseId id;

    @ManyToOne
    @MapsId("routineId")
    @JoinColumn(name = "routine_id")
    private Routine routine;

    @ManyToOne
    @MapsId("exerciseId")
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @Column(nullable = false)
    private int sets;

    @Column(nullable = false)
    private int reps;

    public RoutineExercise() {}

    public RoutineExercise(Routine routine, Exercise exercise, int sets, int reps) {
        this.id = new RoutineExerciseId(routine.getId(), exercise.getId());
        this.routine = routine;
        this.exercise = exercise;
        this.sets = sets;
        this.reps = reps;
    }

    public RoutineExerciseId getId() {
        return id;
    }

    public void setId(RoutineExerciseId id) {
        this.id = id;
    }

    public Routine getRoutine() {
        return routine;
    }

    public void setRoutine(Routine routine) {
        this.routine = routine;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
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

    @Embeddable
    public static class RoutineExerciseId implements Serializable {
        private Long routineId;
        private Long exerciseId;

        public RoutineExerciseId() {}

        public RoutineExerciseId(Long routineId, Long exerciseId) {
            this.routineId = routineId;
            this.exerciseId = exerciseId;
        }

        public Long getRoutineId() {
            return routineId;
        }
        public void setRoutineId(Long routineId) {
            this.routineId = routineId;
        }
        public Long getExerciseId() {
            return exerciseId;
        }
        public void setExerciseId(Long exerciseId) {
            this.exerciseId = exerciseId;
        }

        // to prevent having different reps and sets for the same exercise in same routine
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RoutineExerciseId that = (RoutineExerciseId) o;
            return Objects.equals(routineId, that.routineId) &&
                    Objects.equals(exerciseId, that.exerciseId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(routineId, exerciseId);
        }
    }
}
