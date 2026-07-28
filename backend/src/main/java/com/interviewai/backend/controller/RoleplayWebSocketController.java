package com.interviewai.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class RoleplayWebSocketController {

    // Simulates receiving a message from user and replying as AI
    @MessageMapping("/roleplay.sendMessage")
    @SendTo("/topic/roleplay")
    public Map<String, String> handleChatMessage(@Payload Map<String, String> message) throws InterruptedException {
        String userText = message.get("text");
        String sessionId = message.get("sessionId");

        // Artificial delay to simulate AI thinking
        Thread.sleep(1500);
        
        // Mock AI Response Logic (Would connect to OpenAI/HuggingFace here)
        String aiResponse = "That's an interesting point about " + userText + ". Can you elaborate more on how you'd handle edge cases?";

        return Map.of(
            "sessionId", sessionId,
            "text", aiResponse,
            "role", "ai"
        );
    }
}
