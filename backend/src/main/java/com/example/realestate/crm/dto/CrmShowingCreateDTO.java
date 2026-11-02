package com.example.realestate.crm.dto;

import com.example.realestate.crm.enums.ShowingType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

public class CrmShowingCreateDTO {

    @NotNull(message = "Property ID is required")
    private UUID propertyId;

    @NotBlank(message = "Your name is required")
    private String clientName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String clientEmail;

    private String clientPhone;

    @NotNull(message = "Showing time is required")
    private Instant showingTime;

    private ShowingType showingType = ShowingType.IN_PERSON;
    private String notes;

    public CrmShowingCreateDTO() {}

    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }

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

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
