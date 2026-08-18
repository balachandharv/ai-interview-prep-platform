package com.interviewprep;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableCaching
@EnableJpaAuditing
public class InterviewPrepApplication {
    public static void main(String[] args) {
        SpringApplication.run(InterviewPrepApplication.class, args);
    }
}
