package com.interviewprep.controller;

import com.interviewprep.entity.UserProfile;
import com.interviewprep.repository.UserProfileRepository;
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
        allProfiles.sort((p1, p2) -> Double.compare(p2.getTotalScore(), p1.getTotalScore()));
        
        return ResponseEntity.ok(allProfiles.stream().limit(10).toList());
    }
}
