package com.example.realestate.admin.dto;

public class ModerationActionDTO {
    private String reason;

    public ModerationActionDTO() {}

    public ModerationActionDTO(String reason) {
        this.reason = reason;
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
