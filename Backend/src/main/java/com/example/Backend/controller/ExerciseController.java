package com.example.Backend.controller;

import com.example.Backend.model.Exercise;
import com.example.Backend.service.ExerciseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @PostMapping("/exercises")
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {
        Exercise savedExercise = exerciseService.createExercise(exercise);
        return ResponseEntity.ok(savedExercise);
    }

    @GetMapping("/exercises")
    public ResponseEntity<List<Exercise>> getAllExercises(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String primaryMuscleGroup,
            @RequestParam(required = false) String equipment) {
        List<Exercise> exercises = exerciseService.getAllExercises(name, primaryMuscleGroup, equipment);
        return ResponseEntity.ok(exercises);
    }

    @PutMapping("/exercises/{exerciseId}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long exerciseId, @RequestBody Exercise updatedExercise) {
        Exercise savedExercise = exerciseService.updateExercise(exerciseId, updatedExercise);
        if (savedExercise == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(savedExercise);
    }

    @DeleteMapping("/exercises/{exerciseId}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long exerciseId) {
        boolean deleted = exerciseService.deleteExercise(exerciseId);
        if (!deleted) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.noContent().build();
    }
}