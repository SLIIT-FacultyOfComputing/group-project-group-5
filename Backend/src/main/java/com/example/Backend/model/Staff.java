package com.example.Backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @NotNull(message = "NIC cannot be null")
    @Pattern(regexp = "^[A-Z0-9]{10,12}$", message = "Invalid NIC format")
    @Column(unique = true) // Enforces uniqueness at the database level
    private String NIC; // National Identity Card number

    private String role; // like "trainer", "receptionist", etc.
    private String phone;
    private String email;

    // For trainers only
    private String shift; // like "morning", "evening", etc.

    // Getters and Setters
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

    public String getNIC() {
        return NIC;
    }
    public void setNIC(String NIC) {
        this.NIC = NIC;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }
}
