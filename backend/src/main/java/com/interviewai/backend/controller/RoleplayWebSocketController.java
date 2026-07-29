package com.interviewai.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class RoleplayWebSocketController {
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    public RoleplayWebSocketController(org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Simulates receiving a message from user and replying as AI
    @MessageMapping("/roleplay.sendMessage")
    public void handleChatMessage(@Payload Map<String, String> message) {
        String userText = message.get("text");
        String sessionId = message.get("sessionId");

        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                // Artificial delay to simulate AI thinking without blocking the main WebSocket thread pool
                Thread.sleep(1500);
                
                // Mock AI Response Logic
                String aiResponse = "That's an interesting point about " + userText + ". Can you elaborate more on how you'd handle edge cases?";
                
                Map<String, String> response = Map.of(
                    "sessionId", sessionId,
                    "text", aiResponse,
                    "role", "ai"
                );
                
                messagingTemplate.convertAndSend("/topic/roleplay", response);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
    }
}
