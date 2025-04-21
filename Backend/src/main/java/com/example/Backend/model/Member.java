package com.example.Backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "members")
public class Member {
    @Id
    private Long id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Routine> routines;

    public Member() {}

    public Member(Long id, String name) {
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
    public List<Routine> getRoutines() {
        return routines;
    }

    public void setRoutines(List<Routine> routines) {
        this.routines = routines;
    }
}