package com.example.realestate.inquiry.dto;

import com.example.realestate.inquiry.Inquiry;
import com.example.realestate.inquiry.InquiryStatus;

import java.time.Instant;
import java.util.UUID;

public class InquiryResponseDTO {
    private UUID id;
    private UUID propertyId;
    private String propertyTitle;
    private String propertyCity;
    private UUID senderId;
    private UUID recipientId;
    private String name;
    private String email;
    private String phone;
    private String message;
    private InquiryStatus status;
    private String notes;
    private Instant createdAt;

    public InquiryResponseDTO() {}

    public InquiryResponseDTO(Inquiry inquiry) {
        this.id = inquiry.getId();
        this.propertyId = inquiry.getProperty().getId();
        this.propertyTitle = inquiry.getProperty().getTitle();
        this.propertyCity = inquiry.getProperty().getCity();
        this.recipientId = inquiry.getRecipient().getId();
        this.name = inquiry.getName();
        this.email = inquiry.getEmail();
        this.phone = inquiry.getPhone();
        this.message = inquiry.getMessage();
        this.status = inquiry.getStatus();
        this.notes = inquiry.getNotes();
        this.createdAt = inquiry.getCreatedAt();

        if (inquiry.getSender() != null) {
            this.senderId = inquiry.getSender().getId();
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }

    public String getPropertyTitle() { return propertyTitle; }
    public void setPropertyTitle(String propertyTitle) { this.propertyTitle = propertyTitle; }

    public String getPropertyCity() { return propertyCity; }
    public void setPropertyCity(String propertyCity) { this.propertyCity = propertyCity; }

    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }

    public UUID getRecipientId() { return recipientId; }
    public void setRecipientId(UUID recipientId) { this.recipientId = recipientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public InquiryStatus getStatus() { return status; }
    public void setStatus(InquiryStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
