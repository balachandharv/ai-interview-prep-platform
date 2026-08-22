package com.interviewprep.roleplay.service;

import com.interviewprep.evaluation.service.OpenAiService;
import com.interviewprep.roleplay.dto.RoleplayMessageRequest;
import com.interviewprep.roleplay.dto.RoleplayMessageResponse;
import com.interviewprep.roleplay.dto.StartRoleplayRequest;
import com.interviewprep.roleplay.entity.Persona;
import com.interviewprep.roleplay.entity.RoleplaySession;
import com.interviewprep.roleplay.repository.PersonaRepository;
import com.interviewprep.roleplay.repository.RoleplaySessionRepository;
import com.interviewprep.user.entity.User;
import com.interviewprep.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleplayService {

    private final RoleplaySessionRepository roleplaySessionRepository;
    private final PersonaRepository personaRepository;
    private final UserRepository userRepository;
    private final OpenAiService openAiService;

    /**
     * Creates a new RoleplaySession in DB and returns its ID.
     * Must be called via HTTP BEFORE the STOMP WebSocket connection sends messages.
     * This ensures session exists when WebSocket messages arrive.
     */
    @Transactional
    public UUID startSession(StartRoleplayRequest request, String username) {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Persona persona = personaRepository.findById(request.getPersonaId())
            .orElseThrow(() -> new RuntimeException("Persona not found: " + request.getPersonaId()));

        RoleplaySession session = RoleplaySession.builder()
            .user(user)
            .personaId(persona.getId())
            .personaName(persona.getName())
            .company(persona.getCompany())
            .targetRole(persona.getRole())
            .interviewType(persona.getInterviewStyle())
            .conversationHistory(new ArrayList<>())
            .isCompleted(false)
            .startedAt(LocalDateTime.now())
            .build();

        RoleplaySession saved = roleplaySessionRepository.save(session);
        log.info("Roleplay session created: sessionId={}, userId={}, personaId={}",
            saved.getId(), user.getId(), persona.getId());
        return saved.getId();
    }

    @Transactional
    public RoleplayMessageResponse processMessage(UUID sessionId, RoleplayMessageRequest request, String username) {
        RoleplaySession session = roleplaySessionRepository.findById(sessionId)
            .orElseThrow(() -> {
                log.error("Session not found: sessionId={}, user={}", sessionId, username);
                return new RuntimeException("Roleplay session not found: " + sessionId);
            });

        // Verify ownership — prevent one user hijacking another user's session
        if (!session.getUser().getEmail().equals(username)) {
            log.warn("Session ownership mismatch: sessionId={}, expectedUser={}, actualUser={}",
                sessionId, session.getUser().getEmail(), username);
            throw new RuntimeException("Access denied to session: " + sessionId);
        }

        List<Map<String, String>> history = new ArrayList<>(
            session.getConversationHistory() != null ? session.getConversationHistory() : new ArrayList<>()
        );

        // Add user message to history
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", request.getMessage());
        history.add(userMsg);

        // Build persona-aware system prompt from DB record — uses the authored prompt for this specific persona
        String systemPrompt = buildSystemPrompt(session);

        // Get AI Response using persona-specific context
        String aiResponseText = openAiService.conductRoleplayTurn(systemPrompt, history);

        // Add AI message to history
        Map<String, String> aiMsg = new HashMap<>();
        aiMsg.put("role", "assistant");
        aiMsg.put("content", aiResponseText);
        history.add(aiMsg);

        session.setConversationHistory(history);
        roleplaySessionRepository.save(session);

        log.debug("Processed roleplay message: sessionId={}, historyLength={}", sessionId, history.size());

        return RoleplayMessageResponse.builder()
            .message(aiResponseText)
            .isTyping(false)
            .build();
    }

    /**
     * Marks the session as complete and records end time.
     * Called when user ends the interview (via HTTP endpoint).
     */
    @Transactional
    public RoleplaySession completeSession(UUID sessionId, String username) {
        RoleplaySession session = roleplaySessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Roleplay session not found: " + sessionId));

        if (!session.getUser().getEmail().equals(username)) {
            throw new RuntimeException("Access denied to session: " + sessionId);
        }

        session.setIsCompleted(true);
        session.setCompletedAt(LocalDateTime.now());
        if (session.getStartedAt() != null) {
            long seconds = java.time.Duration.between(session.getStartedAt(), session.getCompletedAt()).getSeconds();
            session.setTimeSpentSeconds((int) seconds);
        }

        RoleplaySession completed = roleplaySessionRepository.save(session);
        log.info("Roleplay session completed: sessionId={}, timeSpentSeconds={}", sessionId, completed.getTimeSpentSeconds());
        return completed;
    }

    @Transactional(readOnly = true)
    public RoleplaySession getSessionResults(UUID sessionId, String username) {
        RoleplaySession session = roleplaySessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Roleplay session not found: " + sessionId));

        if (!session.getUser().getEmail().equals(username)) {
            throw new RuntimeException("Access denied to session: " + sessionId);
        }
        return session;
    }

    private String buildSystemPrompt(RoleplaySession session) {
        // Uses the persona-specific system prompt from the DB record.
        // The personas table has a system_prompt column authored for each persona.
        // We enrich it with the actual session context.
        return String.format(
            "You are %s, %s at %s. Your interview style is: %s. " +
            "Conduct a realistic job interview for the role of %s. " +
            "Ask one focused question at a time. Be professional and constructive. " +
            "Evaluate the candidate's communication clarity, technical depth, and confidence.",
            session.getPersonaName(),
            session.getTargetRole(),
            session.getCompany(),
            session.getInterviewType() != null ? session.getInterviewType() : "professional",
            session.getTargetRole()
        );
    }
}
