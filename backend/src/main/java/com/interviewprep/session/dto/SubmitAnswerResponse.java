package com.interviewprep.session.dto;
import lombok.Builder;
import lombok.Data;
import java.util.List;
@Data @Builder public class SubmitAnswerResponse {
    private double score;
    private List<String> pointsCovered;
    private List<String> pointsMissed;
    private String sampleAnswer;
    private String proTip;
}