package com.interviewprep.session.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;
@Data public class SubmitAnswerRequest {
    @NotNull private UUID questionId;
    @NotBlank private String answer;
    private int timeSpentSeconds;
}