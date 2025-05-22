package com.example.Backend.controller;

import com.example.Backend.dto.LoginRequest;
import com.example.Backend.dto.LoginResponse;
import com.example.Backend.dto.MemberRegistrationDTO;
import com.example.Backend.model.Member;
import com.example.Backend.service.MemberService;
import com.example.Backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*") // Allow all origins for testing
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private JwtUtil jwtUtil;

    // Handles new member registration and returns the created member or bad request
    // if registration fails
    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody MemberRegistrationDTO registrationDTO) {
        try {
            Member member = memberService.registerMember(registrationDTO);
            return ResponseEntity.ok(member);
        } catch (RuntimeException e) {
            // Return proper JSON error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginMember(@RequestBody LoginRequest loginRequest) {
        try {
            Member member = memberService.authenticateMember(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtUtil.generateToken(member.getEmail());
            LoginResponse response = new LoginResponse(member, token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Member>> getMembersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(memberService.getMembersByStatus(status));
    }

    @GetMapping("/type/{membershipType}")
    public ResponseEntity<List<Member>> getMembersByType(@PathVariable String membershipType) {
        return ResponseEntity.ok(memberService.getMembersByMembershipType(membershipType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(memberService.getMemberById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member updatedMember) {
        try {
            Member member = memberService.updateMember(id, updatedMember);
            return ResponseEntity.ok(member);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        try {
            memberService.deleteMember(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<Member> getMemberProfile() {
        try {
            // For now, we'll return the first member as a placeholder
            // In a real application, you would get the authenticated user's ID
            List<Member> members = memberService.getAllMembers();
            if (members.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(members.get(0));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}