package com.example.realestate.common.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void record(UUID actorId, String actorEmail, String action, String entityType, String entityId, String details, String ipAddress) {
        AuditLog log = new AuditLog(actorId, actorEmail, action, entityType, entityId, details, ipAddress);
        auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}
