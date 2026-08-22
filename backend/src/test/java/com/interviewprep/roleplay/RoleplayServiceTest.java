package com.interviewprep.roleplay;

import com.interviewprep.evaluation.service.OpenAiService;
import com.interviewprep.roleplay.dto.RoleplayMessageRequest;
import com.interviewprep.roleplay.dto.StartRoleplayRequest;
import com.interviewprep.roleplay.entity.Persona;
import com.interviewprep.roleplay.entity.RoleplaySession;
import com.interviewprep.roleplay.repository.PersonaRepository;
import com.interviewprep.roleplay.repository.RoleplaySessionRepository;
import com.interviewprep.roleplay.service.RoleplayService;
import com.interviewprep.user.entity.User;
import com.interviewprep.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for RoleplayService critical paths.
 * Mocks: PersonaRepository, UserRepository, RoleplaySessionRepository, OpenAiService.
 * No Spring context needed — pure Mockito.
 */
@ExtendWith(MockitoExtension.class)
class RoleplayServiceTest {

    @Mock private RoleplaySessionRepository roleplaySessionRepository;
    @Mock private PersonaRepository personaRepository;
    @Mock private UserRepository userRepository;
    @Mock private OpenAiService openAiService;

    @InjectMocks private RoleplayService roleplayService;

    private User testUser;
    private Persona testPersona;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(UUID.randomUUID())
            .email("test@example.com")
            .name("Test User")
            .build();

        testPersona = Persona.builder()
            .id(UUID.randomUUID())
            .name("Sarah Chen")
            .role("Senior Engineer")
            .company("TechCorp")
            .interviewStyle("Technical")
            .difficulty("Medium")
            .systemPrompt("You are Sarah Chen, Senior Engineer at TechCorp.")
            .active(true)
            .build();
    }

    // ─── startSession ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("startSession: happy path — creates session in DB and returns UUID")
    void startSession_happyPath_returnsSavedSessionId() {
        // given
        StartRoleplayRequest request = new StartRoleplayRequest();
        request.setPersonaId(testPersona.getId());

        UUID expectedId = UUID.randomUUID();
        RoleplaySession savedSession = RoleplaySession.builder()
            .id(expectedId)
            .user(testUser)
            .personaId(testPersona.getId())
            .isCompleted(false)
            .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(personaRepository.findById(testPersona.getId())).thenReturn(Optional.of(testPersona));
        when(roleplaySessionRepository.save(any(RoleplaySession.class))).thenReturn(savedSession);

        // when
        UUID result = roleplayService.startSession(request, "test@example.com");

        // then
        assertThat(result).isEqualTo(expectedId);
        verify(roleplaySessionRepository, times(1)).save(any(RoleplaySession.class));
    }

    @Test
    @DisplayName("startSession: failure — user not found throws RuntimeException")
    void startSession_userNotFound_throwsRuntimeException() {
        // given
        StartRoleplayRequest request = new StartRoleplayRequest();
        request.setPersonaId(testPersona.getId());

        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> roleplayService.startSession(request, "unknown@example.com"))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("User not found");

        verify(roleplaySessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("startSession: failure — persona not found throws RuntimeException")
    void startSession_personaNotFound_throwsRuntimeException() {
        // given
        UUID unknownPersonaId = UUID.randomUUID();
        StartRoleplayRequest request = new StartRoleplayRequest();
        request.setPersonaId(unknownPersonaId);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(personaRepository.findById(unknownPersonaId)).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> roleplayService.startSession(request, "test@example.com"))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Persona not found");
    }

    // ─── processMessage ────────────────────────────────────────────────────────

    @Test
    @DisplayName("processMessage: happy path — appends to history and returns AI response")
    void processMessage_happyPath_appendsHistoryAndReturnsResponse() {
        // given
        UUID sessionId = UUID.randomUUID();
        RoleplaySession session = RoleplaySession.builder()
            .id(sessionId)
            .user(testUser)
            .personaName("Sarah Chen")
            .targetRole("Senior Engineer")
            .company("TechCorp")
            .interviewType("Technical")
            .conversationHistory(new ArrayList<>())
            .isCompleted(false)
            .build();

        RoleplayMessageRequest request = new RoleplayMessageRequest();
        request.setMessage("I have 5 years of experience in Java.");

        when(roleplaySessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(openAiService.conductRoleplayTurn(anyString(), anyList())).thenReturn("Tell me about your Java projects.");
        when(roleplaySessionRepository.save(any(RoleplaySession.class))).thenReturn(session);

        // when
        var response = roleplayService.processMessage(sessionId, request, "test@example.com");

        // then
        assertThat(response.getMessage()).isEqualTo("Tell me about your Java projects.");
        assertThat(response.isTyping()).isFalse();
        // History should contain user + AI message (2 entries)
        assertThat(session.getConversationHistory()).hasSize(2);
        assertThat(session.getConversationHistory().get(0).get("role")).isEqualTo("user");
        assertThat(session.getConversationHistory().get(1).get("role")).isEqualTo("assistant");
    }

    @Test
    @DisplayName("processMessage: failure — session not found throws RuntimeException")
    void processMessage_sessionNotFound_throwsRuntimeException() {
        // given
        UUID unknownSessionId = UUID.randomUUID();
        when(roleplaySessionRepository.findById(unknownSessionId)).thenReturn(Optional.empty());

        RoleplayMessageRequest request = new RoleplayMessageRequest();
        request.setMessage("Hello");

        // when / then
        assertThatThrownBy(() -> roleplayService.processMessage(unknownSessionId, request, "test@example.com"))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Roleplay session not found");
    }

    @Test
    @DisplayName("processMessage: security — wrong user accessing session is rejected")
    void processMessage_wrongUser_throwsRuntimeException() {
        // given
        UUID sessionId = UUID.randomUUID();
        RoleplaySession session = RoleplaySession.builder()
            .id(sessionId)
            .user(testUser) // owned by test@example.com
            .conversationHistory(new ArrayList<>())
            .build();

        when(roleplaySessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        RoleplayMessageRequest request = new RoleplayMessageRequest();
        request.setMessage("Hello");

        // when / then — attacker@example.com tries to access test@example.com's session
        assertThatThrownBy(() -> roleplayService.processMessage(sessionId, request, "attacker@example.com"))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Access denied");

        verify(openAiService, never()).conductRoleplayTurn(any(), any());
    }

    // ─── completeSession ───────────────────────────────────────────────────────

    @Test
    @DisplayName("completeSession: happy path — marks session complete and sets timestamps")
    void completeSession_happyPath_marksCompleteAndSetsTime() {
        // given
        UUID sessionId = UUID.randomUUID();
        RoleplaySession session = RoleplaySession.builder()
            .id(sessionId)
            .user(testUser)
            .isCompleted(false)
            .startedAt(java.time.LocalDateTime.now().minusMinutes(15))
            .build();

        when(roleplaySessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(roleplaySessionRepository.save(any(RoleplaySession.class))).thenReturn(session);

        // when
        RoleplaySession result = roleplayService.completeSession(sessionId, "test@example.com");

        // then
        assertThat(result.getIsCompleted()).isTrue();
        assertThat(result.getCompletedAt()).isNotNull();
        assertThat(result.getTimeSpentSeconds()).isGreaterThan(0);
    }
}
