package com.example.Backend.dto;

import java.sql.Date;

public class MonthlyMaintenanceCostDTO {
    private Date month;
    private Double totalCost;

    public MonthlyMaintenanceCostDTO(Date month, Double totalCost) {
        this.month = month;
        this.totalCost = totalCost;
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