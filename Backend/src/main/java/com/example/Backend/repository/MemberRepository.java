package com.example.Backend.repository;

import com.example.Backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    List<Member> findByStatus(String status);

    List<Member> findByMembershipType(String membershipType);

    boolean existsByEmail(String email);
}