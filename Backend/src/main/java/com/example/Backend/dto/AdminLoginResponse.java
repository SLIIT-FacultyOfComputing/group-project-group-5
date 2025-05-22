package com.example.Backend.dto;

import com.example.Backend.model.Admin;
import com.example.Backend.model.Staff;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminLoginResponse {
    private Admin admin;
    private String token;
}
