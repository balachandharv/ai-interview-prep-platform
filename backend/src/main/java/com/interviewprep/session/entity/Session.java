package com.interviewprep.session.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sessions")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Session {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String mode;

    @Column(name = "target_role")
    private String targetRole;

    private String difficulty;
    private String category;

    @Column(name = "overall_score")
    private BigDecimal overallScore;

    @Column(name = "dsa_score")
    private BigDecimal dsaScore;

    @Column(name = "behavioral_score")
    private BigDecimal behavioralScore;

    @Column(name = "communication_score")
    private BigDecimal communicationScore;

    @Column(name = "technical_score")
    private BigDecimal technicalScore;

    @Column(name = "question_count")
    private Integer questionCount;

    @Column(name = "completed_count")
    private Integer completedCount;

    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds;

    @Column(name = "is_completed")
    private Boolean isCompleted;

    @Column(name = "company_tag")
    private String companyTag;

    @Column(name = "round_label")
    private String roundLabel;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
