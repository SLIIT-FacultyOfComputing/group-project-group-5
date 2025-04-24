package com.example.Backend.service;

import com.example.Backend.model.MaintenanceSchedule;
import com.example.Backend.model.MonthlyMaintenanceCost;
import com.example.Backend.repository.MaintenanceScheduleRepository;
import com.example.Backend.repository.MonthlyMaintenanceCostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
public class MonthlyMaintenanceCostService {

    @Autowired
    private MaintenanceScheduleRepository maintenanceScheduleRepository;

    @Autowired
    private MonthlyMaintenanceCostRepository monthlyMaintenanceCostRepository;

    @Transactional
    public void calculateAndUpdateMonthlyCosts() {
        List<MaintenanceSchedule> schedules = maintenanceScheduleRepository.findAllAndMaintenanceCostNotNull();
        Map<LocalDate, Double> monthlyCosts = new HashMap<>();

        for (MaintenanceSchedule schedule : schedules) {
            LocalDate month = schedule.getMaintenanceDate().toLocalDate().withDayOfMonth(1);
            monthlyCosts.put(month, monthlyCosts.getOrDefault(month, 0.0) + schedule.getMaintenanceCost());
        }

        for (Map.Entry<LocalDate, Double> entry : monthlyCosts.entrySet()) {
            LocalDate month = entry.getKey();
            Double totalCost = entry.getValue();
            Date sqlDate = Date.valueOf(month);

            MonthlyMaintenanceCost cost = monthlyMaintenanceCostRepository.findByMonth(sqlDate)
                    .orElse(new MonthlyMaintenanceCost(sqlDate, 0.0));

            cost.setTotalCost(totalCost);
            monthlyMaintenanceCostRepository.save(cost);
        }
    }


    public List<MonthlyMaintenanceCost> getAllMonthlyCosts() {
        return monthlyMaintenanceCostRepository.findAll();
    }

    public Optional<MonthlyMaintenanceCost> getMonthlyCostsByMonth(String month) {
        try {
            Date date = Date.valueOf(LocalDate.parse(month + "-01"));
            return monthlyMaintenanceCostRepository.findByMonth(date);
        } catch (DateTimeParseException e) {
            return Optional.empty();
        }
    }

    public List<MonthlyMaintenanceCost> getMonthlyCostsByYear(String year) {
        try {
            int yearInt = Integer.parseInt(year);
            Date sqlDate = Date.valueOf(LocalDate.of(yearInt, 1, 1));
            Date sqlDate1 = Date.valueOf(LocalDate.of(yearInt, 12, 31));
            return monthlyMaintenanceCostRepository.findByMonthBetween(sqlDate,sqlDate1);
        } catch (NumberFormatException e) {
            return Collections.emptyList();
        }
    }


}