package com.example.Backend.service;

import com.example.Backend.dto.*;
import com.example.Backend.model.Exercise;
import com.example.Backend.model.Member;
import com.example.Backend.model.Routine;
import com.example.Backend.model.RoutineExercise;
import com.example.Backend.repository.ExerciseRepository;
import com.example.Backend.repository.MemberRepository;
import com.example.Backend.repository.RoutineExerciseRepository;
import com.example.Backend.repository.RoutineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final MemberRepository memberRepository;
    private final ExerciseRepository exerciseRepository;
    private final RoutineExerciseRepository routineExerciseRepository;

    public RoutineService(RoutineRepository routineRepository, MemberRepository memberRepository,
                          ExerciseRepository exerciseRepository, RoutineExerciseRepository routineExerciseRepository) {
        this.routineRepository = routineRepository;
        this.memberRepository = memberRepository;
        this.exerciseRepository = exerciseRepository;
        this.routineExerciseRepository = routineExerciseRepository;
    }

    @Transactional
    public RoutineResponseDTO createRoutine(RoutineRequestDTO request) {
        Optional<Member> memberOpt = memberRepository.findById(request.getMemberId());
        if (memberOpt.isEmpty()) {
            return null;
        }
        Member member = memberOpt.get();

        Routine routine = new Routine();
        routine.setName(request.getName());
        routine.setMember(member);
        routine.setRoutineExercises(new ArrayList<>());
        routine = routineRepository.save(routine);

        List<RoutineExercise> routineExercises = routine.getRoutineExercises();
        for (RoutineRequestDTO.ExerciseAssignment assignment : request.getExerciseAssignments()) {
            Optional<Exercise> exerciseOpt = exerciseRepository.findById(assignment.getExerciseId());
            if (exerciseOpt.isEmpty() || assignment.getSets() <= 0 || assignment.getReps() <= 0) {
                return null;
            }
            Exercise exercise = exerciseOpt.get();
            RoutineExercise routineExercise = new RoutineExercise(routine, exercise, assignment.getSets(), assignment.getReps());
            routineExercises.add(routineExercise);
        }

        routineRepository.save(routine);

        List<Long> exerciseIds = new ArrayList<>();
        for (RoutineExercise re : routineExercises) {
            exerciseIds.add(re.getExercise().getId());
        }

        return new RoutineResponseDTO(
                routine.getId(),
                routine.getName(),
                member.getId(),
                member.getFirstName()+" "+member.getLastName(),
                exerciseIds
        );
    }

    public List<RoutineSummaryDTO> getRoutineSummariesByMemberId(Long memberId) {
        List<Routine> routines = routineRepository.findByMemberId(memberId);
        if (routines.isEmpty()) {
            return null;
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
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        if (routineOpt.isEmpty()) {
            return null;
        }
        Routine routine = routineOpt.get();

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
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        if (routineOpt.isEmpty()) {
            return null;
        }
        Routine routine = routineOpt.get();
        routine.setName(name);
        Routine updatedRoutine = routineRepository.save(routine);
        return new RoutineRenameDTO(updatedRoutine.getId(), updatedRoutine.getName());
    }

    @Transactional
    public RoutineResponseDTO addExerciseToRoutine(Long routineId, ExerciseAssignmentDTO assignment) {
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        Optional<Exercise> exerciseOpt = exerciseRepository.findById(assignment.getExerciseId());
        if (routineOpt.isEmpty() || exerciseOpt.isEmpty() || assignment.getSets() <= 0 || assignment.getReps() <= 0) {
            return null;
        }
        Routine routine = routineOpt.get();
        Exercise exercise = exerciseOpt.get();

        List<RoutineExercise> routineExercises = routine.getRoutineExercises();
        for (RoutineExercise re : routineExercises) {
            if (re.getExercise().getId().equals(assignment.getExerciseId())) {
                return null;
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

        return new RoutineResponseDTO(
                routine.getId(),
                routine.getName(),
                routine.getMember().getId(),
                routine.getMember().getFirstName()+" "+routine.getMember().getLastName(),
                exerciseIds
        );
    }

    @Transactional
    public RoutineResponseDTO removeExerciseFromRoutine(Long routineId, Long exerciseId) {
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        if (routineOpt.isEmpty()) {
            return null;
        }
        Routine routine = routineOpt.get();

        List<RoutineExercise> routineExercises = routine.getRoutineExercises();
        RoutineExercise toRemove = null;
        for (RoutineExercise re : routineExercises) {
            if (re.getExercise().getId().equals(exerciseId)) {
                toRemove = re;
                break;
            }
        }

        if (toRemove == null) {
            return null;
        }

        routineExercises.remove(toRemove);
        routineExerciseRepository.delete(toRemove);
        routineRepository.save(routine);

        List<Long> exerciseIds = new ArrayList<>();
        for (RoutineExercise re : routineExercises) {
            exerciseIds.add(re.getExercise().getId());
        }

        return new RoutineResponseDTO(
                routine.getId(),
                routine.getName(),
                routine.getMember().getId(),
                routine.getMember().getFirstName()+" "+routine.getMember().getLastName(),
                exerciseIds
        );
    }

    @Transactional
    public boolean deleteRoutine(Long routineId) {
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        if (routineOpt.isEmpty()) {
            return false;
        }
        routineRepository.deleteById(routineId);
        return true;
    }
}