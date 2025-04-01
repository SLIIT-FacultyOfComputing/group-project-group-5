package com.example.Backend.controller;

import com.example.Backend.dto.MonthlyMaintenanceCostDTO;
import com.example.Backend.model.MonthlyMaintenanceCost;
import com.example.Backend.service.MonthlyMaintenanceCostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class MonthlyMaintenanceCostController {

    @Autowired
    private MonthlyMaintenanceCostService maintenanceService;

    @GetMapping("/monthly-costs")
    public ResponseEntity<List<MonthlyMaintenanceCost>> getMonthlyCosts() {
        return ResponseEntity.ok(maintenanceService.getAllMonthlyCosts());
    }

    @PostMapping("/update-monthly-costs")
    public ResponseEntity<String> updateMonthlyCosts() {
        maintenanceService.updateMonthlyCosts();
        return ResponseEntity.ok("Monthly costs updated successfully!");
    }

    @GetMapping("/filter-monthly-cost")
    public ResponseEntity<MonthlyMaintenanceCost> getMonthlyCostsByMonth(
            @RequestParam String month) {
        Optional<MonthlyMaintenanceCost> result = maintenanceService.getMonthlyCostsByMonth(month);
        return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/filter-yearly-cost")
    public ResponseEntity<List<MonthlyMaintenanceCostDTO>> getMonthlyCostsByYear( @RequestParam String year) {
        List<MonthlyMaintenanceCostDTO> result = maintenanceService.getMonthlyCostsByYear(year);
        return ResponseEntity.ok(result);
    }
}