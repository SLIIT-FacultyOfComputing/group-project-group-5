package com.example.Backend.repository;

import com.example.Backend.model.MonthlyMaintenanceCost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

    public interface MonthlyMaintenanceCostRepository extends JpaRepository<MonthlyMaintenanceCost, Long> {

        Optional<MonthlyMaintenanceCost> findByMonth(Date month);

        List<MonthlyMaintenanceCost> findByMonthBetween(Date date, Date date1);
    }