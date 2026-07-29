package com.interviewprep.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BadgeName {
    FIRST_MOCK("First Steps", "Complete your first mock interview", "🎯"),
    STREAK_7("7-Day Streak", "Practice 7 days in a row", "🔥"),
    STREAK_30("30-Day Streak", "Practice 30 days in a row", "🏆"),
    HIGH_SCORER("High Scorer", "Score 9.0+ in an interview", "⭐"),
    CENTURY("Century", "Answer 100 questions", "💯"),
    ROLEPLAY_PRO("Roleplay Pro", "Complete 5 roleplay sessions", "🎭"),
    COMPANY_CRUSHER("Company Crusher", "Complete a company-specific mock", "🏢");

    private final String title;
    private final String description;
    private final String icon;
}
