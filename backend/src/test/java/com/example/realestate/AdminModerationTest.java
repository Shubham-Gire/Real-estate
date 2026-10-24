package com.example.realestate;

import com.example.realestate.admin.AdminDashboardService;
import com.example.realestate.admin.dto.ModerationActionDTO;
import com.example.realestate.admin.dto.UserRoleUpdateDTO;
import com.example.realestate.common.audit.AuditLogRepository;
import com.example.realestate.common.audit.AuditLogService;
import com.example.realestate.common.exception.BadRequestException;
import com.example.realestate.inquiry.InquiryRepository;
import com.example.realestate.notification.NotificationService;
import com.example.realestate.property.Property;
import com.example.realestate.property.PropertyRepository;
import com.example.realestate.property.PropertyStatus;
import com.example.realestate.report.PropertyReportRepository;
import com.example.realestate.security.UserPrincipal;
import com.example.realestate.user.Role;
import com.example.realestate.user.User;
import com.example.realestate.user.UserRepository;
import com.example.realestate.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminModerationTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private InquiryRepository inquiryRepository;
    @Mock
    private PropertyReportRepository propertyReportRepository;
    @Mock
    private AuditLogRepository auditLogRepository;
    @Mock
    private AuditLogService auditLogService;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AdminDashboardService adminDashboardService;

    private UserPrincipal adminPrincipal;
    private User adminUser;

    @BeforeEach
    void setUp() {
        UUID adminId = UUID.randomUUID();
        adminUser = new User("admin@estatehub.com", "hash", "Admin", "User", Role.ROLE_ADMIN);
        adminUser.setId(adminId);

        adminPrincipal = new UserPrincipal(
                adminId, "admin@estatehub.com", "hash", Role.ROLE_ADMIN, UserStatus.ACTIVE,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
    }

    @Test
    void approveProperty_TransitionsToPublished() {
        UUID propertyId = UUID.randomUUID();
        User owner = new User("owner@example.com", "hash", "Dave", "O", Role.ROLE_USER);
        Property property = new Property();
        property.setId(propertyId);
        property.setTitle("Bay Area House");
        property.setOwner(owner);
        property.setStatus(PropertyStatus.PENDING_REVIEW);

        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        when(userRepository.findById(adminPrincipal.getId())).thenReturn(Optional.of(adminUser));

        adminDashboardService.approveProperty(adminPrincipal, propertyId);

        assertEquals(PropertyStatus.PUBLISHED, property.getStatus());
        assertNull(property.getRejectionReason());
        verify(propertyRepository, times(1)).save(property);
        verify(notificationService, times(1)).createNotification(eq(owner), any(), any(), eq("PROPERTY_APPROVED"), any());
    }

    @Test
    void rejectProperty_WithoutReason_ThrowsBadRequestException() {
        UUID propertyId = UUID.randomUUID();
        ModerationActionDTO dto = new ModerationActionDTO(""); // Empty reason

        assertThrows(BadRequestException.class, () -> adminDashboardService.rejectProperty(adminPrincipal, propertyId, dto));
        verify(propertyRepository, never()).save(any());
    }

    @Test
    void demoteLastAdmin_ThrowsBadRequestException() {
        UUID adminId = UUID.randomUUID();
        User soleAdmin = new User("soleadmin@estatehub.com", "hash", "Sole", "Admin", Role.ROLE_ADMIN);
        soleAdmin.setId(adminId);

        when(userRepository.findById(adminId)).thenReturn(Optional.of(soleAdmin));
        when(userRepository.countByRole(Role.ROLE_ADMIN)).thenReturn(1L);

        UserRoleUpdateDTO dto = new UserRoleUpdateDTO();
        dto.setRole(Role.ROLE_USER);

        assertThrows(BadRequestException.class, () -> adminDashboardService.updateUserRole(adminPrincipal, adminId, dto));
        verify(userRepository, never()).save(any());
    }
}
