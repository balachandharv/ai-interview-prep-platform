package com.interviewprep.evaluation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class HuggingFaceService {

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.model-url}")
    private String modelUrl;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public double computeSimilarity(String sourceSentence, String targetSentence) {
        try {
            Map<String, Object> body = Map.of(
                "inputs", Map.of(
                    "source_sentence", sourceSentence,
                    "sentences", new String[]{targetSentence}
                )
            );

            String jsonBody = objectMapper.writeValueAsString(body);
            Request request = new Request.Builder()
                .url(modelUrl)
                .post(RequestBody.create(jsonBody, MediaType.parse("application/json")))
                .addHeader("Authorization", "Bearer " + apiKey)
                .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonNode root = objectMapper.readTree(response.body().string());
                    if (root.isArray() && root.size() > 0) {
                        return root.get(0).asDouble();
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to call HuggingFace API", e);
        }
        return 0.5; // fallback
    }
}
