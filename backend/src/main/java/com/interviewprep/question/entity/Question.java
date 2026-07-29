package com.interviewprep.question.entity;

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
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "questions")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "model_answer", nullable = false, columnDefinition = "TEXT")
    private String modelAnswer;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "key_points", nullable = false, columnDefinition = "json")
    private List<String> keyPoints;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String difficulty;

    @Column(name = "role_tag")
    private String roleTag;

    @Column(name = "company_tag")
    private String companyTag;

    @Column(name = "is_ai_generated")
    private Boolean isAiGenerated;

    @Column(name = "times_answered")
    private Integer timesAnswered;

    @Column(name = "average_score")
    private BigDecimal averageScore;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
