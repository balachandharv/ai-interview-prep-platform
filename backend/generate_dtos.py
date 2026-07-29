import os

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content.strip())

dtos = {
    "auth/dto/RegisterRequest.java": """
package com.interviewprep.auth.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data public class RegisterRequest {
    @NotBlank private String name;
    @Email @NotBlank private String email;
    @NotBlank @Size(min = 6) private String password;
}
    """,
    "auth/dto/LoginRequest.java": """
package com.interviewprep.auth.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data public class LoginRequest {
    @Email @NotBlank private String email;
    @NotBlank private String password;
}
    """,
    "auth/dto/AuthResponse.java": """
package com.interviewprep.auth.dto;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;
@Data @Builder public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UUID userId;
    private String name;
    private String email;
}
    """,
    "auth/dto/RefreshTokenRequest.java": """
package com.interviewprep.auth.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data public class RefreshTokenRequest {
    @NotBlank private String refreshToken;
}
    """,
    "auth/dto/ForgotPasswordRequest.java": """
package com.interviewprep.auth.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data public class ForgotPasswordRequest {
    @Email @NotBlank private String email;
}
    """,
    "user/dto/UserProfileDto.java": """
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
    """,
    "session/dto/StartSessionRequest.java": """
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
    """,
    "session/dto/SessionDto.java": """
package com.interviewprep.session.dto;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;
@Data @Builder public class SessionDto {
    private UUID id;
}
    """,
    "session/dto/SubmitAnswerRequest.java": """
package com.interviewprep.session.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;
@Data public class SubmitAnswerRequest {
    @NotNull private UUID questionId;
    @NotBlank private String answer;
    private int timeSpentSeconds;
}
    """,
    "session/dto/SubmitAnswerResponse.java": """
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
    """,
    "session/dto/SessionResultsDto.java": """
package com.interviewprep.session.dto;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;
@Data @Builder public class SessionResultsDto {
    private UUID sessionId;
    private double overallScore;
}
    """,
    "roleplay/dto/StartRoleplayRequest.java": """
package com.interviewprep.roleplay.dto;
import lombok.Data;
import java.util.UUID;
@Data public class StartRoleplayRequest {
    private UUID personaId;
}
    """,
    "roleplay/dto/RoleplayMessageRequest.java": """
package com.interviewprep.roleplay.dto;
import lombok.Data;
@Data public class RoleplayMessageRequest {
    private String message;
}
    """,
    "roleplay/dto/RoleplayMessageResponse.java": """
package com.interviewprep.roleplay.dto;
import lombok.Builder;
import lombok.Data;
@Data @Builder public class RoleplayMessageResponse {
    private String message;
    private boolean isTyping;
}
    """,
    "evaluation/dto/EvaluationRequest.java": """
package com.interviewprep.evaluation.dto;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;
@Data @Builder public class EvaluationRequest {
    private UUID questionId;
    private String questionText;
    private String modelAnswer;
    private List<String> keyPoints;
    private String userAnswer;
    private int timeSpentSeconds;
    private boolean isVoiceAnswer;
}
    """,
    "evaluation/dto/EvaluationResult.java": """
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
    """,
    "evaluation/dto/OpenAiResponse.java": """
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
    """,
    "common/enums/QuestionCategory.java": """
package com.interviewprep.common.enums;
public enum QuestionCategory { DSA, SYSTEM_DESIGN, BEHAVIORAL, HR, DOMAIN }
    """,
    "common/enums/QuestionDifficulty.java": """
package com.interviewprep.common.enums;
public enum QuestionDifficulty { EASY, MEDIUM, HARD }
    """,
    "common/enums/SessionMode.java": """
package com.interviewprep.common.enums;
public enum SessionMode { STANDARD, MOCK, ROLEPLAY }
    """,
    "peer/dto/PeerMessageDto.java": """
package com.interviewprep.peer.dto;
import lombok.Data;
@Data public class PeerMessageDto {
    private String content;
    private String senderId;
}
    """
}

base_path = "e:/Downloads/Ai Assit Learning Platform/backend/src/main/java/com/interviewprep"
for path, content in dtos.items():
    create_file(f"{base_path}/{path}", content)

print("Created all DTOs and Enums successfully!")
