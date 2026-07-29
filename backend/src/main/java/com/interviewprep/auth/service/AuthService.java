package com.interviewprep.auth.service;

import com.interviewprep.auth.dto.AuthResponse;
import com.interviewprep.auth.dto.LoginRequest;
import com.interviewprep.auth.dto.RefreshTokenRequest;
import com.interviewprep.auth.dto.RegisterRequest;
import com.interviewprep.common.enums.Role;
import com.interviewprep.common.exception.ConflictException;
import com.interviewprep.common.exception.UnauthorizedException;
import com.interviewprep.common.util.JwtUtil;
import com.interviewprep.user.entity.User;
import com.interviewprep.user.entity.UserProfile;
import com.interviewprep.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .active(true)
                .emailVerified(false)
                .build();

        UserProfile profile = new UserProfile();
        profile.setUser(user);
        user.setProfile(profile);

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String username = jwtUtil.extractUsername(request.getRefreshToken());
        if (username == null) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (jwtUtil.isTokenValid(request.getRefreshToken(), userDetails)) {
            String token = jwtUtil.generateToken(userDetails);
            User user = userRepository.findByEmail(username).orElseThrow();
            return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(request.getRefreshToken())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
        }
        throw new UnauthorizedException("Invalid refresh token");
    }

    public void logout(String token) {
        // Implement token blacklisting using Redis here
    }

    public void sendPasswordResetEmail(String email) {
        // Implement email sending logic
    }
}
