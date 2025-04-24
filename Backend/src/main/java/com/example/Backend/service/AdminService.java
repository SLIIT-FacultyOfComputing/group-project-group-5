package com.example.Backend.service;

import com.example.Backend.model.Admin;
import com.example.Backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean authenticate(String email, String password) {
        Admin admin = adminRepository.findByEmail(email).orElse(null);
        return admin != null && passwordEncoder.matches(password, admin.getPassword());
    }
}