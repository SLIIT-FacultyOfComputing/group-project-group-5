package com.example.Backend.controller;

import com.example.Backend.model.Staff;
import com.example.Backend.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping
    public Staff addStaff(@Valid @RequestBody Staff staff) {
        return staffService.addStaff(staff);
    }

    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.getAllStaff();
    }

    @GetMapping("/{id}")
    public Optional<Staff> getStaffById(@PathVariable Long id) {
        return staffService.getStaffById(id);
    }

    @GetMapping("/search")
    public List<Staff> searchStaffByName(@RequestParam String name) {
        return staffService.searchByName(name);
    }

    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
    }

    @PutMapping("/{id}")
    public Staff updateStaff(@PathVariable Long id, @Valid @RequestBody Staff updatedStaff) {
        return staffService.updateStaff(id, updatedStaff);
    }
}
