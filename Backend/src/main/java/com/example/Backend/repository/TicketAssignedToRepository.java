package com.example.Backend.repository;

import com.example.Backend.model.TicketAssignedTo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketAssignedToRepository extends JpaRepository<TicketAssignedTo, Long> {
    List<TicketAssignedTo> findByStaffNIC(String staffNIC);
}
