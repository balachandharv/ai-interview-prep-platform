package com.interviewprep.session.dto;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;
@Data @Builder public class SessionResultsDto {
    private UUID sessionId;
    private double overallScore;
}