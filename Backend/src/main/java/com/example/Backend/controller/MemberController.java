package com.example.Backend.controller;

import com.example.Backend.dto.MemberDTO;
import com.example.Backend.model.Member;
import com.example.Backend.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/members")
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        Member savedMember = memberService.createMember(member);
        return ResponseEntity.ok(savedMember);
    }

    @GetMapping("/members")
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        List<Member> members = memberService.getAllMembers();
        List<MemberDTO> memberDTOs = members.stream()
                .map(member -> new MemberDTO(member.getId(), member.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(memberDTOs);
    }

    @GetMapping("/members/{memberId}")
    public ResponseEntity<MemberDTO> getMemberById(@PathVariable Long memberId) {
        Member member = memberService.getMemberById(memberId);
        if (member == null) {
            return ResponseEntity.status(404).build();
        }
        MemberDTO memberDTO = new MemberDTO(member.getId(), member.getName());
        return ResponseEntity.ok(memberDTO);
    }
}