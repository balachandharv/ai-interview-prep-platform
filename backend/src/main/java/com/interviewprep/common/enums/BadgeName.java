package com.interviewprep.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BadgeName {
    FIRST_MOCK("First Steps", "Complete your first mock interview", "ðŸŽ¯"),
    STREAK_7("7-Day Streak", "Practice 7 days in a row", "ðŸ”¥"),
    STREAK_30("30-Day Streak", "Practice 30 days in a row", "ðŸ\ufffd†"),
    HIGH_SCORER("High Scorer", "Score 9.0+ in an interview", "â­\ufffd"),
    CENTURY("Century", "Answer 100 questions", "ðŸ’¯"),
    ROLEPLAY_PRO("Roleplay Pro", "Complete 5 roleplay sessions", "ðŸŽ­"),
    COMPANY_CRUSHER("Company Crusher", "Complete a company-specific mock", "ðŸ\ufffd¢");

    private final String title;
    private final String description;
    private final String icon;
}
