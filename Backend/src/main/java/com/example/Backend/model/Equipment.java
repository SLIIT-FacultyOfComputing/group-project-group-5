package com.example.Backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;

@Data
@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String category;
    private Date purchaseDate;
    private Date lastMaintenanceDate;

    @Enumerated(EnumType.STRING)
    private EquipmentStatus status;

    private Date warrantyExpiry;
}