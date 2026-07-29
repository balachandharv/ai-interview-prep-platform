package com.interviewprep.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UserProfile {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "readiness_score")
    private Integer readinessScore;

    @Column(name = "dsa_score")
    private BigDecimal dsaScore;

    @Column(name = "system_design_score")
    private BigDecimal systemDesignScore;

    @Column(name = "behavioral_score")
    private BigDecimal behavioralScore;

    @Column(name = "communication_score")
    private BigDecimal communicationScore;

    @Column(name = "domain_knowledge_score")
    private BigDecimal domainKnowledgeScore;

    @Column(name = "hr_score")
    private BigDecimal hrScore;

    @Column(name = "total_sessions")
    private Integer totalSessions;

    @Column(name = "total_questions_answered")
    private Integer totalQuestionsAnswered;

    @Column(name = "average_score")
    private BigDecimal averageScore;

    @Column(name = "streak_count")
    private Integer streakCount;

    @Column(name = "best_streak")
    private Integer bestStreak;

    @Column(name = "streak_last_date")
    private LocalDate streakLastDate;

    @Column(name = "streak_freeze_available")
    private Boolean streakFreezeAvailable;

    @Column(name = "streak_freeze_used_at")
    private LocalDate streakFreezeUsedAt;

    @Column(name = "badges_earned", columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private java.util.List<String> badgesEarned;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
