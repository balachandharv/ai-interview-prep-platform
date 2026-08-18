package com.interviewprep.user.service;

import com.interviewprep.common.exception.ResourceNotFoundException;
import com.interviewprep.user.entity.User;
import com.interviewprep.user.entity.UserProfile;
import com.interviewprep.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "userProfile", key = "#email")
    public Map<String, Object> getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Map<String, Object> profileData = new HashMap<>();
        profileData.put("id", user.getId());
        profileData.put("name", user.getName());
        profileData.put("email", user.getEmail());
        profileData.put("targetRole", user.getTargetRole());
        profileData.put("experienceLevel", user.getExperienceLevel());
        profileData.put("targetCompanies", user.getTargetCompanies() != null ? new ArrayList<>(user.getTargetCompanies()) : new ArrayList<>());
        
        return profileData;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "userStats", key = "#email")
    public Map<String, Object> getUserStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserProfile profile = user.getProfile();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("readinessScore", profile != null && profile.getReadinessScore() != null ? profile.getReadinessScore() : 0);
        stats.put("totalSessions", profile != null && profile.getTotalSessions() != null ? profile.getTotalSessions() : 0);
        stats.put("questionsAnswered", profile != null && profile.getTotalQuestionsAnswered() != null ? profile.getTotalQuestionsAnswered() : 0);
        stats.put("averageScore", profile != null && profile.getAverageScore() != null ? profile.getAverageScore() : 0.0);
        
        Map<String, Object> streak = new HashMap<>();
        streak.put("current", profile != null && profile.getStreakCount() != null ? profile.getStreakCount() : 0);
        streak.put("best", profile != null && profile.getBestStreak() != null ? profile.getBestStreak() : 0);
        streak.put("lastDate", profile != null ? profile.getStreakLastDate() : null);
        stats.put("streak", streak);
        
        Map<String, Number> radarScores = new HashMap<>();
        if (profile != null) {
            radarScores.put("DSA", profile.getDsaScore() != null ? profile.getDsaScore().doubleValue() : 0);
            radarScores.put("System Design", profile.getSystemDesignScore() != null ? profile.getSystemDesignScore().doubleValue() : 0);
            radarScores.put("Behavioral", profile.getBehavioralScore() != null ? profile.getBehavioralScore().doubleValue() : 0);
            radarScores.put("Communication", profile.getCommunicationScore() != null ? profile.getCommunicationScore().doubleValue() : 0);
            radarScores.put("Domain Knowledge", profile.getDomainKnowledgeScore() != null ? profile.getDomainKnowledgeScore().doubleValue() : 0);
            radarScores.put("HR", profile.getHrScore() != null ? profile.getHrScore().doubleValue() : 0);
        } else {
            radarScores.put("DSA", 0);
            radarScores.put("System Design", 0);
            radarScores.put("Behavioral", 0);
            radarScores.put("Communication", 0);
            radarScores.put("Domain Knowledge", 0);
            radarScores.put("HR", 0);
        }
        stats.put("radarScores", radarScores);
        
        return stats;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "userBadges", key = "#email")
    public List<String> getUserBadges(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<String> badges = new ArrayList<>();
        if (user.getProfile() != null && user.getProfile().getBadgesEarned() != null) {
            badges = user.getProfile().getBadgesEarned();
        }
        return badges;
    }

    @CacheEvict(value = {"userProfile", "userStats", "userBadges"}, key = "#email")
    public void evictUserCache(String email) {
        log.debug("Evicting cache for user: {}", email);
    }
}
