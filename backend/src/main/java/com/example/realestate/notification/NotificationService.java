package com.example.realestate.notification;

import com.example.realestate.common.exception.ResourceNotFoundException;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.notification.dto.NotificationDTO;
import com.example.realestate.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public void createNotification(User user, String title, String message, String type, String linkUrl) {
        Notification notification = new Notification(user, title, message, type, linkUrl);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public PagedResponse<NotificationDTO> getUserNotifications(UUID userId, Pageable pageable) {
        Page<Notification> page = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        List<NotificationDTO> content = page.getContent().stream()
                .map(NotificationDTO::new)
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

    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(UUID userId, UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (notification.getUser().getId().equals(userId)) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        Page<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
