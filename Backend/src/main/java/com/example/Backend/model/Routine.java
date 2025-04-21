package com.example.Backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "routines")
public class Routine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToMany
    @JoinTable(
            name = "routine_exercise",
            joinColumns = @JoinColumn(name = "routine_id"),
            inverseJoinColumns = @JoinColumn(name = "exercise_id")
    )
    private List<Exercise> exercises;

    public Routine() {}
    public Routine(String name, Member member, List<Exercise> exercises) {
        this.name = name;
        this.member = member;
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

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public List<Exercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<Exercise> exercises) {
        this.exercises = exercises;
    }
}