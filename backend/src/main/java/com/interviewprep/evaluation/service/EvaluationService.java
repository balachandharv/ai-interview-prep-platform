package com.interviewprep.evaluation.service;

import com.interviewprep.evaluation.dto.EvaluationRequest;
import com.interviewprep.evaluation.dto.EvaluationResult;
import com.interviewprep.evaluation.dto.OpenAiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {

    private final OpenAiService openAiService;
    private final HuggingFaceService huggingFaceService;
    private final FillerWordDetectionService fillerWordService;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String CACHE_KEY_PREFIX = "model_answer:";
    private static final long CACHE_TTL_HOURS = 24;

    public EvaluationResult evaluateAnswer(EvaluationRequest request) {
        log.info("Evaluating answer for question: {}", request.getQuestionId());

        // Step 1: Get similarity score from Hugging Face
        double similarityScore = huggingFaceService.computeSimilarity(
            request.getUserAnswer(),
            request.getModelAnswer()
        );

        // Step 2: Get GPT evaluation
        OpenAiResponse gptResult = openAiService.evaluateAnswer(
            request.getQuestionText(),
            request.getUserAnswer(),
            request.getModelAnswer(),
            request.getKeyPoints()
        );

        // Step 3: Calculate final weighted score
        double gptAverage = (gptResult.getCorrectnessScore()
            + gptResult.getCompletenessScore()
            + gptResult.getClarityScore()
            + gptResult.getStructureScore()) / 4.0;

        double finalScore = (similarityScore * 0.4 + (gptAverage / 10.0) * 0.6) * 10;
        finalScore = Math.round(finalScore * 10.0) / 10.0;
        finalScore = Math.max(0, Math.min(10, finalScore));

        // Step 4: Detect filler words if voice answer
        int fillerWordCount = 0;
        if (request.isVoiceAnswer()) {
            fillerWordCount = fillerWordService.countFillerWords(request.getUserAnswer());
        }

        // Step 5: Flag short or fast answers
        boolean isFlaggedShort = request.getUserAnswer().split("\\s+").length < 20;
        boolean isFlaggedFast = request.getTimeSpentSeconds() < 30;

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
            .isFlaggedShort(isFlaggedShort)
            .isFlaggedFast(isFlaggedFast)
            .build();
    }
}
