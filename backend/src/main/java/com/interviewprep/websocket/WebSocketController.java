package com.interviewprep.websocket;

import com.interviewprep.peer.dto.PeerMessageDto;
import com.interviewprep.peer.service.PeerSessionService;
import com.interviewprep.roleplay.dto.RoleplayMessageRequest;
import com.interviewprep.roleplay.dto.RoleplayMessageResponse;
import com.interviewprep.roleplay.service.RoleplayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final RoleplayService roleplayService;
    private final PeerSessionService peerSessionService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/roleplay/{sessionId}/message")
    public void handleRoleplayMessage(
            @DestinationVariable UUID sessionId,
            @Payload RoleplayMessageRequest request,
            Principal principal) {

        log.info("Roleplay message for session: {}", sessionId);

        // Send typing indicator immediately
        messagingTemplate.convertAndSend(
            "/topic/roleplay/" + sessionId + "/typing",
            Map.of("isTyping", true)
        );

        // Process message and get AI response
        RoleplayMessageResponse response = roleplayService
            .processMessage(sessionId, request, principal.getName());

        // Send typing indicator off
        messagingTemplate.convertAndSend(
            "/topic/roleplay/" + sessionId + "/typing",
            Map.of("isTyping", false)
        );

        // Send AI response
        messagingTemplate.convertAndSend(
            "/topic/roleplay/" + sessionId,
            response
        );
    }

    @MessageMapping("/peer/{sessionId}/message")
    public void handlePeerMessage(
            @DestinationVariable UUID sessionId,
            @Payload PeerMessageDto message,
            Principal principal) {

        peerSessionService.processMessage(sessionId, message, principal.getName());
        messagingTemplate.convertAndSend(
            "/topic/peer/" + sessionId, message);
    }
}
