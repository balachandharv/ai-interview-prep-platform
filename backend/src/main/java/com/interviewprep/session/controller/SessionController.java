package com.interviewprep.session.controller;

import com.interviewprep.common.response.ApiResponse;
import com.interviewprep.common.response.PagedResponse;
import com.interviewprep.session.dto.SessionDto;
import com.interviewprep.session.dto.SessionResultsDto;
import com.interviewprep.session.dto.StartSessionRequest;
import com.interviewprep.session.dto.SubmitAnswerRequest;
import com.interviewprep.session.dto.SubmitAnswerResponse;
import com.interviewprep.session.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<SessionDto>> startSession(
            @Valid @RequestBody StartSessionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        SessionDto session = sessionService.startSession(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Session started", session));
    }

    @PostMapping("/{sessionId}/submit-answer")
    public ResponseEntity<ApiResponse<SubmitAnswerResponse>> submitAnswer(
            @PathVariable UUID sessionId,
            @Valid @RequestBody SubmitAnswerRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        SubmitAnswerResponse response = sessionService
            .submitAnswer(sessionId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Answer evaluated", response));
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<ApiResponse<SessionResultsDto>> completeSession(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        SessionResultsDto results = sessionService
            .completeSession(sessionId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Session completed", results));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<PagedResponse<SessionDto>>> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        PagedResponse<SessionDto> history = sessionService
            .getSessionHistory(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Session history", history));
    }

    @GetMapping("/{sessionId}/results")
    public ResponseEntity<ApiResponse<SessionResultsDto>> getResults(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        SessionResultsDto results = sessionService
            .getSessionResults(sessionId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Session results", results));
    }
}
