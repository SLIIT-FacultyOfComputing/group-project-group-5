package com.example.Backend.repository;

import com.example.Backend.model.Attendance;
import com.example.Backend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
        List<Attendance> findByMember(Member member);

        List<Attendance> findByMemberAndDateBetween(
                        Member member,
                        LocalDate startDate,
                        LocalDate endDate);

        List<Attendance> findByDateBetween(
                        LocalDate startDate,
                        LocalDate endDate);

        boolean existsByMemberAndDate(
                        Member member,
                        LocalDate date);
}