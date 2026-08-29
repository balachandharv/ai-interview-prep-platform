package com.interviewprep.config;

import com.interviewprep.auth.filter.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class AdminSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final SecurityConfig securityConfig; // To reuse CORS

    @Bean
    @Order(1) // Higher priority than the standard user filter chain
    public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
            .securityMatcher("/api/admin/**") // This chain ONLY applies to /api/admin/**
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(securityConfig.corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .anyRequest().hasAnyRole("ADMIN", "SUPERADMIN") // Strict role check
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 for admin boundaries
                    response.setContentType("application/json");
                    response.getWriter().write(
                        "{\"success\":false,\"message\":\"Access Denied: Requires Admin Privileges\"}"
                    );
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write(
                        "{\"success\":false,\"message\":\"Access Denied: Requires Admin Privileges\"}"
                    );
                })
            )
            .build();
    }
}
