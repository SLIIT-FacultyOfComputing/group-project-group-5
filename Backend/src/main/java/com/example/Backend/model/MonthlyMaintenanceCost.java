package com.example.Backend.model;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "monthly_maintenance_cost")
public class MonthlyMaintenanceCost {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "month", nullable = false)
    private Date month;

    @Column(name = "total_cost", nullable = false)
    private Double totalCost;

    public MonthlyMaintenanceCost() {}

    public MonthlyMaintenanceCost(Date month, Double totalCost) {
        this.month = month;
        this.totalCost = totalCost;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getMonth() {
        return month;
    }

    public void setMonth(Date month) {
        this.month = month;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }
}