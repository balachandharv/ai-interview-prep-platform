package com.interviewprep.evaluation.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class FillerWordDetectionService {

    private static final List<String> FILLER_WORDS = Arrays.asList(
        "um", "uh", "like", "you know", "i mean", "sort of", "kind of", "literally", "basically"
    );

    public int countFillerWords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }

        String lowerText = text.toLowerCase();
        int count = 0;
        for (String filler : FILLER_WORDS) {
            count += (lowerText.length() - lowerText.replace(filler, "").length()) / filler.length();
        }
        
        return count;
    }
}
