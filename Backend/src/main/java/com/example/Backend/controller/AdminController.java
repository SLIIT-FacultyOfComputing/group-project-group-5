package com.example.Backend.controller;

import com.example.Backend.dto.*;
import com.example.Backend.model.Exercise;
import com.example.Backend.model.Member;
import com.example.Backend.model.Routine;
import com.example.Backend.repository.ExerciseRepository;
import com.example.Backend.repository.MemberRepository;
import com.example.Backend.repository.RoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AdminController {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private MemberRepository memberRepository;

    @PostMapping("/members")
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        Member savedMember = memberRepository.save(member);
        return ResponseEntity.ok(savedMember);
    }

    @GetMapping("/members")
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        return ResponseEntity.ok(members);
    }

    @PostMapping("/exercises")
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {
        Exercise savedExercise = exerciseRepository.save(exercise);
        return ResponseEntity.ok(savedExercise);
    }

    // for the search bar - exercises
    @GetMapping("/exercises")
    public ResponseEntity<List<Exercise>> getAllExercises(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String primaryMuscleGroup,
            @RequestParam(required = false) String equipment) {

        List<Exercise> exercises;

        if (name != null && primaryMuscleGroup != null && equipment != null) {
            // All three filters
            exercises = exerciseRepository.findByNameContainingIgnoreCaseAndPrimaryMuscleGroupIgnoreCaseAndEquipmentIgnoreCase(
                    name, primaryMuscleGroup, equipment);
        } else if (name != null && primaryMuscleGroup != null) {
            // Name and muscle group
            exercises = exerciseRepository.findByNameContainingIgnoreCaseAndPrimaryMuscleGroupIgnoreCase(name, primaryMuscleGroup);

        } else if (name != null && equipment != null) {
            // Name and equipment
            exercises = exerciseRepository.findByNameContainingIgnoreCaseAndEquipmentIgnoreCase(name, equipment);
        } else if (primaryMuscleGroup != null && equipment != null) {
            // Muscle group and equipment
            exercises = exerciseRepository.findByPrimaryMuscleGroupIgnoreCaseAndEquipmentIgnoreCase(primaryMuscleGroup, equipment);
        } else if (name != null) {
            // Only name
            exercises = exerciseRepository.findByNameContainingIgnoreCase(name);
        } else if (primaryMuscleGroup != null) {
            // Only muscle group
            exercises = exerciseRepository.findByPrimaryMuscleGroupIgnoreCase(primaryMuscleGroup);
        } else if (equipment != null) {
            // Only equipment
            exercises = exerciseRepository.findByEquipmentIgnoreCase(equipment);
        } else {
            // No filters
            exercises = exerciseRepository.findAll();
        }

        return ResponseEntity.ok(exercises);
    }

    @PutMapping("/exercises/{exerciseId}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long exerciseId, @RequestBody Exercise updatedExercise) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
        exercise.setName(updatedExercise.getName());
        exercise.setEquipment(updatedExercise.getEquipment());
        exercise.setPrimaryMuscleGroup(updatedExercise.getPrimaryMuscleGroup());
        exercise.setSecondaryMuscleGroup(updatedExercise.getSecondaryMuscleGroup());
        exercise.setAnimationUrl(updatedExercise.getAnimationUrl());
        Exercise savedExercise = exerciseRepository.save(exercise);
        return ResponseEntity.ok(savedExercise);
    }

    // this is a comment
    @DeleteMapping("/exercises/{exerciseId}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long exerciseId) {
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);
        if (!exerciseOptional.isPresent()) {
            return ResponseEntity.status(404).build();
        }
        Exercise exercise = exerciseOptional.get();
        List<Routine> routines = routineRepository.findByExercisesContaining(exercise);
        for (Routine routine : routines) {
            routine.getExercises().remove(exercise);
        }
        routineRepository.saveAll(routines);
        exerciseRepository.delete(exercise);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/routines")
    public ResponseEntity<RoutineResponseDTO> createRoutine(@RequestBody RoutineRequestDTO routineRequest) {
        Member member = memberRepository.findById(routineRequest.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        List<Routine> memberRoutines = routineRepository.findByMemberId(routineRequest.getMemberId());
        if (memberRoutines.size() >= 5) {
            throw new RuntimeException("Maximum 5 routines allowed per member");
        }

        Routine routine = new Routine();
        routine.setName(routineRequest.getName());
        routine.setMember(member);
        List<Exercise> exercises = exerciseRepository.findAllById(routineRequest.getExerciseIds());
        routine.setExercises(exercises);

        Routine savedRoutine = routineRepository.save(routine);

        List<Long> exerciseIds = exercises.stream().map(Exercise::getId).collect(Collectors.toList());
        RoutineResponseDTO response = new RoutineResponseDTO(
                savedRoutine.getId(),
                savedRoutine.getName(),
                member.getId(),
                member.getName(),
                exerciseIds
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/routines/{memberId}")
    public ResponseEntity<List<RoutineSummaryDTO>> getRoutineSummariesByMemberId(@PathVariable Long memberId) {
        List<Routine> routines = routineRepository.findByMemberId(memberId);
        List<RoutineSummaryDTO> responseList = new ArrayList<>();
        for (Routine routine : routines) {
            RoutineSummaryDTO summary = new RoutineSummaryDTO();
            summary.setId(routine.getId());
            summary.setName(routine.getName());
            responseList.add(summary);
        }
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/routines/details/{routineId}")
    public ResponseEntity<RoutineDetailsResponseDTO> getRoutineDetails(@PathVariable Long routineId) {
        Optional<Routine> routineOptional = routineRepository.findById(routineId);
        if (!routineOptional.isPresent()) {
            return ResponseEntity.status(404).body(null);
        }
        Routine routine = routineOptional.get();
        RoutineDetailsResponseDTO response = new RoutineDetailsResponseDTO();
        response.setName(routine.getName());

        List<ExerciseDetailsDTO> exerciseDetailsList = new ArrayList<>();
        for (Exercise exercise : routine.getExercises()) {
            ExerciseDetailsDTO details = new ExerciseDetailsDTO();
            details.setId(exercise.getId());
            details.setName(exercise.getName());
            details.setEquipment(exercise.getEquipment());
            details.setPrimaryMuscleGroup(exercise.getPrimaryMuscleGroup());
            details.setSecondaryMuscleGroups(exercise.getSecondaryMuscleGroup());
            details.setAnimationUrl(exercise.getAnimationUrl());
            exerciseDetailsList.add(details);
        }
        response.setExercises(exerciseDetailsList);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/routines/{routineId}/name")
    public ResponseEntity<RoutineRenameDTO> updateRoutineName(
            @PathVariable Long routineId,
            @RequestBody Map<String, String> request) {
        String name = request.get("name");
        Optional<Routine> routineOptional = routineRepository.findById(routineId);
        if (!routineOptional.isPresent()) {
            return ResponseEntity.status(404).body(null);
        }
        Routine routine = routineOptional.get();
        routine.setName(name);
        Routine updatedRoutine = routineRepository.save(routine);
        RoutineRenameDTO response = new RoutineRenameDTO(
                updatedRoutine.getId(), updatedRoutine.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/routines/{routineId}/exercises")
    public ResponseEntity<RoutineResponseDTO> addExerciseToRoutine(
            @PathVariable Long routineId,
            @RequestBody Long exerciseId) {
        Optional<Routine> routineOptional = routineRepository.findById(routineId);
        if (!routineOptional.isPresent()) {
            return ResponseEntity.status(404).body(null);
        }
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);
        if (!exerciseOptional.isPresent()) {
            return ResponseEntity.status(404).body(null);
        }
        Routine routine = routineOptional.get();
        Exercise exercise = exerciseOptional.get();
        if (routine.getExercises() == null) {
            routine.setExercises(new ArrayList<>());
        }
        routine.getExercises().add(exercise);
        Routine updatedRoutine = routineRepository.save(routine);
        List<Long> exerciseIds = new ArrayList<>();
        for (Exercise ex : updatedRoutine.getExercises()) {
            exerciseIds.add(ex.getId());
        }
        RoutineResponseDTO response = new RoutineResponseDTO(
                updatedRoutine.getId(), updatedRoutine.getName(),
                updatedRoutine.getMember().getId(), updatedRoutine.getMember().getName(),
                exerciseIds);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/routines/{routineId}/exercises/{exerciseId}")
    public ResponseEntity<RoutineResponseDTO> removeExerciseFromRoutine(
            @PathVariable Long routineId,
            @PathVariable Long exerciseId) {
        Optional<Routine> routineOptional = routineRepository.findById(routineId);
        if (!routineOptional.isPresent()) {
            return ResponseEntity.status(404).body(null);
        }
        Routine routine = routineOptional.get();
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);
        if (!exerciseOptional.isPresent() || !routine.getExercises().contains(exerciseOptional.get())) {
            return ResponseEntity.status(404).body(null);
        }
        routine.getExercises().remove(exerciseOptional.get());
        Routine updatedRoutine = routineRepository.save(routine);
        List<Long> exerciseIds = new ArrayList<>();
        for (Exercise ex : updatedRoutine.getExercises()) {
            exerciseIds.add(ex.getId());
        }
        RoutineResponseDTO response = new RoutineResponseDTO(
                updatedRoutine.getId(), updatedRoutine.getName(),
                updatedRoutine.getMember().getId(), updatedRoutine.getMember().getName(),
                exerciseIds);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/routines/{routineId}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Long routineId) {
        Optional<Routine> routineOptional = routineRepository.findById(routineId);
        if (!routineOptional.isPresent()) {
            return ResponseEntity.status(404).body(null);
        }
        routineRepository.deleteById(routineId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/members/{memberId}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return ResponseEntity.ok(member);
    }

}