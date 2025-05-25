package com.example.Backend.repository;

import com.example.Backend.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, String> {
    List<Staff> findByNameContainingIgnoreCase(String name);
}
