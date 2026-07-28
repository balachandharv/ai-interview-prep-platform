package com.interviewai.backend.controller;

import com.interviewai.backend.model.User;
import com.interviewai.backend.payload.response.MessageResponse;
import com.interviewai.backend.repository.UserRepository;
import com.interviewai.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, Object> updates) {
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }

        if (updates.containsKey("targetRole")) {
            user.setTargetRole((String) updates.get("targetRole"));
        }
        if (updates.containsKey("experienceLevel")) {
            user.setExperienceLevel((String) updates.get("experienceLevel"));
        }
        // Simplified update logic for onboarding completion
        user.setOnboardingComplete(true);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
    }
}
