package com.interviewprep.auth.service;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    // Simple in-memory blacklist for JWT tokens.
    // In a fully scaled production environment, this should be backed by Redis with a TTL.
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();

    public void blacklistToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (token != null) {
            blacklistedTokens.add(token);
        }
    }

    public boolean isBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
}
