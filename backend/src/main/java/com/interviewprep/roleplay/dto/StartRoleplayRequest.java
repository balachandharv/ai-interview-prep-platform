package com.interviewprep.roleplay.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data public class StartRoleplayRequest {
    @NotNull
    private UUID personaId;
}