package com.interviewai.backend.repository;

import com.interviewai.backend.model.InterviewLog;
import com.interviewai.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewLogRepository extends JpaRepository<InterviewLog, Long> {
    List<InterviewLog> findBySessionOrderByTimestampAsc(Session session);
}
