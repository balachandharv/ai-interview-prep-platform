package com.interviewprep.question.repository;

import com.interviewprep.question.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByCategoryAndDifficulty(String category, String difficulty);
}
