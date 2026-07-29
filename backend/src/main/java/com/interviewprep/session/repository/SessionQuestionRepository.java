package com.interviewprep.session.repository;

import com.interviewprep.session.entity.SessionQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SessionQuestionRepository extends JpaRepository<SessionQuestion, UUID> {
    List<SessionQuestion> findBySessionId(UUID sessionId);
}
