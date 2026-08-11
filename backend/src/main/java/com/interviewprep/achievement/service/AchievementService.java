package com.interviewprep.achievement.service;

import com.interviewprep.achievement.entity.Achievement;
import com.interviewprep.achievement.repository.AchievementRepository;
import com.interviewprep.common.enums.BadgeName;
import com.interviewprep.notification.service.NotificationService;
import com.interviewprep.roleplay.repository.RoleplaySessionRepository;
import com.interviewprep.session.entity.Session;
import com.interviewprep.user.entity.User;
import com.interviewprep.user.entity.UserProfile;
import com.interviewprep.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserProfileRepository profileRepository;
    private final NotificationService notificationService;
    private final RoleplaySessionRepository roleplayRepository;
    private final com.interviewprep.session.repository.SessionRepository sessionRepository;

    public List<Achievement> checkAndAwardBadges(User user, Session completedSession) {
        List<Achievement> newBadges = new ArrayList<>();
        UserProfile profile = user.getProfile();

        checkBadge(user, BadgeName.FIRST_MOCK,
            profile.getTotalSessions() == 1, newBadges);

        checkBadge(user, BadgeName.STREAK_7,
            profile.getStreakCount() >= 7, newBadges);

        checkBadge(user, BadgeName.STREAK_30,
            profile.getStreakCount() >= 30, newBadges);

        checkBadge(user, BadgeName.HIGH_SCORER,
            completedSession.getOverallScore() != null
            && completedSession.getOverallScore().compareTo(new java.math.BigDecimal("9.0")) >= 0, newBadges);

        checkBadge(user, BadgeName.CENTURY,
            profile.getTotalQuestionsAnswered() >= 100, newBadges);

        checkBadge(user, BadgeName.ROLEPLAY_PRO,
            countRoleplaySessions(user) >= 5, newBadges);

        checkBadge(user, BadgeName.COMPANY_CRUSHER,
            hasCompletedCompanyMock(user), newBadges);

        newBadges.forEach(badge ->
            notificationService.sendBadgeNotification(user, badge));

        return newBadges;
    }

    private void checkBadge(User user, BadgeName badge,
            boolean condition, List<Achievement> newBadges) {
        if (condition && !achievementRepository
                .existsByUserIdAndBadgeName(user.getId(), badge.name())) {
            Achievement achievement = Achievement.builder()
                .userId(user.getId())
                .badgeName(badge.name())
                .badgeDescription(badge.getDescription())
                .badgeIcon(badge.getIcon())
                .earnedAt(LocalDateTime.now())
                .build();
            newBadges.add(achievementRepository.save(achievement));
            log.info("Badge awarded: {} to user: {}", badge, user.getEmail());
        }
    }

    private int countRoleplaySessions(User user) {
        return roleplayRepository.countByUserIdAndIsCompletedTrue(user.getId());
    }

    private boolean hasCompletedCompanyMock(User user) {
        return sessionRepository.existsByUserIdAndCompanyTagIsNotNullAndIsCompletedTrue(user.getId());
    }
}
