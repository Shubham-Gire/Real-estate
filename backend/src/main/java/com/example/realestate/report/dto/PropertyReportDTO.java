package com.example.realestate.report.dto;

import com.example.realestate.report.PropertyReport;
import com.example.realestate.report.ReportStatus;

import java.time.Instant;
import java.util.UUID;

public class PropertyReportDTO {
    private UUID id;
    private UUID propertyId;
    private String propertyTitle;
    private UUID reporterId;
    private String reporterEmail;
    private String reason;
    private String description;
    private ReportStatus status;
    private String adminNotes;
    private Instant createdAt;
    private Instant resolvedAt;

    public PropertyReportDTO() {}

    public PropertyReportDTO(PropertyReport report) {
        this.id = report.getId();
        this.propertyId = report.getProperty().getId();
        this.propertyTitle = report.getProperty().getTitle();
        this.reason = report.getReason();
        this.description = report.getDescription();
        this.status = report.getStatus();
        this.adminNotes = report.getAdminNotes();
        this.createdAt = report.getCreatedAt();
        this.resolvedAt = report.getResolvedAt();

        if (report.getReporter() != null) {
            this.reporterId = report.getReporter().getId();
            this.reporterEmail = report.getReporter().getEmail();
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }

    public String getPropertyTitle() { return propertyTitle; }
    public void setPropertyTitle(String propertyTitle) { this.propertyTitle = propertyTitle; }

    public UUID getReporterId() { return reporterId; }
    public void setReporterId(UUID reporterId) { this.reporterId = reporterId; }

    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
}
