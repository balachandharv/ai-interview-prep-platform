package com.interviewprep.roleplay.entity;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.interviewprep.user.entity.User;

@Entity
@Table(name = "roleplay_sessions")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class RoleplaySession {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "persona_id")
    private UUID personaId;

    @Column(name = "persona_name")
    private String personaName;

    private String company;

    @Column(name = "target_role")
    private String targetRole;

    @Column(name = "interview_type")
    private String interviewType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "conversation_history", columnDefinition = "json")
    private List<Map<String, String>> conversationHistory;

    @Column(name = "overall_score")
    private BigDecimal overallScore;

    @Column(name = "communication_score")
    private BigDecimal communicationScore;

    @Column(name = "technical_depth_score")
    private BigDecimal technicalDepthScore;

    @Column(name = "confidence_score")
    private BigDecimal confidenceScore;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> strengths;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> improvements;

    @Column(name = "action_plan", columnDefinition = "TEXT")
    private String actionPlan;

    @Column(name = "filler_word_count")
    private Integer fillerWordCount;

    @Column(name = "round_label")
    private String roundLabel;

    @Column(name = "is_completed")
    private Boolean isCompleted;

    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RoleplaySession)) return false;
        return id != null && id.equals(((RoleplaySession) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}