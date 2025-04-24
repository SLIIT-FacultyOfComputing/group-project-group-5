package com.example.Backend.controller;

import com.example.Backend.model.Attendance;
import com.example.Backend.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/mark/{memberId}")
    public ResponseEntity<Attendance> markAttendance(@PathVariable Long memberId) {
        try {
            Attendance attendance = attendanceService.markAttendance(memberId);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Attendance>> getMemberAttendance(@PathVariable Long memberId) {
        try {
            List<Attendance> attendance = attendanceService.getMemberAttendance(memberId);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/member/{memberId}/between")
    public ResponseEntity<List<Attendance>> getMemberAttendanceBetweenDates(
            @PathVariable Long memberId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Attendance> attendance = attendanceService.getMemberAttendanceBetweenDates(memberId, startDate,
                    endDate);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/between")
    public ResponseEntity<List<Attendance>> getAllAttendanceBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Attendance> attendance = attendanceService.getAllAttendanceBetweenDates(startDate, endDate);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}