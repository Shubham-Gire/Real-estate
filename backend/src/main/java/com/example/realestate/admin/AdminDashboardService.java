package com.example.realestate.admin;

import com.example.realestate.admin.dto.AdminDashboardStatsDTO;
import com.example.realestate.admin.dto.ModerationActionDTO;
import com.example.realestate.admin.dto.UserRoleUpdateDTO;
import com.example.realestate.admin.dto.UserStatusUpdateDTO;
import com.example.realestate.common.audit.AuditLog;
import com.example.realestate.common.audit.AuditLogRepository;
import com.example.realestate.common.audit.AuditLogService;
import com.example.realestate.common.exception.BadRequestException;
import com.example.realestate.common.exception.ResourceNotFoundException;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.inquiry.InquiryRepository;
import com.example.realestate.notification.NotificationService;
import com.example.realestate.property.Property;
import com.example.realestate.property.PropertyRepository;
import com.example.realestate.property.PropertySpecification;
import com.example.realestate.property.PropertyStatus;
import com.example.realestate.property.dto.PropertyFilterDTO;
import com.example.realestate.property.dto.PropertySummaryDTO;
import com.example.realestate.report.PropertyReportRepository;
import com.example.realestate.report.ReportStatus;
import com.example.realestate.security.UserPrincipal;
import com.example.realestate.user.Role;
import com.example.realestate.user.User;
import com.example.realestate.user.UserRepository;
import com.example.realestate.user.UserStatus;
import com.example.realestate.user.dto.UserSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final InquiryRepository inquiryRepository;
    private final PropertyReportRepository propertyReportRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public AdminDashboardService(
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            InquiryRepository inquiryRepository,
            PropertyReportRepository propertyReportRepository,
            AuditLogRepository auditLogRepository,
            AuditLogService auditLogService,
            NotificationService notificationService) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.inquiryRepository = inquiryRepository;
        this.propertyReportRepository = propertyReportRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalAgents = userRepository.countByRole(Role.ROLE_AGENT);
        long totalProperties = propertyRepository.count();
        long published = propertyRepository.countByStatus(PropertyStatus.PUBLISHED);
        long pending = propertyRepository.countByStatus(PropertyStatus.PENDING_REVIEW);
        long rejected = propertyRepository.countByStatus(PropertyStatus.REJECTED);
        long suspended = propertyRepository.countByStatus(PropertyStatus.SUSPENDED);
        long inquiries = inquiryRepository.count();
        long pendingReports = propertyReportRepository.countByStatus(ReportStatus.PENDING);

        return new AdminDashboardStatsDTO(
                totalUsers, totalAgents, totalProperties, published,
                pending, rejected, suspended, inquiries, pendingReports
        );
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertySummaryDTO> getAllProperties(PropertyFilterDTO filter, Pageable pageable) {
        Specification<Property> spec = PropertySpecification.buildSpecification(filter, null, null);
        Page<Property> page = propertyRepository.findAll(spec, pageable);
        List<PropertySummaryDTO> content = page.getContent().stream()
                .map(PropertySummaryDTO::new)
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
    public void approveProperty(UserPrincipal admin, UUID propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        User adminUser = userRepository.findById(admin.getId()).orElse(null);
        property.setStatus(PropertyStatus.PUBLISHED);
        property.setRejectionReason(null);
        property.setModeratedBy(adminUser);
        property.setModeratedAt(Instant.now());

        propertyRepository.save(property);

        notificationService.createNotification(
                property.getOwner(),
                "Listing Approved!",
                "Your property \"" + property.getTitle() + "\" has been approved and is now live on the marketplace.",
                "PROPERTY_APPROVED",
                "/properties/" + property.getId()
        );

        auditLogService.record(
                admin.getId(),
                admin.getUsername(),
                "PROPERTY_APPROVED",
                "PROPERTY",
                property.getId().toString(),
                "Approved listing: " + property.getTitle(),
                null
        );
    }

    @Transactional
    public void rejectProperty(UserPrincipal admin, UUID propertyId, ModerationActionDTO dto) {
        if (dto.getReason() == null || dto.getReason().trim().isBlank()) {
            throw new BadRequestException("A mandatory rejection reason must be provided to the owner.");
        }

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        User adminUser = userRepository.findById(admin.getId()).orElse(null);
        property.setStatus(PropertyStatus.REJECTED);
        property.setRejectionReason(dto.getReason().trim());
        property.setModeratedBy(adminUser);
        property.setModeratedAt(Instant.now());

        propertyRepository.save(property);

        notificationService.createNotification(
                property.getOwner(),
                "Listing Rejected",
                "Your listing \"" + property.getTitle() + "\" was rejected. Reason: " + dto.getReason(),
                "PROPERTY_REJECTED",
                "/dashboard/properties"
        );

        auditLogService.record(
                admin.getId(),
                admin.getUsername(),
                "PROPERTY_REJECTED",
                "PROPERTY",
                property.getId().toString(),
                "Rejected listing: " + property.getTitle() + " Reason: " + dto.getReason(),
                null
        );
    }

    @Transactional
    public void suspendProperty(UserPrincipal admin, UUID propertyId, ModerationActionDTO dto) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        User adminUser = userRepository.findById(admin.getId()).orElse(null);
        property.setStatus(PropertyStatus.SUSPENDED);
        property.setRejectionReason(dto != null ? dto.getReason() : "Suspended by platform administrator");
        property.setModeratedBy(adminUser);
        property.setModeratedAt(Instant.now());

        propertyRepository.save(property);

        auditLogService.record(
                admin.getId(),
                admin.getUsername(),
                "PROPERTY_SUSPENDED",
                "PROPERTY",
                property.getId().toString(),
                "Suspended listing: " + property.getTitle(),
                null
        );
    }

    @Transactional
    public void restoreProperty(UserPrincipal admin, UUID propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        User adminUser = userRepository.findById(admin.getId()).orElse(null);
        property.setStatus(PropertyStatus.PUBLISHED);
        property.setModeratedBy(adminUser);
        property.setModeratedAt(Instant.now());

        propertyRepository.save(property);

        auditLogService.record(
                admin.getId(),
                admin.getUsername(),
                "PROPERTY_RESTORED",
                "PROPERTY",
                property.getId().toString(),
                "Restored listing to published: " + property.getTitle(),
                null
        );
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserSummaryDTO> searchUsers(String query, Role role, UserStatus status, Pageable pageable) {
        Page<User> page = userRepository.searchUsers(query, role, status, pageable);
        List<UserSummaryDTO> content = page.getContent().stream()
                .map(UserSummaryDTO::new)
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
    public void updateUserStatus(UserPrincipal admin, UUID userId, UserStatusUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Safeguard: Cannot suspend the last admin or own admin account
        if (user.getRole() == Role.ROLE_ADMIN && dto.getStatus() == UserStatus.SUSPENDED) {
            long activeAdmins = userRepository.countByRole(Role.ROLE_ADMIN);
            if (activeAdmins <= 1 || user.getId().equals(admin.getId())) {
                throw new BadRequestException("Cannot suspend the only active administrator or self.");
            }
        }

        user.setStatus(dto.getStatus());
        userRepository.save(user);

        auditLogService.record(
                admin.getId(),
                admin.getUsername(),
                "USER_STATUS_UPDATED",
                "USER",
                user.getId().toString(),
                "User " + user.getEmail() + " status set to " + dto.getStatus(),
                null
        );
    }

    @Transactional
    public void updateUserRole(UserPrincipal admin, UUID userId, UserRoleUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Safeguard: Cannot demote the last admin
        if (user.getRole() == Role.ROLE_ADMIN && dto.getRole() != Role.ROLE_ADMIN) {
            long adminCount = userRepository.countByRole(Role.ROLE_ADMIN);
            if (adminCount <= 1) {
                throw new BadRequestException("Cannot demote the platform's last administrator.");
            }
        }

        user.setRole(dto.getRole());
        userRepository.save(user);

        auditLogService.record(
                admin.getId(),
                admin.getUsername(),
                "USER_ROLE_UPDATED",
                "USER",
                user.getId().toString(),
                "User " + user.getEmail() + " role set to " + dto.getRole(),
                null
        );
    }

    @Transactional(readOnly = true)
    public PagedResponse<AuditLog> getAuditLogs(Pageable pageable) {
        Page<AuditLog> page = auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
