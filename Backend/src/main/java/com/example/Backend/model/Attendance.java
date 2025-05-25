package com.example.Backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "member_name", nullable = false)
    private String memberName;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "check_in_time", nullable = false)
    private LocalTime time;
}