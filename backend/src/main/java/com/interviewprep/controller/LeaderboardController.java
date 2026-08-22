package com.interviewprep.controller;

import com.interviewprep.user.entity.UserProfile;
import com.interviewprep.user.repository.UserProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import com.interviewprep.user.dto.LeaderboardDto;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/leaderboard")
@PreAuthorize("isAuthenticated()")
public class LeaderboardController {

    private final UserProfileRepository userProfileRepository;

    public LeaderboardController(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<LeaderboardDto>> getTopUsers() {
        // Assuming we have a derived query or we just sort in memory for now
        List<UserProfile> allProfiles = userProfileRepository.findAll();
        allProfiles.sort((p1, p2) -> Integer.compare(
                p2.getReadinessScore() != null ? p2.getReadinessScore() : 0, 
                p1.getReadinessScore() != null ? p1.getReadinessScore() : 0));
        
        List<LeaderboardDto> dtoList = allProfiles.stream().limit(10).map(p -> LeaderboardDto.builder()
                .name(p.getUser() != null ? p.getUser().getName() : "Unknown User")
                .readinessScore(p.getReadinessScore() != null ? p.getReadinessScore() : 0)
                .totalSessions(p.getTotalSessions() != null ? p.getTotalSessions() : 0)
                .badgesEarnedCount(p.getBadgesEarned() != null ? p.getBadgesEarned().size() : 0)
                .build()).collect(Collectors.toList());
                
        return ResponseEntity.ok(dtoList);
    }
}
