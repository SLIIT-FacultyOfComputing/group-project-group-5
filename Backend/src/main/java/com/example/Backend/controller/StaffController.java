package com.example.Backend.controller;

import com.example.Backend.dto.StaffLoginRequest;
import com.example.Backend.dto.StaffLoginResponse;
import com.example.Backend.model.Staff;
import com.example.Backend.service.StaffService;
import com.example.Backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public Staff addStaff(@Valid @RequestBody Staff staff) {
        return staffService.addStaff(staff);
    }

    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.getAllStaff();
    }

    @GetMapping("/{NIC}")
    public Optional<Staff> getStaffByNIC(@PathVariable String NIC) {
        return staffService.getStaffByNIC(NIC);
    }

    @GetMapping("/search")
    public List<Staff> searchStaffByName(@RequestParam String name) {
        return staffService.searchByName(name);
    }

    @DeleteMapping("/{NIC}")
    public void deleteStaff(@PathVariable String NIC) {
        staffService.deleteStaff(NIC);
    }

    @PutMapping("updateNIC/{NIC}")
    public Staff updateNIC(@PathVariable String NIC, @RequestParam String newNIC) {
        return staffService.updateNIC(NIC, newNIC);
    }

    @PutMapping("updatePassword/{NIC}")
    public Staff updatePassword(@PathVariable String NIC, @RequestParam String newPassword) {
        return staffService.updatePassword(NIC, newPassword);
    }

    @PutMapping("updateName/{NIC}")
    public Staff updateName(@PathVariable String NIC, @RequestParam String newName) {
        return staffService.updateName(NIC, newName);
    }

    @PutMapping("updatePhone/{NIC}")
    public Staff updatePhone(@PathVariable String NIC, @RequestParam String newPhone) {
        return staffService.updatePhone(NIC, newPhone);
    }

    @PutMapping("updateRole/{NIC}")
    public Staff updateRole(@PathVariable String NIC, @RequestParam String newRole) {
        return staffService.updateRole(NIC, newRole);
    }

    @PutMapping("updateShift/{NIC}")
    public Staff updateShift(@PathVariable String NIC, @RequestParam String newShift) {
        return staffService.updateShift(NIC, newShift);
    }

    @PutMapping("updateEmail/{NIC}")
    public Staff updateEmail(@PathVariable String NIC, @RequestParam String newEmail) {
        return staffService.updateEmail(NIC, newEmail);
    }

    @PutMapping("/{NIC}")
    public Staff updateStaff(@PathVariable String NIC, @Valid @RequestBody Staff updatedStaff) {
        System.out.println("Received update request for NIC: " + NIC);
        System.out.println("Updated staff data: " + updatedStaff);
        return staffService.updateStaff(NIC, updatedStaff);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginStaff(@RequestBody StaffLoginRequest loginRequest) {
        try {
            Staff staff = staffService.authenticateStaff(loginRequest.getNic(), loginRequest.getPassword());
            String token = jwtUtil.generateToken(staff.getEmail() != null ? staff.getEmail() : staff.getNIC());
            StaffLoginResponse response = new StaffLoginResponse(staff, token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

}
