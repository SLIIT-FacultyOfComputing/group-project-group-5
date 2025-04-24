package com.example.Backend.service;

import com.example.Backend.dto.MemberRegistrationDTO;
import com.example.Backend.model.Member;
import com.example.Backend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Member registerMember(MemberRegistrationDTO registrationDTO) {
        if (memberRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (!registrationDTO.getPassword().equals(registrationDTO.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        Member member = new Member();
        member.setFirstName(registrationDTO.getFirstName());
        member.setLastName(registrationDTO.getLastName());
        member.setEmail(registrationDTO.getEmail());
        member.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        member.setPhoneNumber(registrationDTO.getPhoneNumber());
        member.setAddress(registrationDTO.getAddress());
        member.setDateOfBirth(registrationDTO.getDateOfBirth());
        member.setMembershipType(registrationDTO.getMembershipType());
        member.setEmergencyContact(registrationDTO.getEmergencyContact());
        member.setFitnessGoals(registrationDTO.getFitnessGoals());
        member.setMedicalConditions(registrationDTO.getMedicalConditions());
        member.setPreferredWorkoutTime(registrationDTO.getPreferredWorkoutTime());

        return memberRepository.save(member);
    }

    public Member authenticateMember(String email, String password) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        return member;
    }

    public List<Member> getAllMembers() {
        System.out.println("Fetching all members...");
        List<Member> members = memberRepository.findAll();
        System.out.println("Found " + members.size() + " members");
        return members;
    }

    public List<Member> getMembersByStatus(String status) {
        return memberRepository.findByStatus(status);
    }

    public List<Member> getMembersByMembershipType(String membershipType) {
        return memberRepository.findByMembershipType(membershipType);
    }

    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }
}