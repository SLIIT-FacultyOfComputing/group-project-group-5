package com.example.Backend.service;

import com.example.Backend.model.Member;
import com.example.Backend.repository.MemberRepository;
import org.springframework.stereotype.Service;
import java.util.List;

// Custom exception class for meaningful error messages
class MemberServiceException extends RuntimeException {
    public MemberServiceException(String message) {
        super(message);
    }
}

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    // Constructor to inject repository
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // Create a new member
    public Member createMember(Member member) {
        if (member.getName() == null || member.getName().trim().isEmpty()) {
            throw new MemberServiceException("Member name cannot be empty");
        }
        return memberRepository.save(member);
    }

    // Get all members
    public List<Member> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        if (members.isEmpty()) {
            throw new MemberServiceException("No members found");
        }
        return members;
    }

    // Get member by ID
    public Member getMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberServiceException("Member not found"));
    }
}