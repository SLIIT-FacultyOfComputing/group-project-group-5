package com.example.Backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "members")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phoneNumber;

    private String address;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String membershipType;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, SUSPENDED

    @Column(nullable = false)
    private LocalDateTime joinDate = LocalDateTime.now();

    private LocalDateTime lastVisit;

    private String emergencyContact;

    private String fitnessGoals;

    private String medicalConditions;

    private String preferredWorkoutTime;
}