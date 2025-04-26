package com.example.Backend.controller;

import com.example.Backend.dto.SessionRequestDTO;
import com.example.Backend.model.*;
import com.example.Backend.repository.ExerciseLogRepository;
import com.example.Backend.repository.MemberRepository;
import com.example.Backend.repository.RoutineRepository;
import com.example.Backend.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private ExerciseLogRepository exerciseLogRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @PostMapping("/sessions")
    public ResponseEntity<Void> logSession(@RequestBody SessionRequestDTO request) {

        Long memberId = request.getMemberId();
        Long routineId = request.getRoutineId();

        // Validate member and routine
        Optional<Member> memberOpt = memberRepository.findById(memberId);
        Optional<Routine> routineOpt = routineRepository.findById(routineId);
        if (memberOpt.isEmpty() || routineOpt.isEmpty()) {
            return ResponseEntity.status(400).build();
        }

        // Get max sessionCounter
        Long maxSessionCounter = exerciseLogRepository
                .findMaxSessionCounterByMemberIdAndRoutineId(memberId, routineId)
                .orElse(0L);
        Long newSessionCounter = maxSessionCounter + 1;

        // Save logs with new sessionCounter
        for (SessionRequestDTO.ExerciseLogDTO logDTO : request.getExerciseLogs()) {
            Optional<Exercise> exerciseOpt = exerciseRepository.findById(logDTO.getExerciseId());
            if (exerciseOpt.isEmpty()) {
                return ResponseEntity.status(400).build();
            }

            ExerciseLog log = new ExerciseLog();
            log.setMember(memberOpt.get());
            log.setRoutine(routineOpt.get());
            log.setExercise(exerciseOpt.get());
            log.setWeight(logDTO.getWeight());
            log.setCompleted(logDTO.isCompleted());
            log.setSessionCounter(newSessionCounter);

            exerciseLogRepository.save(log);
        }

        return ResponseEntity.ok().build();
    }

}