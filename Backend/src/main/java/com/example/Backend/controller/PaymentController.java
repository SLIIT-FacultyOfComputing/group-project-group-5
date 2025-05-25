package com.example.Backend.controller;

import com.example.Backend.model.Payment;
import com.example.Backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> createPayment(
            @RequestParam Long memberId,
            @RequestParam Double amount,
            @RequestParam String paymentMethod,
            @RequestParam(required = false) String description) {

        Payment payment = paymentService.createPayment(memberId, amount, paymentMethod, description);
        return ResponseEntity.ok(payment);
    }
}