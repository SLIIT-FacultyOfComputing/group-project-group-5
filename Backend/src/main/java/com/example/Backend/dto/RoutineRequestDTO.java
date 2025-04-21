package com.example.Backend.dto;

import java.util.List;

public class RoutineRequestDTO {
    private Long memberId;
    private String name;
    private List<Long> exerciseIds;

    public RoutineRequestDTO() {}

    public RoutineRequestDTO(Long memberId, String name, List<Long> exerciseIds) {
        this.memberId = memberId;
        this.name = name;
        this.exerciseIds = exerciseIds;
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
    public List<Long> getExerciseIds() {
        return exerciseIds;
    }
    public void setExerciseIds(List<Long> exerciseIds) {
        this.exerciseIds = exerciseIds;
    }
}