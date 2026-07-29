package com.interviewprep.config;

import com.interviewprep.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.Collections;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository repository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> repository.findByEmail(username)
            .map(u -> new User(u.getEmail(), u.getPasswordHash() != null ? u.getPasswordHash() : "", Collections.emptyList()))
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
