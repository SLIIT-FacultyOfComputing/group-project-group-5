package com.example.Backend.dto;

import com.example.Backend.model.MaintenanceSchedule;
import lombok.Data;

import java.sql.Date;

@Data
public class MaintenanceScheduleRequest {
    private Long equipmentId;
    private String maintenanceType;
    private Date maintenanceDate;
    private String maintenanceDescription;
    private MaintenanceSchedule.MaintenanceStatus status;
    private String technician;
    private Double maintenanceCost;
}
