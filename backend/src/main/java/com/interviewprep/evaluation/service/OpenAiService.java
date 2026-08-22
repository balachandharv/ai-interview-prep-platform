package com.interviewprep.evaluation.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.common.exception.AIServiceException;
import com.interviewprep.evaluation.dto.OpenAiResponse;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class OpenAiService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.base-url}")
    private String baseUrl;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public OpenAiResponse evaluateAnswer(
            String question,
            String userAnswer,
            String modelAnswer,
            List<String> keyPoints) {

        String systemPrompt = """
            You are an expert technical interview evaluator with 10+ years of experience
            at top tech companies. Evaluate the candidate's answer strictly and fairly.
            Always respond with valid JSON only, no markdown, no explanation outside JSON.
            """;

        String userPrompt = String.format("""
            Question: %s
            
            Model Answer: %s
            
            Key Points to Cover: %s
            
            Candidate's Answer: %s
            
            Evaluate on these four dimensions (score 0-10 each):
            1. Correctness: How factually accurate is the answer?
            2. Completeness: How many key points were covered?
            3. Clarity: How clear and well-structured is the explanation?
            4. Structure: Did the candidate use proper structure (STAR for behavioral)?
            
            Respond with this exact JSON:
            {
              "correctnessScore": 0,
              "completenessScore": 0,
              "clarityScore": 0,
              "structureScore": 0,
              "pointsCovered": ["point1", "point2"],
              "pointsMissed": ["point1", "point2"],
              "sampleAnswer": "improved answer in under 100 words",
              "proTip": "one specific actionable tip"
            }
            """,
            question, modelAnswer,
            String.join(", ", keyPoints), userAnswer);

        String response = callOpenAiApi(systemPrompt, userPrompt, 800);
        try {
            return objectMapper.readValue(response, OpenAiResponse.class);
        } catch (Exception e) {
            throw new AIServiceException("Failed to parse OpenAI evaluation response: " + e.getMessage());
        }
    }

    public String conductRoleplayTurn(
            String systemPrompt,
            List<Map<String, String>> conversationHistory) {

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("max_tokens", 500);
            requestBody.put("temperature", 0.8);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.addAll(conversationHistory);
            requestBody.put("messages", messages);

            String jsonBody = objectMapper.writeValueAsString(requestBody);
            Request request = new Request.Builder()
                .url(baseUrl + "/chat/completions")
                .post(RequestBody.create(jsonBody,
                    MediaType.parse("application/json")))
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .build();

            try (Response response = httpClient.newCall(request).execute()) {
                String responseBody = response.body().string();
                JsonNode root = objectMapper.readTree(responseBody);
                return root.path("choices").get(0)
                    .path("message").path("content").asText();
            }
        } catch (Exception e) {
            log.error("OpenAI roleplay API call failed: {}", e.getMessage());
            throw new AIServiceException("AI service temporarily unavailable");
        }
    }

    public String generateQuestions(String category, String difficulty,
            String role, int count) {
        String prompt = String.format("""
            Generate %d unique interview questions for:
            Category: %s
            Difficulty: %s
            Target Role: %s
            
            For each question provide:
            - question_text
            - model_answer (detailed, 150-200 words)
            - key_points (array of 4-6 bullet points)
            
            Respond with valid JSON array only.
            """, count, category, difficulty, role);

        return callOpenAiApi(
            "You are an expert interview question creator. Return JSON only.",
            prompt, 2000);
    }

    public String generateFocusPlan(Map<String, Double> categoryScores,
            String targetRole) {
        String prompt = String.format("""
            Based on these interview performance scores for a %s role:
            %s
            
            Generate a personalized 3-priority weekly focus plan.
            Each priority should have:
            - priority_number (1-3)
            - category
            - current_score
            - target_score
            - specific_topics (array of 3-5 topics to study)
            - recommended_resources (array of 2-3 specific resources)
            - daily_practice_suggestion
            
            Respond with valid JSON only.
            """, targetRole, categoryScores.toString());

        return callOpenAiApi(
            "You are a career coach and technical interview expert. Return JSON only.",
            prompt, 1000);
    }

    @Retryable(
        retryFor = { AIServiceException.class },
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000, multiplier = 2)
    )
    public String callOpenAiApi(String systemPrompt,
            String userPrompt, int maxTokens) {
        try {
            Map<String, Object> requestBody = Map.of(
                "model", model,
                "max_tokens", maxTokens,
                "temperature", 0.7,
                "messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
                )
            );

            String jsonBody = objectMapper.writeValueAsString(requestBody);
            Request request = new Request.Builder()
                .url(baseUrl + "/chat/completions")
                .post(RequestBody.create(jsonBody,
                    MediaType.parse("application/json")))
                .addHeader("Authorization", "Bearer " + apiKey)
                .build();

            try (Response response = httpClient.newCall(request).execute()) {
                String responseBody = response.body().string();
                JsonNode root = objectMapper.readTree(responseBody);
                return root.path("choices").get(0)
                    .path("message").path("content").asText();
            }
        } catch (Exception e) {
            log.error("OpenAI API call failed: {}", e.getMessage());
            throw new AIServiceException("AI service temporarily unavailable");
        }
    }
}
