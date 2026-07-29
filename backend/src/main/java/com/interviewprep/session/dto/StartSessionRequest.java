package com.interviewprep.session.dto;
import com.interviewprep.common.enums.QuestionCategory;
import com.interviewprep.common.enums.QuestionDifficulty;
import com.interviewprep.common.enums.SessionMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data public class StartSessionRequest {
    @NotNull private SessionMode mode;
    @NotNull private QuestionDifficulty difficulty;
    @NotNull private QuestionCategory category;
    private int questionCount = 5;
}