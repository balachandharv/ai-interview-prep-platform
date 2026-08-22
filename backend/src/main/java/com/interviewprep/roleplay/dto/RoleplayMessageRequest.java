package com.interviewprep.roleplay.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data public class RoleplayMessageRequest {
    @NotBlank
    private String message;
}