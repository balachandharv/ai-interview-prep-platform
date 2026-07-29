package com.interviewprep.peer.service;

import com.interviewprep.peer.dto.PeerMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PeerSessionService {
    public void processMessage(UUID sessionId, PeerMessageDto message, String username) {
        // Implementation for handling and storing peer messages
    }
}
