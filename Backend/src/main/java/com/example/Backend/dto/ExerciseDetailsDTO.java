package com.example.Backend.dto;

public class ExerciseDetailsDTO {
    private Long id;
    private String name;
    private String equipment;
    private String primaryMuscleGroup;
    private String secondaryMuscleGroups;
    private String animationUrl;
    private int sets;
    private int reps;

    public ExerciseDetailsDTO() {}

    public ExerciseDetailsDTO(Long id, String name, String equipment, String primaryMuscleGroup, String secondaryMuscleGroups, String animationUrl, int sets, int reps) {
        this.id = id;
        this.name = name;
        this.equipment = equipment;
        this.primaryMuscleGroup = primaryMuscleGroup;
        this.secondaryMuscleGroups = secondaryMuscleGroups;
        this.animationUrl = animationUrl;
        this.sets = sets;
        this.reps = reps;
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
    public String getSecondaryMuscleGroups() {
        return secondaryMuscleGroups;
    }
    public void setSecondaryMuscleGroups(String secondaryMuscleGroups) {
        this.secondaryMuscleGroups = secondaryMuscleGroups;
    }
    public String getAnimationUrl() {
        return animationUrl;
    }
    public void setAnimationUrl(String animationUrl) {
        this.animationUrl = animationUrl;
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