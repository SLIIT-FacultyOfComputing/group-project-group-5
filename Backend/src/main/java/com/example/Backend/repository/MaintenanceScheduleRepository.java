package com.example.Backend.repository;

import com.example.Backend.model.MaintenanceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MaintenanceScheduleRepository extends JpaRepository<MaintenanceSchedule, Long> {

    List<MaintenanceSchedule> findByMaintenanceTypeContainingIgnoreCase(String search);

    List<MaintenanceSchedule> findByStatus(MaintenanceSchedule.MaintenanceStatus maintenanceStatus);

    List<MaintenanceSchedule> findByEquipmentId(Long equipmentId);

    @Query("SELECT m FROM MaintenanceSchedule m WHERE m.maintenanceCost IS NOT NULL")
    List<MaintenanceSchedule> findAllAndMaintenanceCostNotNull();}
