package com.example.realestate.admin;

import com.example.realestate.admin.dto.AdminDashboardStatsDTO;
import com.example.realestate.admin.dto.ModerationActionDTO;
import com.example.realestate.admin.dto.UserRoleUpdateDTO;
import com.example.realestate.admin.dto.UserStatusUpdateDTO;
import com.example.realestate.common.audit.AuditLog;
import com.example.realestate.common.response.ApiResponse;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.property.dto.PropertyFilterDTO;
import com.example.realestate.property.dto.PropertySummaryDTO;
import com.example.realestate.report.PropertyReportService;
import com.example.realestate.report.ReportStatus;
import com.example.realestate.report.dto.PropertyReportDTO;
import com.example.realestate.security.UserPrincipal;
import com.example.realestate.user.Role;
import com.example.realestate.user.UserStatus;
import com.example.realestate.user.dto.UserSummaryDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Administrator", description = "Privileged moderation, user management, and platform analytics")
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final PropertyReportService propertyReportService;

    public AdminController(AdminDashboardService adminDashboardService, PropertyReportService propertyReportService) {
        this.adminDashboardService = adminDashboardService;
        this.propertyReportService = propertyReportService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregated real-time platform statistics")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDTO>> getDashboardStats() {
        AdminDashboardStatsDTO stats = adminDashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/properties")
    @Operation(summary = "List all properties across all statuses with filtering and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<PropertySummaryDTO>>> getAllProperties(
            @ModelAttribute PropertyFilterDTO filter,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<PropertySummaryDTO> response = adminDashboardService.getAllProperties(filter, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/properties/{id}/approve")
    @Operation(summary = "Approve property listing to PUBLISHED status")
    public ResponseEntity<ApiResponse<Void>> approveProperty(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable UUID id) {
        adminDashboardService.approveProperty(admin, id);
        return ResponseEntity.ok(ApiResponse.ok("Property approved and published"));
    }

    @PostMapping("/properties/{id}/reject")
    @Operation(summary = "Reject property listing with mandatory reason")
    public ResponseEntity<ApiResponse<Void>> rejectProperty(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable UUID id,
            @RequestBody ModerationActionDTO dto) {
        adminDashboardService.rejectProperty(admin, id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Property rejected with reason"));
    }

    @PostMapping("/properties/{id}/suspend")
    @Operation(summary = "Suspend a property listing")
    public ResponseEntity<ApiResponse<Void>> suspendProperty(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable UUID id,
            @RequestBody(required = false) ModerationActionDTO dto) {
        adminDashboardService.suspendProperty(admin, id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Property suspended"));
    }

    @PostMapping("/properties/{id}/restore")
    @Operation(summary = "Restore a suspended property listing to PUBLISHED")
    public ResponseEntity<ApiResponse<Void>> restoreProperty(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable UUID id) {
        adminDashboardService.restoreProperty(admin, id);
        return ResponseEntity.ok(ApiResponse.ok("Property restored to published"));
    }

    @GetMapping("/users")
    @Operation(summary = "Search and list users with filters")
    public ResponseEntity<ApiResponse<PagedResponse<UserSummaryDTO>>> searchUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) UserStatus status,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<UserSummaryDTO> response = adminDashboardService.searchUsers(query, role, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Toggle user status (ACTIVE / SUSPENDED)")
    public ResponseEntity<ApiResponse<Void>> updateUserStatus(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable UUID id,
            @Valid @RequestBody UserStatusUpdateDTO dto) {
        adminDashboardService.updateUserStatus(admin, id, dto);
        return ResponseEntity.ok(ApiResponse.ok("User status updated"));
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Update user role (ROLE_USER, ROLE_AGENT, ROLE_ADMIN)")
    public ResponseEntity<ApiResponse<Void>> updateUserRole(
            @AuthenticationPrincipal UserPrincipal admin,
            @PathVariable UUID id,
            @Valid @RequestBody UserRoleUpdateDTO dto) {
        adminDashboardService.updateUserRole(admin, id, dto);
        return ResponseEntity.ok(ApiResponse.ok("User role updated"));
    }

    @GetMapping("/reports")
    @Operation(summary = "View user-submitted property abuse reports")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyReportDTO>>> getReports(
            @RequestParam(required = false) ReportStatus status,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<PropertyReportDTO> response = propertyReportService.getReports(status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/reports/{id}/resolve")
    @Operation(summary = "Resolve or dismiss a property abuse report")
    public ResponseEntity<ApiResponse<PropertyReportDTO>> resolveReport(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        ReportStatus status = ReportStatus.valueOf(body.get("status"));
        String adminNotes = body.get("adminNotes");
        PropertyReportDTO response = propertyReportService.resolveReport(id, status, adminNotes);
        return ResponseEntity.ok(ApiResponse.ok("Report status updated", response));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Query immutable system audit logs")
    public ResponseEntity<ApiResponse<PagedResponse<AuditLog>>> getAuditLogs(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<AuditLog> response = adminDashboardService.getAuditLogs(pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
