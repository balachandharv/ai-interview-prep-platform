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
@Table(name = "interview_logs")
public class InterviewLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question; // Can be null for Roleplay dynamic questions

    @Column(columnDefinition = "TEXT")
    private String askedQuestion; // The actual question asked

    @Column(columnDefinition = "TEXT")
    private String userAnswer; // The user's transcribed or typed answer

    private Integer score; // Score for this specific answer

    @Column(columnDefinition = "TEXT")
    private String feedback; // AI feedback on this answer
    
    private String role; // 'system', 'ai', 'user' (for roleplay chat history)

    @CreationTimestamp
    private LocalDateTime timestamp;
}
