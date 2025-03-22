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

    @PostMapping
    public void AddEquipment(@RequestBody Equipment equipment) {
        equipmentService.addEquipment(equipment);
}

    @DeleteMapping("/{id}")
    public void deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
    }


    @GetMapping("/{id}")
    public Equipment getEquipmentById(@PathVariable Long id) {
        if (equipmentService.getEquipmentById(id) == null) {
            return null;
        }
        return equipmentService.getEquipmentById(id);
    }

    @PutMapping("/{id}")
    public Equipment updateEquipment(@PathVariable Long id, Equipment equipment) {
        equipment.setId(id);
        return equipmentService.updateEquipment(equipment);
    }

    @PutMapping("/{id}/status")
    public String UpdateEquipmentStatus(@PathVariable Long id, @RequestParam String status) {
        return equipmentService.updateEquipmentStatus(id, status);
    }

    @GetMapping("/search")
    public List<Equipment> searchEquipment(@RequestParam String Search) {
        return equipmentService.searchEquipment(Search);
    }

    @PutMapping("/{id}/Maintenance")
    public String updateMaintenanceDate(@PathVariable Long id, @RequestParam("maintenanceDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date maintenanceDate) {
        return equipmentService.updateEquipmentLastMaintenanceDate(id, maintenanceDate);
    }

    
}

