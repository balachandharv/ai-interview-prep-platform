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
        return evaluateWithAI(request);
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

}
