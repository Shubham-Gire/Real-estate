package com.example.realestate.inquiry.dto;

import com.example.realestate.inquiry.InquiryStatus;
import jakarta.validation.constraints.NotNull;

public class InquiryStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private InquiryStatus status;

    private String notes;

    public InquiryStatusUpdateDTO() {}

    public InquiryStatus getStatus() { return status; }
    public void setStatus(InquiryStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
