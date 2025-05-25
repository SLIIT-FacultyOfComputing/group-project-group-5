package com.example.Backend.controller;

import com.example.Backend.dto.MaintenanceScheduleRequest;
import com.example.Backend.model.MaintenanceSchedule;
import com.example.Backend.service.MaintenanceScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/maintenance-schedule")
public class MaintenanceScheduleController {

    @Autowired
    private final MaintenanceScheduleService maintenanceScheduleService;

    public MaintenanceScheduleController(MaintenanceScheduleService maintenanceScheduleService) {
        this.maintenanceScheduleService = maintenanceScheduleService;
    }

    @PostMapping
    public MaintenanceSchedule addMaintenanceSchedule(@RequestBody MaintenanceScheduleRequest request) {
        return maintenanceScheduleService.addMaintenanceSchedule(request);
    }


    @GetMapping
    public List<MaintenanceSchedule> getAllMaintenanceSchedules() {
        return maintenanceScheduleService.getAllMaintenanceSchedule();
    }

    @DeleteMapping("/{id}")
    public void deleteMaintenanceSchedule(@PathVariable Long id) {
        maintenanceScheduleService.deleteMaintenanceSchedule(id);
    }

    @GetMapping("{id}")
    public Optional<MaintenanceSchedule> searchMaintenanceScheduleByScheduleID(@PathVariable Long id) {
        return maintenanceScheduleService.getMaintenanceScheduleByScheduleId(id);
    }

    @GetMapping("/search")
    public List<MaintenanceSchedule> searchMaintenanceSchedule(@RequestParam String search) {
        return maintenanceScheduleService.searchMaintenanceSchedule(search);
    }

    @PutMapping("/{id}/MaintenanceDate")
    public MaintenanceSchedule updateMaintenanceDate(@PathVariable Long id, @RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        return maintenanceScheduleService.updateMaintenanceDate(id, date);
    }

    @PutMapping("/{id}/status")
    public MaintenanceSchedule updateMaintenanceStatus(@PathVariable Long id, @RequestParam String status) {
        return maintenanceScheduleService.updateMaintenanceStatus(id, status);
    }

    @PutMapping("/{id}/cost")
    public MaintenanceSchedule updateMaintenanceCost(@PathVariable Long id, @RequestParam Double cost) {
        return maintenanceScheduleService.updateMaintenanceCost(id, cost);
    }

    @PutMapping("/{id}/technician")
    public MaintenanceSchedule updateTechnician(@PathVariable Long id, @RequestParam String technician) {
        return maintenanceScheduleService.updateMaintenanceTechnician(id, technician);
    }

    @PutMapping("/{id}/description")
    public MaintenanceSchedule updateMaintenanceDescription(@PathVariable Long id, @RequestParam String description) {
        return maintenanceScheduleService.updateMaintenanceDescription(id, description);
    }

    @GetMapping("/filter-by-status")
    public List<MaintenanceSchedule> getMaintenanceScheduleByStatus(@RequestParam String status) {
        return maintenanceScheduleService.filterMaintenanceScheduleByStatus(status);
    }

    @GetMapping("/filter-by-equipmentId")
    public List<MaintenanceSchedule> getMaintenanceScheduleByEquipmentId(@RequestParam Long equipmentId) {
        return maintenanceScheduleService.getMaintenanceScheduleByEquipmentId(equipmentId);
    }

    @GetMapping("/filter-by-type")
    public List<MaintenanceSchedule> getMaintenanceScheduleByType(@RequestParam String type) {
        return maintenanceScheduleService.getMaintenanceScheduleByType(type);
    }
}