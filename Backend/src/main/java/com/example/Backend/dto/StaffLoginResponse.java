package com.example.Backend.dto;

import com.example.Backend.model.Staff;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffLoginResponse {
    private Staff staff;
    private String token;
}
