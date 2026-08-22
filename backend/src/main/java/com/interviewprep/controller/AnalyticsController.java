package com.interviewprep.controller;

import com.interviewprep.session.entity.Session;
import com.interviewprep.session.repository.SessionRepository;
import com.interviewprep.user.entity.User;
import com.interviewprep.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public AnalyticsController(SessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserAnalytics(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Session> userSessions = sessionRepository.findByUserId(user.getId());

        long totalSessions = userSessions.size();
        double avgScore = userSessions.stream()
                .filter(s -> s.getOverallScore() != null)
                .mapToDouble(s -> s.getOverallScore().doubleValue())
                .average().orElse(0.0);

        // Project to DTO to avoid Hibernate entity serialization issues
        List<Map<String, Object>> sessionDtos = userSessions.stream()
            .map(s -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", String.valueOf(s.getId()));
                map.put("overallScore", s.getOverallScore() != null ? s.getOverallScore() : 0);
                map.put("completedAt", s.getCompletedAt() != null ? s.getCompletedAt().toString() : "");
                return map;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
            "success", true,
            "totalSessions", totalSessions,
            "averageScore", avgScore,
            "sessions", sessionDtos
        ));
    }
}

