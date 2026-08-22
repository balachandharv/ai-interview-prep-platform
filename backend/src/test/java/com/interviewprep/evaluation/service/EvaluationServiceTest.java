package com.interviewprep.evaluation.service;

import com.interviewprep.evaluation.dto.EvaluationRequest;
import com.interviewprep.evaluation.dto.EvaluationResult;
import com.interviewprep.evaluation.dto.OpenAiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class EvaluationServiceTest {

    @Mock
    private OpenAiService openAiService;

    @Mock
    private HuggingFaceService huggingFaceService;

    @InjectMocks
    private EvaluationService evaluationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void evaluateAnswer_shortAnswer_shouldFlagAndScoreLow() {
        // Arrange
        EvaluationRequest request = EvaluationRequest.builder()
                .questionText("What is a map?")
                .userAnswer("It is a map.")
                .modelAnswer("A hash map is a data structure...")
                .keyPoints(List.of("key point 1"))
                .timeSpentSeconds(30)
                .build();

        OpenAiResponse mockResponse = new OpenAiResponse();
        mockResponse.setCorrectnessScore(2);
        mockResponse.setCompletenessScore(2);
        mockResponse.setClarityScore(3);
        mockResponse.setStructureScore(2);
        mockResponse.setPointsCovered(List.of());
        mockResponse.setPointsMissed(List.of("key point 1"));
        mockResponse.setSampleAnswer("Good");
        mockResponse.setProTip("Sample");
        when(openAiService.evaluateAnswer(anyString(), anyString(), anyString(), anyList())).thenReturn(mockResponse);

        // Act
        EvaluationResult result = evaluationService.evaluateAnswer(request);

        // Assert
        assertTrue(result.isFlaggedShort());
        assertTrue(result.getFinalScore() <= 3.0);
    }

    @Test
    void evaluateAnswer_fastAnswer_shouldFlag() {
        // Arrange
        EvaluationRequest request = EvaluationRequest.builder()
                .questionText("What is a map?")
                .userAnswer("A hash map is a data structure that implements an associative array abstract data type, a structure that can map keys to values.")
                .modelAnswer("A hash map is a data structure...")
                .keyPoints(List.of("key point 1"))
                .timeSpentSeconds(5) // Fast answer
                .build();

        when(huggingFaceService.computeSimilarity(anyString(), anyString())).thenReturn(0.8);
        
        OpenAiResponse mockResponse = new OpenAiResponse();
        mockResponse.setCorrectnessScore(8);
        mockResponse.setCompletenessScore(7);
        mockResponse.setClarityScore(9);
        mockResponse.setStructureScore(8);
        mockResponse.setPointsCovered(List.of("definition"));
        mockResponse.setPointsMissed(List.of());
        mockResponse.setSampleAnswer("Good");
        mockResponse.setProTip("Sample");
        
        when(openAiService.evaluateAnswer(anyString(), anyString(), anyString(), anyList())).thenReturn(mockResponse);

        // Act
        EvaluationResult result = evaluationService.evaluateAnswer(request);

        // Assert
        assertTrue(result.isFlaggedFast());
    }
}
