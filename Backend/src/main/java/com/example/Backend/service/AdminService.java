package com.example.Backend.service;

import com.example.Backend.model.Admin;
import com.example.Backend.model.Staff;
import com.example.Backend.repository.AdminRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Admin authenticate(String email, String password) {
        Admin admin = adminRepository.findByEmail(email).orElse(null);
        if (!BCrypt.checkpw(password, admin.getPassword())) {
            throw new RuntimeException("Invalid NIC or password");
        }

        return admin;
    }
}