package com.example.Backend.dto;

import com.example.Backend.model.Ticket.TicketPriority;
import com.example.Backend.model.Ticket.TicketStatus;

import java.time.LocalDateTime;

public class TicketResponseDTO {
    private Long id;
    private String type;
    private String description;
    private TicketStatus status;
    private TicketPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String raisedByName;
    private Long raisedById;
    private String raisedByType;
    private String assignedToName;
    private String assignedToId;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public TicketStatus getStatus() {
        return status;
    }
    public void setStatus(TicketStatus status) {
        this.status = status;
    }
    public TicketPriority getPriority() {
        return priority;
    }
    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    public String getRaisedByName() {
        return raisedByName;
    }
    public void setRaisedByName(String raisedByName) {
        this.raisedByName = raisedByName;
    }
    public Long getRaisedById() {
        return raisedById;
    }
    public void setRaisedById(Long raisedById) {
        this.raisedById = raisedById;
    }
    public String getRaisedByType() {
        return raisedByType;
    }
    public void setRaisedByType(String raisedByType) {
        this.raisedByType = raisedByType;
    }
    public String getAssignedToName() {
        return assignedToName;
    }
    public void setAssignedToName(String assignedToName) {
        this.assignedToName = assignedToName;
    }
    public String getAssignedToId() {
        return assignedToId;
    }
    public void setAssignedToId(String assignedToId) {
        this.assignedToId = assignedToId;
    }
}