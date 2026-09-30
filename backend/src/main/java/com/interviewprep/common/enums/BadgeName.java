package com.interviewprep.common.enums;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
@Getter
@RequiredArgsConstructor
public enum BadgeName {
    FIRST_MOCK("First Steps", "Complete your first mock interview", "star"),
    STREAK_7("7-Day Streak", "Practice 7 days in a row", "flame"),
    PERFECT_SCORE("Perfect Score", "Get 10/10 in a technical mock", "award"),
    SPEED_DEMON("Speed Demon", "Answer 10 questions under 1 minute each", "zap"),
    CENTURY("Century", "Answer 100 questions", "check-circle"),
    ROLEPLAY_PRO("Roleplay Pro", "Complete 5 roleplay sessions", "users"),
    TOP_PERCENTILE("Top 1%", "Score in the top 1% of the leaderboard", "trophy");
    private final String title;
    private final String description;
    private final String icon;
}
