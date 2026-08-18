package com.interviewprep.session.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder public class SessionDto {
    private UUID id;
    private String mode;
    private String difficulty;
    private String category;
    private Integer questionCount;
    private Integer completedCount;
    private BigDecimal overallScore;
    private Boolean isCompleted;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String date; // for frontend
    private String grade; // for frontend
}