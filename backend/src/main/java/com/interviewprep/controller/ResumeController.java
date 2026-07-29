package com.interviewprep.controller;

import com.interviewprep.service.ResumeParserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeParserService resumeParserService;

    public ResumeController(ResumeParserService resumeParserService) {
        this.resumeParserService = resumeParserService;
    }

    @PostMapping("/parse")
    public ResponseEntity<?> parseResume(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty() || !file.getOriginalFilename().endsWith(".pdf")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please upload a valid PDF file."));
            }
            String analysis = resumeParserService.extractSkillsAndGenerateQuestions(file);
            return ResponseEntity.ok(Map.of("analysis", analysis));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to parse PDF file"));
        }
    }
}
