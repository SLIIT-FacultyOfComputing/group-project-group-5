package com.example.Backend.service;

import com.example.Backend.model.Staff;
import com.example.Backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    public Staff addStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    public List<Staff> searchByName(String name) {
        return staffRepository.findByNameContainingIgnoreCase(name);
    }

    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }

    public Staff updateStaff(Long id, Staff updatedStaff) {
        return staffRepository.findById(id).map(staff -> {
            staff.setName(updatedStaff.getName());
            staff.setRole(updatedStaff.getRole());
            staff.setPhone(updatedStaff.getPhone());
            staff.setEmail(updatedStaff.getEmail());
            staff.setShift(updatedStaff.getShift());
            return staffRepository.save(staff);
        }).orElse(null);
    }

}
