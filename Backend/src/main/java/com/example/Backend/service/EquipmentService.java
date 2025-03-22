package com.example.Backend.service;

import com.example.Backend.model.Equipment;
import com.example.Backend.model.EquipmentStatus;
import com.example.Backend.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EquipmentService {

    @Autowired
    public final EquipmentRepository equipmentRepository;

    public EquipmentService(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    public Equipment addEquipment(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }

    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    public Equipment getEquipmentById(Long id) {
        return equipmentRepository.findById(id).orElse(null);
    }

    public Equipment updateEquipment(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }

    public String updateEquipmentStatus(Long equipmentId, String status) {
        Optional<Equipment> equipment = equipmentRepository.findById(equipmentId);
        if (equipment.isPresent()) {
            Equipment eq = equipment.get();

            try {
                EquipmentStatus newStatus = EquipmentStatus.valueOf(status);
                eq.setStatus(newStatus);
                equipmentRepository.save(eq);
                return "Status updated to " + newStatus;
            } catch (IllegalArgumentException e) {
                return "Invalid status value: " + status;
            }
        } else {
            return "Equipment not found with ID: " + equipmentId;
        }
    }

    public List<Equipment> searchEquipment(String search) {
        return equipmentRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(search, search);
    }

    public String updateEquipmentLastMaintenanceDate(Long equipmentId, Date date) {
        try {
            Optional<Equipment> equipment = equipmentRepository.findById(equipmentId);

            if (equipment.isPresent()) {
                Equipment eq = equipment.get();
                eq.setLastMaintenanceDate(new java.sql.Date(date.getTime())); // Convert to SQL Date
                equipmentRepository.save(eq);
                return "Last maintenance updated to " + date;
            } else {
                return "Equipment not found with ID: " + equipmentId;
            }
        } catch (Exception e) {
            return "An error occurred while updating the last maintenance date: " + e.getMessage();
        }
    }

}