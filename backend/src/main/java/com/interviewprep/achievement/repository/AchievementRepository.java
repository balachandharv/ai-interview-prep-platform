package com.interviewprep.achievement.repository;

import com.interviewprep.achievement.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AchievementRepository extends JpaRepository<Achievement, UUID> {
    List<Achievement> findByUserId(UUID userId);
    boolean existsByUserIdAndBadgeName(UUID userId, String badgeName);
}
