package com.example.realestate.report;

import com.example.realestate.common.audit.AuditLogService;
import com.example.realestate.common.exception.ResourceNotFoundException;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.property.Property;
import com.example.realestate.property.PropertyRepository;
import com.example.realestate.report.dto.PropertyReportDTO;
import com.example.realestate.security.UserPrincipal;
import com.example.realestate.user.User;
import com.example.realestate.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PropertyReportService {

    private final PropertyReportRepository propertyReportRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public PropertyReportService(
            PropertyReportRepository propertyReportRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository,
            AuditLogService auditLogService) {
        this.propertyReportRepository = propertyReportRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public PropertyReportDTO createReport(UserPrincipal principal, UUID propertyId, String reason, String description) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        User reporter = null;
        if (principal != null) {
            reporter = userRepository.findById(principal.getId()).orElse(null);
        }

        PropertyReport report = new PropertyReport(property, reporter, reason, description);
        PropertyReport saved = propertyReportRepository.save(report);

        auditLogService.record(
                reporter != null ? reporter.getId() : null,
                reporter != null ? reporter.getEmail() : "anonymous",
                "PROPERTY_REPORTED",
                "PROPERTY_REPORT",
                saved.getId().toString(),
                "Listing reported for reason: " + reason,
                null
        );

        return new PropertyReportDTO(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyReportDTO> getReports(ReportStatus status, Pageable pageable) {
        Page<PropertyReport> page = (status != null)
                ? propertyReportRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                : propertyReportRepository.findByOrderByCreatedAtDesc(pageable);

        List<PropertyReportDTO> content = page.getContent().stream()
                .map(PropertyReportDTO::new)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional
    public PropertyReportDTO resolveReport(UUID reportId, ReportStatus newStatus, String adminNotes) {
        PropertyReport report = propertyReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        report.setStatus(newStatus);
        report.setAdminNotes(adminNotes);
        report.setResolvedAt(Instant.now());

        PropertyReport saved = propertyReportRepository.save(report);
        return new PropertyReportDTO(saved);
    }
}
