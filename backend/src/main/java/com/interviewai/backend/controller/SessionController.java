package com.interviewai.backend.controller;

import com.interviewai.backend.model.InterviewLog;
import com.interviewai.backend.model.Session;
import com.interviewai.backend.model.User;
import com.interviewai.backend.payload.response.MessageResponse;
import com.interviewai.backend.repository.InterviewLogRepository;
import com.interviewai.backend.repository.SessionRepository;
import com.interviewai.backend.repository.UserRepository;
import com.interviewai.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    SessionRepository sessionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    InterviewLogRepository interviewLogRepository;

    @PostMapping("/start")
    public ResponseEntity<?> startSession(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, Object> request) {
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        
        Session session = Session.builder()
                .user(user)
                .mode((String) request.getOrDefault("mode", "Mock"))
                .company((String) request.get("company"))
                .difficulty((String) request.getOrDefault("difficulty", "Medium"))
                .status("In Progress")
                .build();
                
        sessionRepository.save(session);
        
        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", session.getId());
        response.put("message", "Session started successfully");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/submit-answer")
    public ResponseEntity<?> submitAnswer(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Session session = sessionRepository.findById(id).orElseThrow();
        
        String question = request.get("question");
        String answer = request.get("answer");
        
        // Mock AI Evaluation
        int score = (int) (Math.random() * 5) + 5; // Score 5-9
        String feedback = "Good answer, but you could elaborate more on the trade-offs.";
        
        InterviewLog log = InterviewLog.builder()
                .session(session)
                .askedQuestion(question)
                .userAnswer(answer)
                .score(score)
                .feedback(feedback)
                .role("user")
                .build();
                
        interviewLogRepository.save(log);
        
        Map<String, Object> response = new HashMap<>();
        response.put("score", score);
        response.put("feedback", feedback);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeSession(@PathVariable Long id) {
        Session session = sessionRepository.findById(id).orElseThrow();
        
        session.setStatus("Completed");
        session.setCompletedAt(LocalDateTime.now());
        
        // Calculate overall score based on logs
        List<InterviewLog> logs = interviewLogRepository.findBySessionOrderByTimestampAsc(session);
        int totalScore = logs.stream().filter(l -> l.getScore() != null).mapToInt(InterviewLog::getScore).sum();
        int avgScore = logs.isEmpty() ? 0 : totalScore / logs.size();
        
        session.setScore(avgScore);
        session.setFeedback("Overall, you did well. Focus on providing more concrete examples.");
        
        sessionRepository.save(session);
        
        return ResponseEntity.ok(new MessageResponse("Session completed."));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getSessionHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        List<Session> sessions = sessionRepository.findByUserOrderByStartedAtDesc(user);
        return ResponseEntity.ok(sessions);
    }
}
