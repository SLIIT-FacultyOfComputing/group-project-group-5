package com.example.Backend.dto;

import com.example.Backend.model.MaintenanceStatus;
import lombok.Data;

import java.sql.Date;

@Data
public class MaintenanceScheduleRequest {
    private Long equipmentId;
    private String maintenanceType;
    private Date maintenanceDate;
    private String maintenanceDescription;
    private MaintenanceStatus status;
    private String technician;
    private Double maintenanceCost;
}
