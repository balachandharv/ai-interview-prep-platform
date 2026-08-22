package com.interviewprep.session.entity;

import com.interviewprep.question.entity.Question;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "session_questions")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class SessionQuestion {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "user_answer", columnDefinition = "TEXT")
    private String userAnswer;

    private BigDecimal score;

    @Column(name = "correctness_score")
    private BigDecimal correctnessScore;

    @Column(name = "completeness_score")
    private BigDecimal completenessScore;

    @Column(name = "clarity_score")
    private BigDecimal clarityScore;

    @Column(name = "structure_score")
    private BigDecimal structureScore;

    @Column(name = "similarity_score")
    private BigDecimal similarityScore;

    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds;

    @Column(name = "filler_word_count")
    private Integer fillerWordCount;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "points_covered", columnDefinition = "json")
    private List<String> pointsCovered;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "points_missed", columnDefinition = "json")
    private List<String> pointsMissed;

    @Column(name = "sample_answer", columnDefinition = "TEXT")
    private String sampleAnswer;

    @Column(name = "pro_tip", columnDefinition = "TEXT")
    private String proTip;

    @Column(name = "is_flagged_short")
    private Boolean isFlaggedShort;

    @Column(name = "is_flagged_fast")
    private Boolean isFlaggedFast;

    @Column(name = "question_order")
    private Integer questionOrder;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SessionQuestion)) return false;
        return id != null && id.equals(((SessionQuestion) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}