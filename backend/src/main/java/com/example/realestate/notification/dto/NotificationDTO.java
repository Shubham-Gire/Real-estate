package com.example.realestate.notification.dto;

import com.example.realestate.notification.Notification;
import java.time.Instant;
import java.util.UUID;

public class NotificationDTO {
    private UUID id;
    private String title;
    private String message;
    private String type;
    private String linkUrl;
    private boolean isRead;
    private Instant createdAt;

    public NotificationDTO() {}

    public NotificationDTO(Notification notification) {
        this.id = notification.getId();
        this.title = notification.getTitle();
        this.message = notification.getMessage();
        this.type = notification.getType();
        this.linkUrl = notification.getLinkUrl();
        this.isRead = notification.isRead();
        this.createdAt = notification.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLinkUrl() { return linkUrl; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
