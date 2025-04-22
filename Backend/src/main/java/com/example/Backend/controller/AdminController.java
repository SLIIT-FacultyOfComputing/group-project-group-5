package com.example.Backend.controller;

import com.example.Backend.dto.*;
import com.example.Backend.model.*;
import com.example.Backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AdminController {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RoutineExerciseRepository routineExerciseRepository;

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

    @GetMapping("/exercises")
    public ResponseEntity<List<Exercise>> getAllExercises(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String primaryMuscleGroup,
            @RequestParam(required = false) String equipment) {

        List<Exercise> exercises;

        if (name != null && primaryMuscleGroup != null && equipment != null) {
            exercises = exerciseRepository.findByNameContainingIgnoreCaseAndPrimaryMuscleGroupIgnoreCaseAndEquipmentIgnoreCase(
                    name, primaryMuscleGroup, equipment);
        } else if (name != null && primaryMuscleGroup != null) {
            exercises = exerciseRepository.findByNameContainingIgnoreCaseAndPrimaryMuscleGroupIgnoreCase(name, primaryMuscleGroup);
        } else if (name != null && equipment != null) {
            exercises = exerciseRepository.findByNameContainingIgnoreCaseAndEquipmentIgnoreCase(name, equipment);
        } else if (primaryMuscleGroup != null && equipment != null) {
            exercises = exerciseRepository.findByPrimaryMuscleGroupIgnoreCaseAndEquipmentIgnoreCase(primaryMuscleGroup, equipment);
        } else if (name != null) {
            exercises = exerciseRepository.findByNameContainingIgnoreCase(name);
        } else if (primaryMuscleGroup != null) {
            exercises = exerciseRepository.findByPrimaryMuscleGroupIgnoreCase(primaryMuscleGroup);
        } else if (equipment != null) {
            exercises = exerciseRepository.findByEquipmentIgnoreCase(equipment);
        } else {
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

    @DeleteMapping("/exercises/{exerciseId}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long exerciseId) {
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(exerciseId);
        if (!exerciseOptional.isPresent()) {
            return ResponseEntity.status(404).build();
        }
        Exercise exercise = exerciseOptional.get();
        List<Routine> routines = routineRepository.findByExercisesContaining(exercise);
        for (Routine routine : routines) {
            List<RoutineExercise> routineExercises = routine.getRoutineExercises();
            for (int i = routineExercises.size() - 1; i >= 0; i--) {
                if (routineExercises.get(i).getExercise().equals(exercise)) {
                    routineExercises.remove(i);
                }
            }
        }
        routineRepository.saveAll(routines);
        exerciseRepository.delete(exercise);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/routines")
    public ResponseEntity<RoutineResponseDTO> createRoutine(@RequestBody RoutineRequestDTO request) {
        try {
            // Validate member
            Optional<Member> memberOptional = memberRepository.findById(request.getMemberId());
            if (memberOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            Member member = memberOptional.get();

            // Create Routine without exercises
            Routine routine = new Routine();
            routine.setName(request.getName());
            routine.setMember(member);
            routine.setRoutineExercises(new ArrayList<>());
            routine = routineRepository.save(routine);

            // Add RoutineExercise entries to the existing collection
            List<RoutineExercise> routineExercises = routine.getRoutineExercises();
            for (RoutineRequestDTO.ExerciseAssignment assignment : request.getExerciseAssignments()) {
                Optional<Exercise> exerciseOptional = exerciseRepository.findById(assignment.getExerciseId());
                if (exerciseOptional.isEmpty()) {
                    return ResponseEntity.badRequest().body(null);
                }
                if (assignment.getSets() <= 0 || assignment.getReps() <= 0) {
                    return ResponseEntity.badRequest().body(null);
                }
                Exercise exercise = exerciseOptional.get();
                RoutineExercise routineExercise = new RoutineExercise(routine, exercise, assignment.getSets(), assignment.getReps());
                routineExercises.add(routineExercise);
            }

            // Save Routine to persist the updated collection
            routineRepository.save(routine);

            // Build response
            List<Long> exerciseIds = new ArrayList<>();
            for (RoutineExercise re : routineExercises) {
                exerciseIds.add(re.getExercise().getId());
            }

            RoutineResponseDTO response = new RoutineResponseDTO(
                    routine.getId(),
                    routine.getName(),
                    member.getId(),
                    member.getName(),
                    exerciseIds
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
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
        if (routineOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Routine routine = routineOptional.get();

        List<RoutineExercise> routineExercises = routineExerciseRepository.findByRoutineId(routineId);
        List<ExerciseDetailsDTO> exerciseDetails = new ArrayList<>();
        for (RoutineExercise re : routineExercises) {
            Exercise exercise = re.getExercise();
            exerciseDetails.add(new ExerciseDetailsDTO(
                    exercise.getId(),
                    exercise.getName(),
                    exercise.getEquipment(),
                    exercise.getPrimaryMuscleGroup(),
                    exercise.getSecondaryMuscleGroup(),
                    exercise.getAnimationUrl(),
                    re.getSets(),
                    re.getReps()
            ));
        }

        RoutineDetailsResponseDTO response = new RoutineDetailsResponseDTO(
                routine.getId(),
                routine.getName(),
                exerciseDetails
        );
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
            @RequestBody ExerciseAssignmentDTO assignment) {
        Optional<Routine> routineOptional = routineRepository.findById(routineId);
        if (!routineOptional.isPresent()) {
            return ResponseEntity.status(404).body(null);
        }
        Optional<Exercise> exerciseOptional = exerciseRepository.findById(assignment.getExerciseId());
        if (!exerciseOptional.isPresent()) {
            return ResponseEntity.status(404).body(null);
        }
        Routine routine = routineOptional.get();
        Exercise exercise = exerciseOptional.get();

        // Check if exercise already exists in routine
        List<RoutineExercise> routineExercises = routine.getRoutineExercises();
        for (RoutineExercise re : routineExercises) {
            if (re.getExercise().getId().equals(assignment.getExerciseId())) {
                return ResponseEntity.badRequest().body(null);
            }
        }

        RoutineExercise routineExercise = new RoutineExercise(routine, exercise, assignment.getSets(), assignment.getReps());
        routineExerciseRepository.save(routineExercise);

        if (routineExercises == null) {
            routine.setRoutineExercises(new ArrayList<>());
            routineExercises = routine.getRoutineExercises();
        }
        routineExercises.add(routineExercise);
        routineRepository.save(routine);

        List<Long> exerciseIds = new ArrayList<>();
        for (RoutineExercise re : routineExercises) {
            exerciseIds.add(re.getExercise().getId());
        }

        RoutineResponseDTO response = new RoutineResponseDTO(
                routine.getId(),
                routine.getName(),
                routine.getMember().getId(),
                routine.getMember().getName(),
                exerciseIds
        );
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

        List<RoutineExercise> routineExercises = routine.getRoutineExercises();
        RoutineExercise toRemove = null;
        for (RoutineExercise re : routineExercises) {
            if (re.getExercise().getId().equals(exerciseId)) {
                toRemove = re;
                break;
            }
        }

        if (toRemove == null) {
            return ResponseEntity.status(404).body(null);
        }

        routineExercises.remove(toRemove);
        routineExerciseRepository.delete(toRemove);
        routineRepository.save(routine);

        List<Long> exerciseIds = new ArrayList<>();
        for (RoutineExercise re : routineExercises) {
            exerciseIds.add(re.getExercise().getId());
        }

        RoutineResponseDTO response = new RoutineResponseDTO(
                routine.getId(),
                routine.getName(),
                routine.getMember().getId(),
                routine.getMember().getName(),
                exerciseIds
        );
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