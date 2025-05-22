package com.example.Backend.controller;

import com.example.Backend.dto.SessionRequestDTO;
import com.example.Backend.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Enable CORS for all origins
public class SessionController {
    private static final Logger logger = LoggerFactory.getLogger(SessionController.class);
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

    @GetMapping("/sessions/stats/{exerciseId}/{memberId}")
    public ResponseEntity<List<Map<String, Object>>> getExerciseStats(
            @PathVariable Long exerciseId,
            @PathVariable Long memberId) {
        logger.info("Received request for exercise stats - exerciseId: {}, memberId: {}", exerciseId, memberId);
        try {
            List<Map<String, Object>> stats = sessionService.getExerciseStats(exerciseId, memberId);
            logger.info("Found {} stats records", stats.size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching exercise stats", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}