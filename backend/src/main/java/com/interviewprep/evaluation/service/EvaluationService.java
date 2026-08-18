package com.interviewprep.evaluation.service;

import com.interviewprep.evaluation.dto.EvaluationRequest;
import com.interviewprep.evaluation.dto.EvaluationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {

    private final OpenAiService openAiService;
    private final HuggingFaceService huggingFaceService;
    private final FillerWordDetectionService fillerWordService;

    /**
     * Evaluates a user's answer. If AI services are not configured,
     * falls back to a mock scoring algorithm.
     */
    public EvaluationResult evaluateAnswer(EvaluationRequest request) {
        log.info("Evaluating answer for question: {}", request.getQuestionId());

        try {
            return evaluateWithAI(request);
        } catch (Exception e) {
            log.warn("AI evaluation failed, using mock scoring: {}", e.getMessage());
            return evaluateWithMock(request);
        }
    }

    private EvaluationResult evaluateWithAI(EvaluationRequest request) {
        double similarityScore = huggingFaceService.computeSimilarity(
            request.getUserAnswer(), request.getModelAnswer());

        var gptResult = openAiService.evaluateAnswer(
            request.getQuestionText(), request.getUserAnswer(),
            request.getModelAnswer(), request.getKeyPoints());

        double gptAverage = (gptResult.getCorrectnessScore()
            + gptResult.getCompletenessScore()
            + gptResult.getClarityScore()
            + gptResult.getStructureScore()) / 4.0;

        double finalScore = (similarityScore * 0.4 + (gptAverage / 10.0) * 0.6) * 10;
        finalScore = Math.round(finalScore * 10.0) / 10.0;
        finalScore = Math.max(0, Math.min(10, finalScore));

        int fillerWordCount = request.isVoiceAnswer()
            ? fillerWordService.countFillerWords(request.getUserAnswer()) : 0;

        return EvaluationResult.builder()
            .finalScore(finalScore)
            .similarityScore(similarityScore)
            .correctnessScore(gptResult.getCorrectnessScore())
            .completenessScore(gptResult.getCompletenessScore())
            .clarityScore(gptResult.getClarityScore())
            .structureScore(gptResult.getStructureScore())
            .pointsCovered(gptResult.getPointsCovered())
            .pointsMissed(gptResult.getPointsMissed())
            .sampleAnswer(gptResult.getSampleAnswer())
            .proTip(gptResult.getProTip())
            .fillerWordCount(fillerWordCount)
            .isFlaggedShort(request.getUserAnswer().split("\\s+").length < 20)
            .isFlaggedFast(request.getTimeSpentSeconds() < 30)
            .build();
    }

    /**
     * Mock scoring when AI services are unavailable.
     * Uses word count and keyword matching for a rough score.
     */
    private EvaluationResult evaluateWithMock(EvaluationRequest request) {
        String answer = request.getUserAnswer();
        int wordCount = answer.split("\\s+").length;

        // Simple heuristic scoring
        double baseScore = Math.min(10, 3.0 + (wordCount / 15.0));
        
        // Check if any key points are mentioned
        int keyPointsHit = 0;
        if (request.getKeyPoints() != null) {
            String lowerAnswer = answer.toLowerCase();
            for (String kp : request.getKeyPoints()) {
                String[] words = kp.toLowerCase().split("\\s+");
                for (String w : words) {
                    if (w.length() > 3 && lowerAnswer.contains(w)) {
                        keyPointsHit++;
                        break;
                    }
                }
            }
            baseScore += keyPointsHit * 0.5;
        }

        double finalScore = Math.round(Math.max(1, Math.min(10, baseScore)) * 10.0) / 10.0;
        double sub = Math.round((finalScore * 0.9 + Math.random()) * 10.0) / 10.0;

        return EvaluationResult.builder()
            .finalScore(finalScore)
            .similarityScore(finalScore / 10.0)
            .correctnessScore((int) Math.min(10, sub + 0.5))
            .completenessScore((int) Math.min(10, sub - 0.3))
            .clarityScore((int) Math.min(10, sub + 0.2))
            .structureScore((int) Math.min(10, sub))
            .pointsCovered(List.of("Good understanding shown", "Key concepts mentioned"))
            .pointsMissed(List.of("Could elaborate more", "Missing specific examples"))
            .sampleAnswer("A comprehensive answer would cover the key concepts with specific examples and clear structure.")
            .proTip("Try using the STAR method for behavioral questions and concrete examples for technical questions.")
            .fillerWordCount(0)
            .isFlaggedShort(wordCount < 20)
            .isFlaggedFast(request.getTimeSpentSeconds() < 30)
            .build();
    }
}
