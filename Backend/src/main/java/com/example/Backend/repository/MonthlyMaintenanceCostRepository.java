package com.example.Backend.repository;

import com.example.Backend.dto.MonthlyMaintenanceCostDTO;
import com.example.Backend.model.MonthlyMaintenanceCost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

public interface MonthlyMaintenanceCostRepository extends JpaRepository<MonthlyMaintenanceCost, Long> {

    @Query(value = "SELECT " +
            "CAST(DATE_FORMAT(ms.maintenance_date, '%Y-%m-01') AS DATE) AS month, " +
            "SUM(ms.maintenance_cost) AS total_cost " +
            "FROM maintenance_schedule ms " +
            "WHERE ms.maintenance_cost IS NOT NULL " +
            "GROUP BY CAST(DATE_FORMAT(ms.maintenance_date, '%Y-%m-01') AS DATE) " +
            "ORDER BY CAST(DATE_FORMAT(ms.maintenance_date, '%Y-%m-01') AS DATE)",
            nativeQuery = true)
    List<MonthlyMaintenanceCostDTO> calculateMonthlyCosts();

    Optional<MonthlyMaintenanceCost> findByMonth(Date month);

    @Query("SELECT new com.example.Backend.dto.MonthlyMaintenanceCostDTO(m.month, m.totalCost) " +
            "FROM MonthlyMaintenanceCost m " +
            "WHERE YEAR(m.month) = :year")
    List<MonthlyMaintenanceCostDTO> findByYear(String year);
}