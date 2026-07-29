package com.interviewprep.evaluation.dto;
import lombok.Data;
import java.util.List;
@Data public class OpenAiResponse {
    private int correctnessScore;
    private int completenessScore;
    private int clarityScore;
    private int structureScore;
    private List<String> pointsCovered;
    private List<String> pointsMissed;
    private String sampleAnswer;
    private String proTip;
}