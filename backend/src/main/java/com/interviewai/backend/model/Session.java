package com.interviewai.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String mode; // 'Mock' or 'Roleplay'

    private String company;
    
    private String difficulty;

    private Integer score; // Overall score 0-10

    @Column(columnDefinition = "TEXT")
    private String feedback; // General feedback for the session

    private String status; // 'In Progress', 'Completed'

    @CreationTimestamp
    private LocalDateTime startedAt;

    private LocalDateTime completedAt;
}
