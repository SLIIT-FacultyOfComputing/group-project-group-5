package com.example.Backend.controller;

import com.example.Backend.dto.SessionRequestDTO;
import com.example.Backend.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/sessions")
    public ResponseEntity<Void> logSession(@RequestBody SessionRequestDTO request) {
        boolean success = sessionService.logSession(request);
        if (!success) {
            return ResponseEntity.status(400).build();
        }
        return ResponseEntity.ok().build();
    }
}