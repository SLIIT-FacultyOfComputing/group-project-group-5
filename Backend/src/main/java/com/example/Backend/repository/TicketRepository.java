package com.example.Backend.repository;

import com.example.Backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByStatus(Ticket.TicketStatus status);

    List<Ticket> findByPriority(Ticket.TicketPriority priority);
}
