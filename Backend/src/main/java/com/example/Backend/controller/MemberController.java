package com.example.Backend.controller;

import com.example.Backend.model.Member;
import com.example.Backend.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }

    @GetMapping("/members/{memberId}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long memberId) {
        Member member = memberService.getMemberById(memberId);
        if (member == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(member);
    }
}