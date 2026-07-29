package com.interviewprep.notification.service;

import com.interviewprep.achievement.entity.Achievement;
import com.interviewprep.user.entity.User;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    public void sendBadgeNotification(User user, Achievement badge) {
        // Implementation to send email or push notification to the user
    }
}
