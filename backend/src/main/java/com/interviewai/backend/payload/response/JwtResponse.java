package com.interviewai.backend.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private boolean onboardingComplete;

    public JwtResponse(String token, String refreshToken, String type, Long id, String name, String email, boolean onboardingComplete) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.type = type != null ? type : "Bearer";
        this.id = id;
        this.name = name;
        this.email = email;
        this.onboardingComplete = onboardingComplete;
    }
}
