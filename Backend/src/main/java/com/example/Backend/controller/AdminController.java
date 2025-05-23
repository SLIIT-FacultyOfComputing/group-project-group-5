package com.example.Backend.controller;

import com.example.Backend.dto.AdminLoginResponse;
import com.example.Backend.dto.StaffLoginResponse;
import com.example.Backend.model.Admin;
import com.example.Backend.model.Staff;
import com.example.Backend.service.AdminService;
import com.example.Backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Admin admin = adminService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtUtil.generateToken(admin.getEmail() != null ? admin.getEmail() : admin.getEmail());
            AdminLoginResponse response = new AdminLoginResponse(admin, token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}