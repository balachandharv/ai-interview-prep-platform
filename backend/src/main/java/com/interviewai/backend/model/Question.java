package com.interviewai.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String category; // Technical, Behavioral, HR, etc.
    
    private String difficulty; // Easy, Medium, Hard
    
    private String company; // If specific to a company

    @Column(columnDefinition = "TEXT")
    private String sampleAnswer;
    
    @Column(columnDefinition = "TEXT")
    private String evaluationCriteria; // What AI should look for
}
