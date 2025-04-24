package com.example.Backend.repository;

import com.example.Backend.model.Equipment;
import com.example.Backend.model.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByDeletedFalse();

    List<Equipment> findByIdAndDeletedFalse(Long id);

    List<Equipment> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseAndDeletedFalse(String search, String search1);

    List<Equipment> findByStatus(EquipmentStatus newStatus);

    @Modifying
    @Transactional
    @Query("UPDATE Equipment e SET e.deleted = true WHERE e.id = ?1")
    void softDeleteById(Long id);

}