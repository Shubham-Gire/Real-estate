package com.example.realestate.crm.dto;

import com.example.realestate.crm.enums.LeadStage;
import jakarta.validation.constraints.NotNull;

public class CrmLeadStageUpdateDTO {

    @NotNull(message = "Stage is required")
    private LeadStage stage;

    private String notes;

    public CrmLeadStageUpdateDTO() {}

    public LeadStage getStage() { return stage; }
    public void setStage(LeadStage stage) { this.stage = stage; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
