package com.example.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Backend.model.Staff;

public interface StaffRepository extends JpaRepository<Staff, String> {
    List<Staff> findByNameContainingIgnoreCase(String name);
}
