package com.example.Backend.service;

import com.example.Backend.model.Staff;
import com.example.Backend.repository.StaffRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    public Staff addStaff(Staff staff) {
        String hashed = BCrypt.hashpw(staff.getPassword(), BCrypt.gensalt());
        staff.setPassword(hashed);
        return staffRepository.save(staff);
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Optional<Staff> getStaffByNIC(String NIC) {
        return staffRepository.findById(NIC);
    }

    public List<Staff> searchByName(String name) {
        return staffRepository.findByNameContainingIgnoreCase(name);
    }

    public void deleteStaff(String NIC) {
        staffRepository.deleteById(NIC);
    }

    public Staff updateNIC (String NIC, String newNIC) {
        Staff staff = staffRepository.findById(NIC).orElseThrow(() -> new RuntimeException("Staff not found"));
        staff.setNIC(newNIC);
        return staffRepository.save(staff);
    }

    public  Staff updatePassword(String NIC, String newPassword) {
        Staff staff = staffRepository.findById(NIC).orElse(null);
        if (staff != null) {
            String hashed = BCrypt.hashpw(newPassword, BCrypt.gensalt());
            staff.setPassword(hashed);
            return staffRepository.save(staff);
        } else {
            return null;
        }
    }

    public Staff updateName(String NIC, String newName) {
        Staff staff = staffRepository.findById(NIC).orElse(null);
        if (staff != null) {
            staff.setName(newName);
            return staffRepository.save(staff);
        } else {
            return null;
        }
    }

    public Staff updatePhone(String NIC, String newPhone) {
        Staff staff = staffRepository.findById(NIC).orElse(null);
        if (staff != null) {
            staff.setPhone(newPhone);
            return staffRepository.save(staff);
        }else {
            return null;
        }
    }

    public Staff updateShift(String NIC, String newShift) {
        Staff staff = staffRepository.findById(NIC).orElse(null);
        if (staff != null) {
            staff.setShift(newShift);
            return staffRepository.save(staff);
        } else {
            return null;
        }
    }

    public Staff updateRole(String NIC, String newRole) {
        Optional<Staff> staff = staffRepository.findById(NIC);
        if (staff.isPresent()) {
            Staff staff1 = staff.get();
            Staff.Role role = Staff.Role.valueOf(newRole.toUpperCase());
            staff1.setRole(role);
            return staffRepository.save(staff1);
        } else {
            return null;
        }
    }

    // Add a method to handle full staff updates
    public Staff updateStaff(String NIC, Staff updatedStaff) {
        System.out.println("Updating staff with NIC: " + NIC);
        Staff existingStaff = staffRepository.findById(NIC)
                .orElseThrow(() -> new RuntimeException("Staff not found with NIC: " + NIC));

        // Update fields
        existingStaff.setName(updatedStaff.getName());
        existingStaff.setPhone(updatedStaff.getPhone());
        existingStaff.setRole(updatedStaff.getRole());

        // Only update startDate if it's provided
        if (updatedStaff.getStartDate() != null) {
            existingStaff.setStartDate(updatedStaff.getStartDate());
        }

        // Only update shift if it's provided
        if (updatedStaff.getShift() != null) {
            existingStaff.setShift(updatedStaff.getShift());
        }

        // Only update password if it's provided
        if (updatedStaff.getPassword() != null && !updatedStaff.getPassword().isEmpty()) {
            String hashed = BCrypt.hashpw(updatedStaff.getPassword(), BCrypt.gensalt());
            existingStaff.setPassword(hashed);
        }

        System.out.println("Saving updated staff: " + existingStaff);
        return staffRepository.save(existingStaff);
    }

    public Staff updateEmail(String NIC, String newEmail) {
        Staff staff = staffRepository.findById(NIC).orElse(null);
        if (staff != null) {
            staff.setEmail(newEmail);
            return staffRepository.save(staff);
        } else {
            return null;
        }
    }

    public Staff authenticateStaff(String nic, String password) {
        Staff staff = staffRepository.findById(nic)
                .orElseThrow(() -> new RuntimeException("Invalid NIC or password"));

        if (!BCrypt.checkpw(password, staff.getPassword())) {
            throw new RuntimeException("Invalid NIC or password");
        }

        return staff;
    }
}
