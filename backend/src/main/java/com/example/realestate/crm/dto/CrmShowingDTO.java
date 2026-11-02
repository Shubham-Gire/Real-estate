package com.example.realestate.crm.dto;

import com.example.realestate.crm.CrmShowing;
import com.example.realestate.crm.enums.ShowingStatus;
import com.example.realestate.crm.enums.ShowingType;

import java.time.Instant;
import java.util.UUID;

public class CrmShowingDTO {
    private UUID id;
    private UUID agentId;
    private UUID propertyId;
    private String propertyTitle;
    private String propertyCity;
    private String propertyAddress;
    private String propertyImageUrl;
    private UUID clientId;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private Instant showingTime;
    private ShowingType showingType;
    private ShowingStatus status;
    private String notes;
    private String feedback;
    private Instant createdAt;

    public CrmShowingDTO() {}

    public CrmShowingDTO(CrmShowing showing) {
        this.id = showing.getId();
        this.agentId = showing.getAgent() != null ? showing.getAgent().getId() : null;
        if (showing.getProperty() != null) {
            this.propertyId = showing.getProperty().getId();
            this.propertyTitle = showing.getProperty().getTitle();
            this.propertyCity = showing.getProperty().getCity();
            this.propertyAddress = showing.getProperty().getAddress();
            if (showing.getProperty().getImages() != null && !showing.getProperty().getImages().isEmpty()) {
                this.propertyImageUrl = showing.getProperty().getImages().get(0).getImageUrl();
            }
        }
        this.clientId = showing.getClient() != null ? showing.getClient().getId() : null;
        this.clientName = showing.getClientName();
        this.clientEmail = showing.getClientEmail();
        this.clientPhone = showing.getClientPhone();
        this.showingTime = showing.getShowingTime();
        this.showingType = showing.getShowingType();
        this.status = showing.getStatus();
        this.notes = showing.getNotes();
        this.feedback = showing.getFeedback();
        this.createdAt = showing.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAgentId() { return agentId; }
    public void setAgentId(UUID agentId) { this.agentId = agentId; }

    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }

    public String getPropertyTitle() { return propertyTitle; }
    public void setPropertyTitle(String propertyTitle) { this.propertyTitle = propertyTitle; }

    public String getPropertyCity() { return propertyCity; }
    public void setPropertyCity(String propertyCity) { this.propertyCity = propertyCity; }

    public String getPropertyAddress() { return propertyAddress; }
    public void setPropertyAddress(String propertyAddress) { this.propertyAddress = propertyAddress; }

    public String getPropertyImageUrl() { return propertyImageUrl; }
    public void setPropertyImageUrl(String propertyImageUrl) { this.propertyImageUrl = propertyImageUrl; }

    public UUID getClientId() { return clientId; }
    public void setClientId(UUID clientId) { this.clientId = clientId; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }

    public Instant getShowingTime() { return showingTime; }
    public void setShowingTime(Instant showingTime) { this.showingTime = showingTime; }

    public ShowingType getShowingType() { return showingType; }
    public void setShowingType(ShowingType showingType) { this.showingType = showingType; }

    public ShowingStatus getStatus() { return status; }
    public void setStatus(ShowingStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
