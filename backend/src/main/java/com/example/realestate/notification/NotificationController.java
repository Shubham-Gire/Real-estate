package com.example.realestate.notification;

import com.example.realestate.common.response.ApiResponse;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.notification.dto.NotificationDTO;
import com.example.realestate.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "Endpoints for user alerts and message notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get user notifications")
    public ResponseEntity<ApiResponse<PagedResponse<NotificationDTO>>> getNotifications(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<NotificationDTO> response = notificationService.getUserNotifications(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notifications count for header badge")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        long count = notificationService.getUnreadCount(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(count));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark single notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        notificationService.markAsRead(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Marked as read"));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("All marked as read"));
    }
}
