package com.example.Backend.repository;

import com.example.Backend.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String search, String search1);
}