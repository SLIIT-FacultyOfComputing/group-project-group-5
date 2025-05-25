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

    @OneToMany(mappedBy = "routine", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoutineExercise> routineExercises;

    public Routine() {}
    public Routine(String name, Member member, List<RoutineExercise> routineExercises) {
        this.name = name;
        this.member = member;
        this.routineExercises = routineExercises;
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

    public List<RoutineExercise> getRoutineExercises() {
        return routineExercises;
    }

    public void setRoutineExercises(List<RoutineExercise> routineExercises) {
        this.routineExercises = routineExercises;
    }
}