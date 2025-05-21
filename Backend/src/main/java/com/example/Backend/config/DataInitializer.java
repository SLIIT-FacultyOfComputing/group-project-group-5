package com.example.Backend.config;

import com.example.Backend.model.Admin;
import com.example.Backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!adminRepository.existsById("admin@gymsync.lk")) {
            Admin admin = new Admin("admin@gymsync.lk", passwordEncoder.encode("4321"), "Admin");
            adminRepository.save(admin);
        }
    }
}