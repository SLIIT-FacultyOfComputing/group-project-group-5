package com.example.Backend.service;

import com.example.Backend.model.Payment;
import com.example.Backend.model.Member;
import com.example.Backend.repository.PaymentRepository;
import com.example.Backend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private MemberRepository memberRepository;

    public Payment createPayment(Long memberId, Double amount, String paymentMethod, String description) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Payment payment = new Payment();
        payment.setMember(member);
        payment.setAmount(amount);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(paymentMethod);
        payment.setDescription(description);
        payment.setInvoiceNumber(generateInvoiceNumber());

        return paymentRepository.save(payment);
    }

    private String generateInvoiceNumber() {
        // Format: INV-YYYYMMDD-XXXXX
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        return String.format("INV-%s-%s", date, random);
    }
}