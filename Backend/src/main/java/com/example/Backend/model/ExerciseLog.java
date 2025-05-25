package com.example.Backend.model;

import jakarta.persistence.*;

/**
 * Entity class representing a logged exercise session.
 * Tracks the performance of a specific exercise within a workout routine.
 */
@Entity
@Table(name = "exercise_logs")
public class ExerciseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "routine_id", nullable = false)
    private Routine routine;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "session_counter", nullable = false)
    private Long sessionCounter;


    public ExerciseLog() {}

    //Constructor to create a new exercise log entry
     
    public ExerciseLog(Member member, Routine routine, Exercise exercise, Double weight, boolean completed, Long sessionCounter) {
        this.member = member;
        this.routine = routine;
        this.exercise = exercise;
        this.weight = weight;
        this.completed = completed;
        this.sessionCounter = sessionCounter;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public Routine getRoutine() { return routine; }
    public void setRoutine(Routine routine) { this.routine = routine; }

    public Exercise getExercise() { return exercise; }
    public void setExercise(Exercise exercise) { this.exercise = exercise; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Long getSessionCounter() { return sessionCounter; }
    public void setSessionCounter(Long sessionCounter) { this.sessionCounter = sessionCounter; }
}