package com.interviewprep.admin.service;

import com.interviewprep.admin.entity.AuditLog;
import com.interviewprep.admin.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void logAction(UUID adminId, String action, UUID targetId, String payload) {
        String ipAddress = "UNKNOWN";
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
            ipAddress = request.getRemoteAddr();
            // Handle proxy headers if applicable
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                ipAddress = xForwardedFor.split(",")[0];
            }
        } catch (Exception e) {
            log.warn("Could not extract IP address for audit log");
        }

        AuditLog auditLog = AuditLog.builder()
                .adminId(adminId)
                .action(action)
                .targetId(targetId)
                .payload(payload)
                .ipAddress(ipAddress)
                .build();

        auditLogRepository.save(auditLog);
        log.info("ADMIN AUDIT: Admin {} performed {} on target {}", adminId, action, targetId);
    }
}
