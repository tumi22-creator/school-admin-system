package com.schooladmin.backend.audit;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String action, String username, String details) {
        AuditLog auditLog = new AuditLog(
                action,
                username,
                details,
                null,
                null
        );

        auditLogRepository.save(auditLog);
    }

    public void log(
            String action,
            String username,
            String details,
            String ipAddress,
            String userAgent
    ) {
        AuditLog auditLog = new AuditLog(
                action,
                username,
                details,
                ipAddress,
                userAgent
        );

        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsByUser(String username) {
        return auditLogRepository.findByUsernameOrderByTimestampDesc(username);
    }
}