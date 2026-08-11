package com.interviewprep.controller;

import com.interviewprep.user.entity.UserProfile;
import com.interviewprep.user.repository.UserProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "*")
public class LeaderboardController {

    private final UserProfileRepository userProfileRepository;

    public LeaderboardController(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @GetMapping
    public ResponseEntity<List<UserProfile>> getTopUsers() {
        // Assuming we have a derived query or we just sort in memory for now
        List<UserProfile> allProfiles = userProfileRepository.findAll();
        allProfiles.sort((p1, p2) -> Integer.compare(
                p2.getReadinessScore() != null ? p2.getReadinessScore() : 0, 
                p1.getReadinessScore() != null ? p1.getReadinessScore() : 0));
        
        return ResponseEntity.ok(allProfiles.stream().limit(10).toList());
    }
}
