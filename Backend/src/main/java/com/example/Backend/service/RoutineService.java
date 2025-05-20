package com.example.Backend.service;

import com.example.Backend.dto.*;
import com.example.Backend.model.*;
import com.example.Backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// Custom exception class for meaningful error messages
class RoutineServiceException extends RuntimeException {
    public RoutineServiceException(String message) {
        super(message);
    }
}

@Service
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final MemberRepository memberRepository;
    private final ExerciseRepository exerciseRepository;
    private final RoutineExerciseRepository routineExerciseRepository;

    // Constructor to inject repositories
    public RoutineService(RoutineRepository routineRepository, MemberRepository memberRepository,
                          ExerciseRepository exerciseRepository, RoutineExerciseRepository routineExerciseRepository) {
        this.routineRepository = routineRepository;
        this.memberRepository = memberRepository;
        this.exerciseRepository = exerciseRepository;
        this.routineExerciseRepository = routineExerciseRepository;
    }

    @Transactional
    public RoutineResponseDTO createRoutine(RoutineRequestDTO request) {
        // Check if member exists
        Optional<Member> memberOpt = memberRepository.findById(request.getMemberId());
        if (memberOpt.isEmpty()) {
            throw new RoutineServiceException("Member not found");
        }
        Member member = memberOpt.get();

        // Set up new routine
        Routine routine = new Routine();
        routine.setName(request.getName());
        routine.setMember(member);
        routine.setRoutineExercises(new ArrayList<>());
        routine = routineRepository.save(routine);

        // Add exercises to routine
        List<RoutineExercise> routineExercises = routine.getRoutineExercises();
        for (RoutineRequestDTO.ExerciseAssignment assignment : request.getExerciseAssignments()) {
            Optional<Exercise> exerciseOpt = exerciseRepository.findById(assignment.getExerciseId());
            if (exerciseOpt.isEmpty()) {
                throw new RoutineServiceException("Exercise not found");
            }
            if (assignment.getSets() <= 0) {
                throw new RoutineServiceException("Invalid number of sets");
            }
            if (assignment.getReps() <= 0) {
                throw new RoutineServiceException("Invalid number of reps");
            }
            Exercise exercise = exerciseOpt.get();
            RoutineExercise routineExercise = new RoutineExercise(routine, exercise, assignment.getSets(), assignment.getReps());
            routineExercises.add(routineExercise);
        }

        routineRepository.save(routine);

        // Build response with exercise IDs
        List<Long> exerciseIds = new ArrayList<>();
        for (RoutineExercise re : routineExercises) {
            exerciseIds.add(re.getExercise().getId());
        }

        return new RoutineResponseDTO(
                routine.getId(),
                routine.getName(),
                member.getId(),
                member.getName(),
                exerciseIds
        );
    }

    public List<RoutineSummaryDTO> getRoutineSummariesByMemberId(Long memberId) {
        // Fetch all routines for member
        List<Routine> routines = routineRepository.findByMemberId(memberId);
        if (routines.isEmpty()) {
            throw new RoutineServiceException("No routines found for member");
        }
        List<RoutineSummaryDTO> responseList = new ArrayList<>();
        for (Routine routine : routines) {
            RoutineSummaryDTO summary = new RoutineSummaryDTO();
            summary.setId(routine.getId());
            summary.setName(routine.getName());
            responseList.add(summary);
        }
        return responseList;
    }

    public RoutineDetailsResponseDTO getRoutineDetails(Long routineId) {
        // Look up routine by ID
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        if (routineOpt.isEmpty()) {
            throw new RoutineServiceException("Routine not found");
        }
        Routine routine = routineOpt.get();

        // Get exercises for routine
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

        return new RoutineDetailsResponseDTO(
                routine.getId(),
                routine.getName(),
                exerciseDetails
        );
    }

    public RoutineRenameDTO updateRoutineName(Long routineId, Map<String, String> request) {
        String name = request.get("name");
        // Update routine name
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        if (routineOpt.isEmpty()) {
            throw new RoutineServiceException("Routine not found");
        }
        Routine routine = routineOpt.get();
        routine.setName(name);
        Routine updatedRoutine = routineRepository.save(routine);
        return new RoutineRenameDTO(updatedRoutine.getId(), updatedRoutine.getName());
    }

    @Transactional
    public RoutineResponseDTO addExerciseToRoutine(Long routineId, ExerciseAssignmentDTO assignment) {
        // Validate routine and exercise
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        Optional<Exercise> exerciseOpt = exerciseRepository.findById(assignment.getExerciseId());
        if (routineOpt.isEmpty()) {
            throw new RoutineServiceException("Routine not found");
        }
        if (exerciseOpt.isEmpty()) {
            throw new RoutineServiceException("Exercise not found");
        }
        if (assignment.getSets() <= 0) {
            throw new RoutineServiceException("Invalid number of sets");
        }
        if (assignment.getReps() <= 0) {
            throw new RoutineServiceException("Invalid number of reps");
        }
        Routine routine = routineOpt.get();
        Exercise exercise = exerciseOpt.get();

        // Check for duplicate exercise
        List<RoutineExercise> routineExercises = routine.getRoutineExercises();
        for (RoutineExercise re : routineExercises) {
            if (re.getExercise().getId().equals(assignment.getExerciseId())) {
                throw new RoutineServiceException("Exercise already in routine");
            }
        }

        // Add new exercise to routine
        RoutineExercise routineExercise = new RoutineExercise(routine, exercise, assignment.getSets(), assignment.getReps());
        routineExerciseRepository.save(routineExercise);

        if (routineExercises == null) {
            routine.setRoutineExercises(new ArrayList<>());
            routineExercises = routine.getRoutineExercises();
        }
        routineExercises.add(routineExercise);
        routineRepository.save(routine);

        // Build response
        List<Long> exerciseIds = new ArrayList<>();
        for (RoutineExercise re : routineExercises) {
            exerciseIds.add(re.getExercise().getId());
        }

        return new RoutineResponseDTO(
                routine.getId(),
                routine.getName(),
                routine.getMember().getId(),
                routine.getMember().getName(),
                exerciseIds
        );
    }

    @Transactional
    public RoutineResponseDTO removeExerciseFromRoutine(Long routineId, Long exerciseId) {
        // Find routine
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        if (routineOpt.isEmpty()) {
            throw new RoutineServiceException("Routine not found");
        }
        Routine routine = routineOpt.get();

        // Look for exercise to remove
        List<RoutineExercise> routineExercises = routine.getRoutineExercises();
        RoutineExercise toRemove = null;
        for (RoutineExercise re : routineExercises) {
            if (re.getExercise().getId().equals(exerciseId)) {
                toRemove = re;
                break;
            }
        }

        if (toRemove == null) {
            throw new RoutineServiceException("Exercise not found in routine");
        }

        // Remove exercise
        routineExercises.remove(toRemove);
        routineExerciseRepository.delete(toRemove);
        routineRepository.save(routine);

        // Build response
        List<Long> exerciseIds = new ArrayList<>();
        for (RoutineExercise re : routineExercises) {
            exerciseIds.add(re.getExercise().getId());
        }

        return new RoutineResponseDTO(
                routine.getId(),
                routine.getName(),
                routine.getMember().getId(),
                routine.getMember().getName(),
                exerciseIds
        );
    }

    @Transactional
    public boolean deleteRoutine(Long routineId) {
        // Delete routine if it exists
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        if (routineOpt.isEmpty()) {
            throw new RoutineServiceException("Routine not found");
        }
        routineRepository.deleteById(routineId);
        return true;
    }
}