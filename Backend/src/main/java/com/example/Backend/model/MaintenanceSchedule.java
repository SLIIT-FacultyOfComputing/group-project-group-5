package com.example.Backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;

@Data
@Entity
@Table(name = "maintenance_schedule")
public class MaintenanceSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long scheduleId;

    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    @JsonIgnore
    private Equipment equipmentSchedule;

    @Column(name = "maintenance_type", nullable = false)
    private String maintenanceType;

    @Column(name = "maintenance_date", nullable = false)
    private Date maintenanceDate;

    @Column(name = "maintenance_description", columnDefinition = "TEXT")
    private String maintenanceDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private MaintenanceStatus status = MaintenanceStatus.SCHEDULED;

    @Column(name = "technician")
    private String technician;

    @Transient
    public Long getEquipmentId() {
        return equipmentSchedule != null ? equipmentSchedule.getId() : null;
    }

}