package com.interviewprep.session.repository;

import com.interviewprep.session.entity.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {
    Page<Session> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    List<Session> findByUserIdAndIsCompletedTrue(UUID userId);
    boolean existsByUserIdAndCompanyTagIsNotNullAndIsCompletedTrue(UUID userId);
}
