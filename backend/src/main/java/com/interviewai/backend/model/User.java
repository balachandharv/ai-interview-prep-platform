package com.interviewai.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private boolean onboardingComplete;
    
    private String targetRole;
    private String experienceLevel;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_target_companies", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "company")
    private Set<String> targetCompanies = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_weak_areas", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "area")
    private Set<String> weakAreas = new HashSet<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
