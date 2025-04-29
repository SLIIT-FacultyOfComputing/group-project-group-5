package com.example.Backend.service;

import com.example.Backend.dto.TicketDTO;
import com.example.Backend.dto.TicketResponseDTO;
import com.example.Backend.model.*;
import com.example.Backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private TicketRaisedByRepository ticketRaisedByRepository;

    @Autowired
    private TicketAssignedToRepository ticketAssignedToRepository;

    @Transactional
    public void createTicket(TicketDTO ticketDTO) {
        if (ticketDTO.getMemberId() != null && ticketDTO.getStaffId() != null) {
            throw new RuntimeException("Ticket can be raised by either a Member or staff, not both");
        }
        if (ticketDTO.getMemberId() == null && ticketDTO.getStaffId() == null) {
            throw new RuntimeException("Ticket must be raised by either a Member or staff");
        }

        Ticket ticket = new Ticket();
        ticket.setType(ticketDTO.getType());
        ticket.setDescription(ticketDTO.getDescription());
        ticket.setStatus(Ticket.TicketStatus.OPEN);
        ticket.setPriority(ticketDTO.getPriority() != null ? ticketDTO.getPriority() : Ticket.TicketPriority.MEDIUM);
        ticket = ticketRepository.saveAndFlush(ticket);

        TicketRaisedBy raisedBy = new TicketRaisedBy();
        raisedBy.setTicketId(ticket.getId());
        raisedBy.setTicket(ticket);

        if (ticketDTO.getMemberId() != null) {
            Member member = memberRepository.findById(ticketDTO.getMemberId()).orElseThrow(() -> new RuntimeException("Member not found"));
            raisedBy.setMember(member);
        } else if (ticketDTO.getStaffId() != null) {
            Staff staff = staffRepository.findById(ticketDTO.getStaffId()).orElseThrow(() -> new RuntimeException("Staff not found"));
            raisedBy.setStaff(staff);
        }

        ticketRaisedByRepository.saveAndFlush(raisedBy);
    }

    @Transactional
    public void assignTicket(Long ticketId, String staffId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        Staff staff = staffRepository.findById(staffId).orElseThrow(() -> new RuntimeException("Staff not found"));

        TicketAssignedTo assignedTo = ticketAssignedToRepository.findById(ticketId).orElse(new TicketAssignedTo());

        assignedTo.setTicketId(ticketId);
        assignedTo.setTicket(ticket);
        assignedTo.setStaff(staff);
        ticketAssignedToRepository.saveAndFlush(assignedTo);

        ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.saveAndFlush(ticket);
    }

    @Transactional
    public void updateTicketStatus(Long ticketId, String status) {
        Optional<Ticket> ticket = ticketRepository.findById(ticketId);

        if(ticket.isPresent()) {
            Ticket t = ticket.get();
            Ticket.TicketStatus ticketStatus = Ticket.TicketStatus.valueOf(status.toUpperCase());
            t.setStatus(ticketStatus);
            t.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(t);
        }
    }

    private TicketResponseDTO TicketResponseDTOAssign(Ticket ticket) {
        TicketResponseDTO response = new TicketResponseDTO();

        response.setId(ticket.getId());
        response.setType(ticket.getType());
        response.setDescription(ticket.getDescription());
        response.setStatus(ticket.getStatus());
        response.setPriority(ticket.getPriority());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());

        Optional<TicketAssignedTo> assignedToOpt = ticketAssignedToRepository.findById(ticket.getId());
        assignedToOpt.ifPresent(assignedTo -> {
            response.setAssignedToId(assignedTo.getStaff().getNIC());
            response.setAssignedToName(assignedTo.getStaff().getName());
        });

        return response;
    }

    public List<TicketResponseDTO> getAllTicketsWithDetails() {
        List<Ticket> tickets = ticketRepository.findAll();
        List<TicketResponseDTO> responseList = new ArrayList<>();

        for (Ticket ticket : tickets) {
            TicketResponseDTO response = TicketResponseDTOAssign(ticket);

            responseList.add(response);
        }

        return responseList;
    }

    public TicketResponseDTO getTicketDetails(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));

        return TicketResponseDTOAssign(ticket);
    }


    public List<TicketRaisedBy> getTicketsRaisedByMember(Long memberId) {
        return ticketRaisedByRepository.findByMemberId(memberId);
    }

    public List<TicketRaisedBy> getTicketsRaisedByStaff(String staffId) {
        return ticketRaisedByRepository.findByStaffNIC(staffId);
    }

    public List<TicketAssignedTo> getTicketsAssignedToStaff(String staffId) {
        return ticketAssignedToRepository.findByStaffNIC(staffId);
    }

    public List<Ticket> filterTicketsByStatus(String status) {
        try {
            Ticket.TicketStatus ticketStatus = Ticket.TicketStatus.valueOf(status.toUpperCase());
            return ticketRepository.findByStatus(ticketStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + status);
        }
    }

    public List<Ticket> filterTicketsByPriority(String priority) {
        try {
            Ticket.TicketPriority ticketPriority = Ticket.TicketPriority.valueOf(priority.toUpperCase());
            return ticketRepository.findByPriority(ticketPriority);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + priority);
        }
    }

    public int countTicketsByStatus(String status) {
        try {
            Ticket.TicketStatus ticketStatus = Ticket.TicketStatus.valueOf(status.toUpperCase());
            return ticketRepository.findByStatus(ticketStatus).size();
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + status);
        }
    }
}