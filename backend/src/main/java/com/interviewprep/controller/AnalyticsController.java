package com.interviewprep.controller;

import com.interviewprep.entity.Session;
import com.interviewprep.repository.SessionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final SessionRepository sessionRepository;

    public AnalyticsController(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserAnalytics(Authentication authentication) {
        // Mocked aggregation for now. In production, this would aggregate by UUID
        String userId = authentication.getName(); 
        
        List<Session> userSessions = sessionRepository.findAll(); // Should be findByUserId
        
        long totalSessions = userSessions.size();
        double avgScore = userSessions.stream()
                .mapToDouble(Session::getOverallScore)
                .average().orElse(0.0);

        return ResponseEntity.ok(Map.of(
            "totalSessions", totalSessions,
            "averageScore", avgScore,
            "sessions", userSessions
        ));
    }
}
