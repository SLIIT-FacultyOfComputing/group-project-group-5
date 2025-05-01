package com.example.Backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercise")
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String equipment;

    @Column(name = "primary_muscle_group", nullable = false)
    private String primaryMuscleGroup;

    @Column(name = "secondary_muscle_group")
    private String secondaryMuscleGroup;

    @Column(name = "animation_url")
    private String animationUrl;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoutineExercise> routineExercises = new ArrayList<>();

    public Exercise() {
    }

    public Exercise(String name, String equipment, String primaryMuscleGroup, String secondaryMuscleGroup, String animationUrl) {
        this.name = name;
        this.equipment = equipment;
        this.primaryMuscleGroup = primaryMuscleGroup;
        this.secondaryMuscleGroup = secondaryMuscleGroup;
        this.animationUrl = animationUrl;
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

    public String getEquipment() {
        return equipment;
    }

    public void setEquipment(String equipment) {
        this.equipment = equipment;
    }

    public String getPrimaryMuscleGroup() {
        return primaryMuscleGroup;
    }

    public void setPrimaryMuscleGroup(String primaryMuscleGroup) {
        this.primaryMuscleGroup = primaryMuscleGroup;
    }

    public String getSecondaryMuscleGroup() {
        return secondaryMuscleGroup;
    }

    public void setSecondaryMuscleGroup(String secondaryMuscleGroup) {
        this.secondaryMuscleGroup = secondaryMuscleGroup;
    }

    public String getAnimationUrl() {
        return animationUrl;
    }

    public void setAnimationUrl(String animationUrl) {
        this.animationUrl = animationUrl;
    }

    public List<RoutineExercise> getRoutineExercises() {
        return routineExercises;
    }

    public void setRoutineExercises(List<RoutineExercise> routineExercises) {
        this.routineExercises = routineExercises;
    }
}