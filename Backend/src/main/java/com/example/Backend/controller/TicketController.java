package com.example.Backend.controller;

import com.example.Backend.dto.TicketDTO;
import com.example.Backend.dto.TicketResponseDTO;
import com.example.Backend.model.Ticket;
import com.example.Backend.model.TicketAssignedTo;
import com.example.Backend.model.TicketRaisedBy;
import com.example.Backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public void createTicket(@RequestBody TicketDTO ticketDTO) {
        ticketService.createTicket(ticketDTO);
    }

    @PutMapping("/{ticketId}/assign")
    public void assignTicket(@PathVariable Long ticketId, @RequestParam String staffId) {
        ticketService.assignTicket(ticketId, staffId);
    }

    @PutMapping("/{ticketId}/status")
    public void updateTicketStatus(@PathVariable Long ticketId, @RequestParam String status) {
        ticketService.updateTicketStatus(ticketId, status);
    }

    @GetMapping
    public List<TicketResponseDTO> getAllTicketsWithDetails() {
        return ticketService.getAllTicketsWithDetails();
    }

    @GetMapping("/{ticketId}")
    public TicketResponseDTO getTicketDetails(@PathVariable Long ticketId) {
        return ticketService.getTicketDetails(ticketId);
    }

    @GetMapping("/raised-by/member/{memberId}")
    public List<TicketRaisedBy> getTicketsRaisedByMember(@PathVariable Long memberId) {
        return ticketService.getTicketsRaisedByMember(memberId);
    }

    @GetMapping("/raised-by/staff/{staffId}")
    public List<TicketRaisedBy> getTicketsRaisedByStaff(@PathVariable String staffId) {
        return ticketService.getTicketsRaisedByStaff(staffId);
    }

    @GetMapping("/assigned-to/staff/{staffId}")
    public List<TicketAssignedTo> getTicketsAssignedToStaff(@PathVariable String staffId) {
        return ticketService.getTicketsAssignedToStaff(staffId);
    }

    @GetMapping("/filter-by-status")
    public List<Ticket> filterTicketsByStatus(@RequestParam String status) {
        return ticketService.filterTicketsByStatus(status);
    }

    @GetMapping("/filter-by-priority")
    public List<Ticket> filterTicketsByPriority(@RequestParam String priority) {
        return ticketService.filterTicketsByPriority(priority);
    }

    @GetMapping("count-by-status")
    public int countTicketsByStatus(@RequestParam String status) {
        return ticketService.countTicketsByStatus(status);
    }
}