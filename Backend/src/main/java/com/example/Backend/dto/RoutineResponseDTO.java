package com.example.Backend.dto;

import java.util.List;

public class RoutineResponseDTO {
    private Long id;
    private String name;
    private Long memberId;
    private String memberName;
    private List<Long> exerciseIds;

    public RoutineResponseDTO() {}

    public RoutineResponseDTO(Long id, String name, Long memberId, String memberName, List<Long> exerciseIds) {
        this.id = id;
        this.name = name;
        this.memberId = memberId;
        this.memberName = memberName;
        this.exerciseIds = exerciseIds;
    }

    public RoutineResponseDTO(Long id, String name, Long memberId, List<Long> exerciseIds) {
    this.id = id;
    this.name = name;
    this.memberId = memberId;
    this.exerciseIds = exerciseIds;
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
    public Long getMemberId() {
        return memberId;
    }
    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }
    public String getMemberName() {
        return memberName;
    }
    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }
    public List<Long> getExerciseIds() {
        return exerciseIds;
    }
    public void setExerciseIds(List<Long> exerciseIds) {
        this.exerciseIds = exerciseIds;
    }
}