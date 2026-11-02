package com.example.realestate.crm.dto;

import com.example.realestate.crm.enums.ShowingStatus;
import jakarta.validation.constraints.NotNull;

public class CrmShowingStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private ShowingStatus status;

    private String notes;
    private String feedback;

    public CrmShowingStatusUpdateDTO() {}

    public ShowingStatus getStatus() { return status; }
    public void setStatus(ShowingStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
