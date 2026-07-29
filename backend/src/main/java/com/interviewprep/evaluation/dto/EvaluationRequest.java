package com.interviewprep.evaluation.dto;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;
@Data @Builder public class EvaluationRequest {
    private UUID questionId;
    private String questionText;
    private String modelAnswer;
    private List<String> keyPoints;
    private String userAnswer;
    private int timeSpentSeconds;
    private boolean isVoiceAnswer;
}