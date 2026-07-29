package com.interviewprep.achievement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "achievements")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Achievement {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "badge_name", nullable = false)
    private String badgeName;

    @Column(name = "badge_description")
    private String badgeDescription;

    @Column(name = "badge_icon")
    private String badgeIcon;

    @CreatedDate
    @Column(name = "earned_at", updatable = false)
    private LocalDateTime earnedAt;
}
