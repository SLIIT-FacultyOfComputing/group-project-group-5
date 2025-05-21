package com.example.Backend.controller;

import com.example.Backend.model.MonthlyMaintenanceCost;
import com.example.Backend.service.MonthlyMaintenanceCostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class MonthlyMaintenanceCostController {

    @Autowired
    private MonthlyMaintenanceCostService maintenanceService;

    @GetMapping("/monthly-costs")
    public List<MonthlyMaintenanceCost> getMonthlyCosts() {
        return maintenanceService.getAllMonthlyCosts();
    }

    @PostMapping("/update-monthly-costs")
    public void updateMonthlyCosts() {
        maintenanceService.calculateAndUpdateMonthlyCosts();
    }

    @GetMapping("/filter-monthly-cost")
    public Optional<MonthlyMaintenanceCost> getMonthlyCostsByMonth(@RequestParam String month) {
        return maintenanceService.getMonthlyCostsByMonth(month);
    }

    @GetMapping("/filter-yearly-cost")
    public List<MonthlyMaintenanceCost> getMonthlyCostsByYear( @RequestParam String year) {
        return maintenanceService.getMonthlyCostsByYear(year);
    }
}