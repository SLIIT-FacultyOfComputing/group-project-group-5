package com.example.Backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MemberRegistrationDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String confirmPassword;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
    private String membershipType;
    private String emergencyContact;
    private String fitnessGoals;
    private String medicalConditions;
    private String preferredWorkoutTime;
}