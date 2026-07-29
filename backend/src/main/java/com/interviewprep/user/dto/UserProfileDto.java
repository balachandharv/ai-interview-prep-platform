package com.interviewprep.user.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
@Data public class UserProfileDto {
    private String name;
    private String email;
    private String targetRole;
    private Integer readinessScore;
    private List<String> badgesEarned;
}