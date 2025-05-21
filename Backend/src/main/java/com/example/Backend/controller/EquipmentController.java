package com.example.Backend.controller;

import com.example.Backend.model.Equipment;
import com.example.Backend.service.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/equipment")
public class EquipmentController {

    @Autowired
    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public List<Equipment> getAllEquipment() {
        return equipmentService.getAllEquipment();
    }

    @GetMapping("/get-all")
    public List<Equipment> getAll() {
        return equipmentService.getAllDeletedEquipment();
    }

    @PostMapping
    public Equipment AddEquipment(@RequestBody Equipment equipment) {
        return equipmentService.addEquipment(equipment);
    }

    @DeleteMapping("/{id}")
    public void deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipmentById(id);
    }


    @GetMapping("/{id}")
    public Equipment getEquipmentById(@PathVariable Long id) {
        if (equipmentService.getEquipmentById(id) == null) {
            return null;
        }
        return equipmentService.getEquipmentById(id);
    }

    @PutMapping("/{id}/status")
    public Equipment UpdateEquipmentStatus(@PathVariable Long id, @RequestParam String status) {
        return equipmentService.updateEquipmentStatus(id, status);
    }

    @GetMapping("/search")
    public List<Equipment> searchEquipmentIdOrName(@RequestParam String Search) {
        return equipmentService.searchEquipmentIdOrName(Search);
    }

    @PutMapping("/{id}/Maintenance")
    public Equipment updateMaintenanceDate(@PathVariable Long id, @RequestParam("maintenanceDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date maintenanceDate) {
        return equipmentService.updateEquipmentLastMaintenanceDate(id, maintenanceDate);
    }

    @GetMapping("filter-by-status")
    public List<Equipment> getEquipmentByStatus(@RequestParam String status) {
        return equipmentService.filterByStatus(status);
    }
    
}

