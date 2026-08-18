package com.interviewprep.session.service;

import com.interviewprep.common.exception.ResourceNotFoundException;
import com.interviewprep.common.response.PagedResponse;
import com.interviewprep.evaluation.dto.EvaluationRequest;
import com.interviewprep.evaluation.dto.EvaluationResult;
import com.interviewprep.evaluation.service.EvaluationService;
import com.interviewprep.question.entity.Question;
import com.interviewprep.question.repository.QuestionRepository;
import com.interviewprep.session.dto.SessionDto;
import com.interviewprep.session.dto.SessionResultsDto;
import com.interviewprep.session.dto.StartSessionRequest;
import com.interviewprep.session.dto.SubmitAnswerRequest;
import com.interviewprep.session.dto.SubmitAnswerResponse;
import com.interviewprep.session.entity.Session;
import com.interviewprep.session.entity.SessionQuestion;
import com.interviewprep.session.repository.SessionQuestionRepository;
import com.interviewprep.session.repository.SessionRepository;
import com.interviewprep.user.entity.User;
import com.interviewprep.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SessionQuestionRepository sessionQuestionRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final EvaluationService evaluationService;

    @Transactional
    public SessionDto startSession(StartSessionRequest request, String username) {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Session session = Session.builder()
            .userId(user.getId())
            .mode(request.getMode().name())
            .targetRole(user.getTargetRole())
            .difficulty(request.getDifficulty().name())
            .category(request.getCategory().name())
            .questionCount(request.getQuestionCount())
            .completedCount(0)
            .timeSpentSeconds(0)
            .isCompleted(false)
            .startedAt(LocalDateTime.now())
            .build();

        session = sessionRepository.save(session);
        return SessionDto.builder().id(session.getId()).build();
    }

    @Transactional
    public SubmitAnswerResponse submitAnswer(UUID sessionId, SubmitAnswerRequest request, String username) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
            
        Question question = questionRepository.findById(request.getQuestionId())
            .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        EvaluationResult evalResult = evaluationService.evaluateAnswer(
            EvaluationRequest.builder()
                .questionId(question.getId())
                .questionText(question.getQuestionText())
                .modelAnswer(question.getModelAnswer())
                .keyPoints(question.getKeyPoints())
                .userAnswer(request.getAnswer())
                .timeSpentSeconds(request.getTimeSpentSeconds())
                .isVoiceAnswer(false)
                .build()
        );

        SessionQuestion sq = SessionQuestion.builder()
            .session(session)
            .question(question)
            .userAnswer(request.getAnswer())
            .score(BigDecimal.valueOf(evalResult.getFinalScore()))
            .correctnessScore(BigDecimal.valueOf(evalResult.getCorrectnessScore()))
            .completenessScore(BigDecimal.valueOf(evalResult.getCompletenessScore()))
            .clarityScore(BigDecimal.valueOf(evalResult.getClarityScore()))
            .structureScore(BigDecimal.valueOf(evalResult.getStructureScore()))
            .similarityScore(BigDecimal.valueOf(evalResult.getSimilarityScore()))
            .timeSpentSeconds(request.getTimeSpentSeconds())
            .fillerWordCount(evalResult.getFillerWordCount())
            .pointsCovered(evalResult.getPointsCovered())
            .pointsMissed(evalResult.getPointsMissed())
            .sampleAnswer(evalResult.getSampleAnswer())
            .proTip(evalResult.getProTip())
            .isFlaggedShort(evalResult.isFlaggedShort())
            .isFlaggedFast(evalResult.isFlaggedFast())
            .answeredAt(LocalDateTime.now())
            .build();

        sessionQuestionRepository.save(sq);
        
        session.setCompletedCount(session.getCompletedCount() + 1);
        session.setTimeSpentSeconds(session.getTimeSpentSeconds() + request.getTimeSpentSeconds());
        sessionRepository.save(session);

        return SubmitAnswerResponse.builder()
            .score(evalResult.getFinalScore())
            .pointsCovered(evalResult.getPointsCovered())
            .pointsMissed(evalResult.getPointsMissed())
            .sampleAnswer(evalResult.getSampleAnswer())
            .proTip(evalResult.getProTip())
            .build();
    }

    @Transactional
    public SessionResultsDto completeSession(UUID sessionId, String username) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
            
        List<SessionQuestion> answers = sessionQuestionRepository.findBySessionId(sessionId);
        double avgScore = answers.stream().mapToDouble(a -> a.getScore().doubleValue()).average().orElse(0.0);
        
        session.setOverallScore(BigDecimal.valueOf(avgScore));
        session.setIsCompleted(true);
        session.setCompletedAt(LocalDateTime.now());
        sessionRepository.save(session);
        
        return SessionResultsDto.builder()
            .sessionId(session.getId())
            .overallScore(avgScore)
            .build();
    }

    public PagedResponse<SessionDto> getSessionHistory(String username, int page, int size) {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<Session> sessionPage = sessionRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page, size));
        
        List<SessionDto> content = sessionPage.getContent().stream().map(s -> {
            String grade = "D";
            if (s.getOverallScore() != null) {
                double score = s.getOverallScore().doubleValue();
                if (score >= 8) grade = "A";
                else if (score >= 6) grade = "B";
                else if (score >= 4) grade = "C";
            }
            return SessionDto.builder()
                .id(s.getId())
                .mode(s.getMode())
                .difficulty(s.getDifficulty())
                .category(s.getCategory())
                .questionCount(s.getQuestionCount())
                .completedCount(s.getCompletedCount())
                .overallScore(s.getOverallScore())
                .isCompleted(s.getIsCompleted())
                .startedAt(s.getStartedAt())
                .completedAt(s.getCompletedAt())
                .date(s.getCreatedAt() != null ? s.getCreatedAt().toString() : LocalDateTime.now().toString())
                .grade(grade)
                .build();
        }).toList();
        
        return PagedResponse.<SessionDto>builder()
                .content(content)
                .page(sessionPage.getNumber())
                .size(sessionPage.getSize())
                .totalElements(sessionPage.getTotalElements())
                .totalPages(sessionPage.getTotalPages())
                .last(sessionPage.isLast())
                .build();
    }

    public SessionResultsDto getSessionResults(UUID sessionId, String username) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        return SessionResultsDto.builder()
            .sessionId(session.getId())
            .overallScore(session.getOverallScore() != null ? session.getOverallScore().doubleValue() : 0.0)
            .build();
    }
}
