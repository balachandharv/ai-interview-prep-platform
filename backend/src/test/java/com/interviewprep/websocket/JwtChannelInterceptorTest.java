package com.interviewprep.websocket;

import com.interviewprep.common.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.mockito.Mockito.*;

/**
 * Unit tests for JwtChannelInterceptor.
 * Verifies: valid token sets Principal; missing token passes through; null accessor is handled safely.
 */
@ExtendWith(MockitoExtension.class)
class JwtChannelInterceptorTest {

    @Mock private JwtUtil jwtUtil;
    @Mock private UserDetailsService userDetailsService;
    @Mock private MessageChannel channel;

    @InjectMocks private JwtChannelInterceptor interceptor;

    private UserDetails mockUserDetails;

    @BeforeEach
    void setUp() {
        mockUserDetails = org.springframework.security.core.userdetails.User
            .withUsername("user@example.com")
            .password("irrelevant")
            .authorities(Collections.emptyList())
            .build();
    }

    @Test
    @DisplayName("CONNECT with valid token: sets Principal on accessor")
    void preSend_validToken_setsPrincipal() {
        // given
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.CONNECT);
        accessor.addNativeHeader("Authorization", "Bearer valid.jwt.token");
        accessor.setLeaveMutable(true);
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        when(jwtUtil.extractUsername("valid.jwt.token")).thenReturn("user@example.com");
        when(userDetailsService.loadUserByUsername("user@example.com")).thenReturn(mockUserDetails);
        when(jwtUtil.isTokenValid("valid.jwt.token", mockUserDetails)).thenReturn(true);

        // when
        Message<?> result = interceptor.preSend(message, channel);

        // then
        assertThat(result).isNotNull();
        StompHeaderAccessor resultAccessor = StompHeaderAccessor.wrap(result);
        assertThat(resultAccessor.getUser()).isNotNull();
        assertThat(resultAccessor.getUser().getName()).isEqualTo("user@example.com");
    }

    @Test
    @DisplayName("CONNECT with missing Authorization header: passes through without Principal")
    void preSend_missingAuthHeader_passesThrough() {
        // given
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.CONNECT);
        accessor.setLeaveMutable(true);
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        // when
        Message<?> result = interceptor.preSend(message, channel);

        // then — message passes through, no Principal set, no token processing
        assertThat(result).isNotNull();
        verify(jwtUtil, never()).extractUsername(any());
    }

    @Test
    @DisplayName("CONNECT with invalid token: no Principal set")
    void preSend_invalidToken_noPrincipalSet() {
        // given
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.CONNECT);
        accessor.addNativeHeader("Authorization", "Bearer bad.token");
        accessor.setLeaveMutable(true);
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        when(jwtUtil.extractUsername("bad.token")).thenReturn("user@example.com");
        when(userDetailsService.loadUserByUsername("user@example.com")).thenReturn(mockUserDetails);
        when(jwtUtil.isTokenValid("bad.token", mockUserDetails)).thenReturn(false);

        // when
        Message<?> result = interceptor.preSend(message, channel);

        // then — message passes but Principal is NOT set
        assertThat(result).isNotNull();
        StompHeaderAccessor resultAccessor = StompHeaderAccessor.wrap(result);
        assertThat(resultAccessor.getUser()).isNull();
    }

    @Test
    @DisplayName("Non-STOMP frame (heartbeat): handled gracefully, no NPE")
    void preSend_nonStompFrame_handledGracefully() {
        // given — a generic message with no STOMP headers (simulates heartbeat / SockJS internal frame)
        Message<byte[]> message = MessageBuilder.withPayload(new byte[0]).build();

        // when / then — should NOT throw any exception
        assertThatNoException().isThrownBy(() -> interceptor.preSend(message, channel));
    }

    @Test
    @DisplayName("SEND command (not CONNECT): interceptor passes through without token processing")
    void preSend_sendCommand_passesThrough() {
        // given
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.SEND);
        accessor.setDestination("/app/roleplay/123/message");
        accessor.setLeaveMutable(true);
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        // when
        Message<?> result = interceptor.preSend(message, channel);

        // then — non-CONNECT frames are passed through without JWT processing
        assertThat(result).isNotNull();
        verify(jwtUtil, never()).extractUsername(any());
    }
}
