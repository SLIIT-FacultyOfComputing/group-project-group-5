package com.example.Backend.controller;

import com.example.Backend.dto.*;
import com.example.Backend.service.RoutineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RoutineController {

    private final RoutineService routineService;

    public RoutineController(RoutineService routineService) {
        this.routineService = routineService;
    }

    @PostMapping("/routines")
    public ResponseEntity<RoutineResponseDTO> createRoutine(@RequestBody RoutineRequestDTO request) {
        RoutineResponseDTO response = routineService.createRoutine(request);
        if (response == null) {
            return ResponseEntity.status(400).build();
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/routines/{memberId}")
    public ResponseEntity<List<RoutineSummaryDTO>> getRoutineSummariesByMemberId(@PathVariable Long memberId) {
        List<RoutineSummaryDTO> summaries = routineService.getRoutineSummariesByMemberId(memberId);
        if (summaries == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/routines/details/{routineId}")
    public ResponseEntity<RoutineDetailsResponseDTO> getRoutineDetails(@PathVariable Long routineId) {
        RoutineDetailsResponseDTO response = routineService.getRoutineDetails(routineId);
        if (response == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/routines/{routineId}/name")
    public ResponseEntity<RoutineRenameDTO> updateRoutineName(
            @PathVariable Long routineId,
            @RequestBody Map<String, String> request) {
        RoutineRenameDTO response = routineService.updateRoutineName(routineId, request);
        if (response == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/routines/{routineId}/exercises")
    public ResponseEntity<RoutineResponseDTO> addExerciseToRoutine(
            @PathVariable Long routineId,
            @RequestBody ExerciseAssignmentDTO assignment) {
        RoutineResponseDTO response = routineService.addExerciseToRoutine(routineId, assignment);
        if (response == null) {
            return ResponseEntity.status(400).build();
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/routines/{routineId}/exercises/{exerciseId}")
    public ResponseEntity<RoutineResponseDTO> removeExerciseFromRoutine(
            @PathVariable Long routineId,
            @PathVariable Long exerciseId) {
        RoutineResponseDTO response = routineService.removeExerciseFromRoutine(routineId, exerciseId);
        if (response == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/routines/{routineId}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Long routineId) {
        boolean deleted = routineService.deleteRoutine(routineId);
        if (!deleted) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.noContent().build();
    }
}