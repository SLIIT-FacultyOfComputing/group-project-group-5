package com.example.Backend.service;

import com.example.Backend.dto.MaintenanceScheduleRequest;
import com.example.Backend.model.Equipment;
import com.example.Backend.model.MaintenanceSchedule;
import com.example.Backend.model.MaintenanceStatus;
import com.example.Backend.repository.EquipmentRepository;
import com.example.Backend.repository.MaintenanceScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MaintenanceScheduleService {

    @Autowired
    public final MaintenanceScheduleRepository maintenanceScheduleRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    public MaintenanceScheduleService(MaintenanceScheduleRepository repositoryMaintenanceSchedule) {
        this.maintenanceScheduleRepository = repositoryMaintenanceSchedule;
    }

    public MaintenanceSchedule addMaintenanceSchedule(MaintenanceScheduleRequest request) {
        Optional<Equipment> equipment = equipmentRepository.findById(request.getEquipmentId());

        if (equipment.isEmpty()) {
            throw new RuntimeException("Equipment not found with ID: " + request.getEquipmentId());
        }

        MaintenanceSchedule maintenanceSchedule = new MaintenanceSchedule();
        maintenanceSchedule.setEquipmentSchedule(equipment.get());
        maintenanceSchedule.setEquipmentId(request.getEquipmentId());
        maintenanceSchedule.setMaintenanceType(request.getMaintenanceType());
        maintenanceSchedule.setMaintenanceDate(request.getMaintenanceDate());
        maintenanceSchedule.setMaintenanceDescription(request.getMaintenanceDescription());
        maintenanceSchedule.setStatus(request.getStatus());
        maintenanceSchedule.setTechnician(request.getTechnician());
        maintenanceSchedule.setMaintenanceCost(request.getMaintenanceCost());

        return maintenanceScheduleRepository.save(maintenanceSchedule);
    }

    public List<MaintenanceSchedule> getAllMaintenanceSchedule() {
        return maintenanceScheduleRepository.findAll();
    }

    public void deleteMaintenanceSchedule(Long id) {
        maintenanceScheduleRepository.deleteById(id);
    }

    public Optional<MaintenanceSchedule> getMaintenanceScheduleByScheduleId(Long scheduleId) {
        return maintenanceScheduleRepository.findById(scheduleId);
    }

    public List<MaintenanceSchedule> searchMaintenanceSchedule(String search) {
        return maintenanceScheduleRepository.findByMaintenanceTypeContainingIgnoreCase(search);
    }

    public MaintenanceSchedule updateMaintenanceDate(Long id, java.util.Date date) {
        Optional<MaintenanceSchedule> maintenanceSchedule = maintenanceScheduleRepository.findById(id);
        if (maintenanceSchedule.isPresent()) {
            MaintenanceSchedule MS = maintenanceSchedule.get();
            MS.setMaintenanceDate(new Date(date.getTime()));
            maintenanceScheduleRepository.save(MS);
            return MS;
        } else {
            return null;
        }
    }

    public MaintenanceSchedule updateMaintenanceStatus(Long id, String status) {
        Optional<MaintenanceSchedule> maintenanceSchedule = maintenanceScheduleRepository.findById(id);
        if (maintenanceSchedule.isPresent()) {
            try {
                MaintenanceSchedule MS = maintenanceSchedule.get();
                MaintenanceStatus newStatus = MaintenanceStatus.valueOf(status);
                MS.setStatus(newStatus);
                maintenanceScheduleRepository.save(MS);
                return MS;
            } catch (IllegalArgumentException e) {
                System.out.println("Invalid status value: " + status);
            }
        }
        return null;

    }

    public MaintenanceSchedule updateMaintenanceCost(Long id, Double cost) {
        Optional<MaintenanceSchedule> scheduleOpt = maintenanceScheduleRepository.findById(id);
        if (scheduleOpt.isPresent()) {
            MaintenanceSchedule schedule = scheduleOpt.get();
            schedule.setMaintenanceCost(cost);
            return maintenanceScheduleRepository.save(schedule);
        }
        return null;
    }

    public MaintenanceSchedule updateMaintenanceDescription( Long id, String description) {
        Optional<MaintenanceSchedule> scheduleOpt = maintenanceScheduleRepository.findById(id);
        if (scheduleOpt.isPresent()) {
            MaintenanceSchedule schedule = scheduleOpt.get();
            schedule.setMaintenanceDescription(description);
            return maintenanceScheduleRepository.save(schedule);
        }
        return null;
    }

    public MaintenanceSchedule updateMaintenanceTechnician(Long id, String technician) {
        Optional<MaintenanceSchedule> scheduleOpt = maintenanceScheduleRepository.findById(id);
        if (scheduleOpt.isPresent()) {
            MaintenanceSchedule schedule = scheduleOpt.get();
            schedule.setTechnician(technician);
            return maintenanceScheduleRepository.save(schedule);
        }
        return null;
    }

    public  List<MaintenanceSchedule> filterMaintenanceScheduleByStatus(String status) {
        try {
            MaintenanceStatus maintenanceStatus = MaintenanceStatus.valueOf(status);
            return maintenanceScheduleRepository.findByStatus(maintenanceStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + status);
        }
    }

    public List<MaintenanceSchedule> getMaintenanceScheduleByEquipmentId(Long equipmentId) {
        return maintenanceScheduleRepository.findByEquipmentId(equipmentId);
    }

    public List<MaintenanceSchedule> getMaintenanceScheduleByType(String type) {
        return maintenanceScheduleRepository.findByMaintenanceTypeContainingIgnoreCase(type);
    }
}