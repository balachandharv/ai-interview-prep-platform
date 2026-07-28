package com.interviewai.backend.repository;

import com.interviewai.backend.model.Session;
import com.interviewai.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUserOrderByStartedAtDesc(User user);
    List<Session> findByUserAndStatusOrderByStartedAtDesc(User user, String status);
}
