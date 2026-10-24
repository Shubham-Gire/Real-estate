package com.example.realestate.property.dto;

import com.example.realestate.property.PropertyStatus;
import jakarta.validation.constraints.NotNull;

public class PropertyStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private PropertyStatus status;

    private String reason;

    public PropertyStatusUpdateDTO() {}

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
