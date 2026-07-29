package com.interviewprep.evaluation.dto;
import lombok.Builder;
import lombok.Data;
import java.util.List;
@Data @Builder public class EvaluationResult {
    private double finalScore;
    private double similarityScore;
    private int correctnessScore;
    private int completenessScore;
    private int clarityScore;
    private int structureScore;
    private List<String> pointsCovered;
    private List<String> pointsMissed;
    private String sampleAnswer;
    private String proTip;
    private int fillerWordCount;
    private boolean isFlaggedShort;
    private boolean isFlaggedFast;
}