package com.interviewprep.roleplay.controller;

import com.interviewprep.roleplay.dto.RoleplayMessageRequest;
import com.interviewprep.roleplay.dto.RoleplayMessageResponse;
import com.interviewprep.roleplay.dto.StartRoleplayRequest;
import com.interviewprep.roleplay.entity.RoleplaySession;
import com.interviewprep.roleplay.service.RoleplayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/roleplay")
@RequiredArgsConstructor
public class RoleplayController {

    private final RoleplayService roleplayService;

    /**
     * Step 1: Frontend calls this via HTTP POST to create the session in DB.
     * Returns sessionId which the frontend then uses for the STOMP WebSocket connection.
     * Without this, WebSocket messages arrive for a non-existent session → 500.
     */
    @PostMapping("/start")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> startSession(
            @Valid @RequestBody StartRoleplayRequest request,
            Authentication authentication) {

        UUID sessionId = roleplayService.startSession(request, authentication.getName());
        log.info("Roleplay session started via HTTP: sessionId={}, user={}", sessionId, authentication.getName());

        return ResponseEntity.ok(Map.of(
            "success", true,
            "sessionId", sessionId.toString(),
            "message", "Session created. Connect STOMP WebSocket using this sessionId."
        ));
    }

    /**
     * Step 3: Frontend calls this when the user clicks "End Interview".
     * Records completion time and marks session complete for analytics.
     */
    @PostMapping("/{sessionId}/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> completeSession(
            @PathVariable UUID sessionId,
            Authentication authentication) {

        RoleplaySession completed = roleplayService.completeSession(sessionId, authentication.getName());

        return ResponseEntity.ok(Map.of(
            "success", true,
            "sessionId", completed.getId().toString(),
            "timeSpentSeconds", completed.getTimeSpentSeconds() != null ? completed.getTimeSpentSeconds() : 0,
            "isCompleted", true
        ));
    }

    /**
     * Fetches results for the results page.
     * Returns real score data from DB instead of Math.random() on the frontend.
     */
    @GetMapping("/{sessionId}/results")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getResults(
            @PathVariable UUID sessionId,
            Authentication authentication) {

        // Delegate to service for ownership check + data fetch
        RoleplaySession session = roleplayService.getSessionResults(sessionId, authentication.getName());

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("sessionId", session.getId().toString());
        response.put("overallScore", session.getOverallScore() != null ? session.getOverallScore() : 0);
        response.put("communicationScore", session.getCommunicationScore() != null ? session.getCommunicationScore() : 0);
        response.put("technicalDepthScore", session.getTechnicalDepthScore() != null ? session.getTechnicalDepthScore() : 0);
        response.put("confidenceScore", session.getConfidenceScore() != null ? session.getConfidenceScore() : 0);
        response.put("strengths", session.getStrengths() != null ? session.getStrengths() : java.util.List.of());
        response.put("improvements", session.getImprovements() != null ? session.getImprovements() : java.util.List.of());
        response.put("actionPlan", session.getActionPlan() != null ? session.getActionPlan() : "");
        response.put("fillerWordCount", session.getFillerWordCount() != null ? session.getFillerWordCount() : 0);
        response.put("timeSpentSeconds", session.getTimeSpentSeconds() != null ? session.getTimeSpentSeconds() : 0);
        response.put("conversationHistory", session.getConversationHistory() != null ? session.getConversationHistory() : java.util.List.of());

        return ResponseEntity.ok(response);
    }
}
