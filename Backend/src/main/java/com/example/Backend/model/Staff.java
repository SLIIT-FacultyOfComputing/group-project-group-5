package com.example.Backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

@Entity
public class Staff {

    @Id
    @NotNull(message = "NIC cannot be null")
    @Pattern(regexp = "^[A-Z0-9]{10,12}$", message = "Invalid NIC format")
    @Column(unique = true) // Enforces uniqueness at the database level
    private String NIC; // National Identity Card number

    private String name;

    @Enumerated(EnumType.STRING)
    private Role role = Role.TRAINER; // Default role is


    private String phone;

    @NotNull(message = "Start date cannot be null")
    @PastOrPresent(message = "Start date cannot be in the future")
    private LocalDate startDate;

    // For trainers only
    private String shift; // like "morning", "evening", etc.

    private String password;

    // Getters and Setters
    public String getNIC() {
        return NIC;
    }
    public void setNIC(String NIC) {
        this.NIC = NIC;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public String getShift() {
        return shift;
    }
    public void setShift(String shift) {
        this.shift = shift;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}