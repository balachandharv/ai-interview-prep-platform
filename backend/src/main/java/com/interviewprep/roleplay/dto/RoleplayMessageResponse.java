package com.interviewprep.roleplay.dto;
import lombok.Builder;
import lombok.Data;
@Data @Builder public class RoleplayMessageResponse {
    private String message;
    private boolean isTyping;
}