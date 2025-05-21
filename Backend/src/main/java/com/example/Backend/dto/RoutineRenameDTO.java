package com.example.Backend.dto;

public class RoutineRenameDTO {
    private Long id;
    private String name;

    public RoutineRenameDTO() {}

    public RoutineRenameDTO(Long id, String name) {
        this.id = id;
        this.name = name;
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
}