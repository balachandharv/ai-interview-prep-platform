package com.interviewprep.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardDto {
    private String name;
    private Integer readinessScore;
    private Integer totalSessions;
    private Integer badgesEarnedCount;
}
