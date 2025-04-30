package com.example.Backend.service;

import com.example.Backend.model.Attendance;
import com.example.Backend.model.Member;
import com.example.Backend.repository.AttendanceRepository;
import com.example.Backend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MemberRepository memberRepository;

    public Attendance markAttendance(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        LocalDate today = LocalDate.now();

        // Check if attendance already marked for today
        if (attendanceRepository.existsByMemberAndDate(member, today)) {
            throw new RuntimeException("Attendance already marked for today");
        }

        Attendance attendance = new Attendance();
        attendance.setMember(member);
        attendance.setMemberName(member.getFirstName() + " " + member.getLastName());
        attendance.setDate(today);
        attendance.setTime(LocalTime.now());

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getMemberAttendance(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return attendanceRepository.findByMember(member);
    }

    public List<Attendance> getMemberAttendanceBetweenDates(Long memberId, LocalDate startDate, LocalDate endDate) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        return attendanceRepository.findByMemberAndDateBetween(member, startDate, endDate);
    }

    public List<Attendance> getAllAttendanceBetweenDates(LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByDateBetween(startDate, endDate);
    }
}