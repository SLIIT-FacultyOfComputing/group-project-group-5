package com.example.Backend.controller;

import com.example.Backend.dto.SessionRequestDTO;
import com.example.Backend.dto.ExerciseWeightStatDTO;
import com.example.Backend.model.ExerciseLog;
import com.example.Backend.repository.ExerciseLogRepository;
import com.example.Backend.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SessionController {

    private final SessionService sessionService;
    private final ExerciseLogRepository exerciseLogRepository;

    public SessionController(SessionService sessionService, ExerciseLogRepository exerciseLogRepository) {
        this.sessionService = sessionService;
        this.exerciseLogRepository = exerciseLogRepository;
    }

    @PostMapping("/sessions")
    public ResponseEntity<Void> logSession(@RequestBody SessionRequestDTO request) {
        boolean success = sessionService.logSession(request);
        if (!success) {
            return ResponseEntity.status(400).build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exercise-stats/{exerciseId}/{memberId}")
    public ResponseEntity<List<ExerciseWeightStatDTO>> getExerciseWeightStats(
            @PathVariable Long exerciseId,
            @PathVariable Long memberId) {
        try {
            List<ExerciseLog> logs = exerciseLogRepository.findByExerciseIdAndMemberIdOrderBySessionCounterAsc(exerciseId, memberId);
            List<ExerciseWeightStatDTO> stats = new ArrayList<>();
            for (ExerciseLog log : logs) {
                stats.add(new ExerciseWeightStatDTO(log.getSessionCounter(), log.getWeight()));
            }
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }
}