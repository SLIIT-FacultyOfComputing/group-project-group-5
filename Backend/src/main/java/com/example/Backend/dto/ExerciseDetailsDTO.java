package com.example.Backend.dto;

public class ExerciseDetailsDTO {
    private Long id;
    private String name;
    private String equipment;
    private String primaryMuscleGroup;
    private String secondaryMuscleGroups;
    private String animationUrl;

    public ExerciseDetailsDTO() {}

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
}