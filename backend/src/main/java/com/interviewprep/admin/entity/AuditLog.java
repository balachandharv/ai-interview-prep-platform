package com.interviewprep.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "admin_audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID adminId;

    @Column(nullable = false)
    private String action;

    @Column(name = "target_id")
    private UUID targetId;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(nullable = false)
    private String ipAddress;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;
}
