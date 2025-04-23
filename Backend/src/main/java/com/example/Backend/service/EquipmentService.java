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
        return equipmentRepository.findByDeletedFalse();
    }

    public List<Equipment> getAllDeletedEquipment() {
        return equipmentRepository.findAll();
    }

    public Equipment addEquipment(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }

    @Transactional
    public void deleteEquipmentById(Long id) {
        equipmentRepository.softDeleteById(id);
    }

    public Equipment getEquipmentById(Long id) {
        return equipmentRepository.findById(id).orElse(null);
    }

    public List<Equipment> searchEquipmentIdOrName(String search) {

        try{
            Long id = Long.parseLong(search);
            return equipmentRepository.findByIdAndDeletedFalse(id);
        }
        catch (NumberFormatException e){
            return equipmentRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseAndDeletedFalse(search, search);
        }
    }

    public Equipment updateEquipmentStatus(Long equipmentId, String status) {
        Optional<Equipment> equipment = equipmentRepository.findById(equipmentId);
        if (equipment.isPresent()) {
            Equipment eq = equipment.get();
            EquipmentStatus newStatus = EquipmentStatus.valueOf(status);
            eq.setStatus(newStatus);
            equipmentRepository.save(eq);
            return eq;
        } else {
            return null;
        }
    }

    public Equipment updateEquipmentLastMaintenanceDate(Long equipmentId, Date date) {
        Optional<Equipment> equipment = equipmentRepository.findById(equipmentId);

        if (equipment.isPresent()) {
            Equipment eq = equipment.get();
            eq.setLastMaintenanceDate(new java.sql.Date(date.getTime())); // Convert to SQL Date
            equipmentRepository.save(eq);
            return eq;
        }
        return null;
    }

    public List<Equipment> filterByStatus(String status) {
        EquipmentStatus newStatus = EquipmentStatus.valueOf(status);
        return equipmentRepository.findByStatus(newStatus);
    }

}