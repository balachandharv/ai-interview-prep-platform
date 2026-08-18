package com.interviewprep.question.controller;

import com.interviewprep.common.response.ApiResponse;
import com.interviewprep.question.entity.Question;
import com.interviewprep.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class QuestionController {

    private final QuestionRepository questionRepository;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<Question>>> generateQuestions(@RequestBody Map<String, Object> request) {
        String category = (String) request.getOrDefault("category", "Technical");
        String difficulty = (String) request.getOrDefault("difficulty", "Medium");
        
        List<Question> questions = questionRepository.findByCategoryAndDifficulty(category, difficulty);
        if (questions.size() > 5) {
            questions = questions.subList(0, 5);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Questions generated", questions));
    }
}
