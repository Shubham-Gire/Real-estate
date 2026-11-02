package com.example.realestate.crm.dto;

import com.example.realestate.crm.CrmLead;
import com.example.realestate.crm.enums.LeadPriority;
import com.example.realestate.crm.enums.LeadSource;
import com.example.realestate.crm.enums.LeadStage;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class CrmLeadDTO {
    private UUID id;
    private UUID agentId;
    private UUID clientId;
    private UUID propertyId;
    private String propertyTitle;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private LeadStage stage;
    private LeadSource source;
    private BigDecimal budget;
    private LeadPriority priority;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public CrmLeadDTO() {}

    public CrmLeadDTO(CrmLead lead) {
        this.id = lead.getId();
        this.agentId = lead.getAgent() != null ? lead.getAgent().getId() : null;
        this.clientId = lead.getClient() != null ? lead.getClient().getId() : null;
        if (lead.getProperty() != null) {
            this.propertyId = lead.getProperty().getId();
            this.propertyTitle = lead.getProperty().getTitle();
        }
        this.contactName = lead.getContactName();
        this.contactEmail = lead.getContactEmail();
        this.contactPhone = lead.getContactPhone();
        this.stage = lead.getStage();
        this.source = lead.getSource();
        this.budget = lead.getBudget();
        this.priority = lead.getPriority();
        this.notes = lead.getNotes();
        this.createdAt = lead.getCreatedAt();
        this.updatedAt = lead.getUpdatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAgentId() { return agentId; }
    public void setAgentId(UUID agentId) { this.agentId = agentId; }

    public UUID getClientId() { return clientId; }
    public void setClientId(UUID clientId) { this.clientId = clientId; }

    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }

    public String getPropertyTitle() { return propertyTitle; }
    public void setPropertyTitle(String propertyTitle) { this.propertyTitle = propertyTitle; }

    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public LeadStage getStage() { return stage; }
    public void setStage(LeadStage stage) { this.stage = stage; }

    public LeadSource getSource() { return source; }
    public void setSource(LeadSource source) { this.source = source; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public LeadPriority getPriority() { return priority; }
    public void setPriority(LeadPriority priority) { this.priority = priority; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
