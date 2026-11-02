package com.example.realestate.crm.dto;

import com.example.realestate.crm.enums.LeadPriority;
import com.example.realestate.crm.enums.LeadSource;
import com.example.realestate.crm.enums.LeadStage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.UUID;

public class CrmLeadCreateDTO {

    private UUID propertyId;
    private UUID clientId;

    @NotBlank(message = "Contact name is required")
    private String contactName;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid email format")
    private String contactEmail;

    private String contactPhone;
    private LeadStage stage = LeadStage.NEW_LEAD;
    private LeadSource source = LeadSource.WEBSITE;
    private BigDecimal budget;
    private LeadPriority priority = LeadPriority.WARM;
    private String notes;

    public CrmLeadCreateDTO() {}

    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }

    public UUID getClientId() { return clientId; }
    public void setClientId(UUID clientId) { this.clientId = clientId; }

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
}
