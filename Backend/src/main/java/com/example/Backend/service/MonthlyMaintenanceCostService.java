package com.example.Backend.service;

import com.example.Backend.dto.MonthlyMaintenanceCostDTO;
import com.example.Backend.model.MonthlyMaintenanceCost;
import com.example.Backend.repository.MonthlyMaintenanceCostRepository;
import com.example.Backend.repository.MaintenanceScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@Service
public class MonthlyMaintenanceCostService {

    @Autowired
    private MaintenanceScheduleRepository maintenanceScheduleRepository;

    @Autowired
    private MonthlyMaintenanceCostRepository monthlyMaintenanceCostRepository;

    public List<MonthlyMaintenanceCostDTO> calculateMonthlyCosts() {
        return monthlyMaintenanceCostRepository.calculateMonthlyCosts();
    }

    @Transactional
    public void updateMonthlyCosts() {
        List<MonthlyMaintenanceCostDTO> calculatedCosts = calculateMonthlyCosts();
        for (MonthlyMaintenanceCostDTO dto : calculatedCosts) {
            Optional<MonthlyMaintenanceCost> existingCost =
                    monthlyMaintenanceCostRepository.findByMonth(dto.getMonth());
            MonthlyMaintenanceCost cost;
            if (existingCost.isPresent()) {
                cost = existingCost.get();
                cost.setTotalCost(dto.getTotalCost());
            } else {
                cost = new MonthlyMaintenanceCost(dto.getMonth(), dto.getTotalCost());
            }
            monthlyMaintenanceCostRepository.save(cost);
        }
    }

    public List<MonthlyMaintenanceCost> getAllMonthlyCosts() {
        return monthlyMaintenanceCostRepository.findAll();
    }

    public Optional<MonthlyMaintenanceCost> getMonthlyCostsByMonth(String month) {
        try {
            LocalDate localDate = LocalDate.parse(month + "-01");
            Date sqlDate = Date.valueOf(localDate);
            return monthlyMaintenanceCostRepository.findByMonth(sqlDate);
        } catch (DateTimeParseException e) {
            return Optional.empty();
        }
    }

    public List<MonthlyMaintenanceCostDTO> getMonthlyCostsByYear(String year) {
        return monthlyMaintenanceCostRepository.findByYear(year);
    }

    public MaintenanceScheduleRepository getMaintenanceScheduleRepository() {
        return maintenanceScheduleRepository;
    }

    public void setMaintenanceScheduleRepository(MaintenanceScheduleRepository maintenanceScheduleRepository) {
        this.maintenanceScheduleRepository = maintenanceScheduleRepository;
    }

    public MonthlyMaintenanceCostRepository getMonthlyMaintenanceCostRepository() {
        return monthlyMaintenanceCostRepository;
    }

    public void setMonthlyMaintenanceCostRepository(MonthlyMaintenanceCostRepository monthlyMaintenanceCostRepository) {
        this.monthlyMaintenanceCostRepository = monthlyMaintenanceCostRepository;
    }
}