package com.interviewprep.roleplay.service;

import com.interviewprep.evaluation.service.OpenAiService;
import com.interviewprep.roleplay.dto.RoleplayMessageRequest;
import com.interviewprep.roleplay.dto.RoleplayMessageResponse;
import com.interviewprep.roleplay.entity.RoleplaySession;
import com.interviewprep.roleplay.repository.RoleplaySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.ArrayList;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class RoleplayService {

    private final RoleplaySessionRepository roleplaySessionRepository;
    private final OpenAiService openAiService;

    @Transactional
    public RoleplayMessageResponse processMessage(UUID sessionId, RoleplayMessageRequest request, String username) {
        RoleplaySession session = roleplaySessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
            
        List<Map<String, String>> history = new ArrayList<>(session.getConversationHistory() != null ? session.getConversationHistory() : new ArrayList<>());
        
        // Add user message
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", request.getMessage());
        history.add(userMsg);
        
        // Get AI Response
        String aiResponseText = openAiService.conductRoleplayTurn("You are an interviewer. Respond to the candidate.", history);
        
        // Add AI message
        Map<String, String> aiMsg = new HashMap<>();
        aiMsg.put("role", "assistant");
        aiMsg.put("content", aiResponseText);
        history.add(aiMsg);
        
        session.setConversationHistory(history);
        roleplaySessionRepository.save(session);
        
        return RoleplayMessageResponse.builder()
            .message(aiResponseText)
            .isTyping(false)
            .build();
    }
}
