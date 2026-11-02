package com.example.realestate.crm.dto;

import com.example.realestate.crm.CrmContact;
import com.example.realestate.crm.enums.ContactType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class CrmContactDTO {
    private UUID id;
    private UUID agentId;
    private UUID userId;
    private String fullName;
    private String email;
    private String phone;
    private ContactType contactType;
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;
    private String preferredLocations;
    private String notes;
    private Instant lastContactedAt;
    private Instant createdAt;

    public CrmContactDTO() {}

    public CrmContactDTO(CrmContact contact) {
        this.id = contact.getId();
        this.agentId = contact.getAgent() != null ? contact.getAgent().getId() : null;
        this.userId = contact.getUser() != null ? contact.getUser().getId() : null;
        this.fullName = contact.getFullName();
        this.email = contact.getEmail();
        this.phone = contact.getPhone();
        this.contactType = contact.getContactType();
        this.budgetMin = contact.getBudgetMin();
        this.budgetMax = contact.getBudgetMax();
        this.preferredLocations = contact.getPreferredLocations();
        this.notes = contact.getNotes();
        this.lastContactedAt = contact.getLastContactedAt();
        this.createdAt = contact.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAgentId() { return agentId; }
    public void setAgentId(UUID agentId) { this.agentId = agentId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public ContactType getContactType() { return contactType; }
    public void setContactType(ContactType contactType) { this.contactType = contactType; }

    public BigDecimal getBudgetMin() { return budgetMin; }
    public void setBudgetMin(BigDecimal budgetMin) { this.budgetMin = budgetMin; }

    public BigDecimal getBudgetMax() { return budgetMax; }
    public void setBudgetMax(BigDecimal budgetMax) { this.budgetMax = budgetMax; }

    public String getPreferredLocations() { return preferredLocations; }
    public void setPreferredLocations(String preferredLocations) { this.preferredLocations = preferredLocations; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getLastContactedAt() { return lastContactedAt; }
    public void setLastContactedAt(Instant lastContactedAt) { this.lastContactedAt = lastContactedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
