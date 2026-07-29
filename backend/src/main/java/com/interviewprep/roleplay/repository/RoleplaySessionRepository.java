package com.interviewprep.roleplay.repository;

import com.interviewprep.roleplay.entity.RoleplaySession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RoleplaySessionRepository extends JpaRepository<RoleplaySession, UUID> {
    List<RoleplaySession> findByUserId(UUID userId);
    int countByUserIdAndIsCompletedTrue(UUID userId);
}
