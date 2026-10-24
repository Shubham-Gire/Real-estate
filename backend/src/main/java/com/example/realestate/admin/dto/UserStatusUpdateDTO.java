package com.example.realestate.admin.dto;

import com.example.realestate.user.UserStatus;
import jakarta.validation.constraints.NotNull;

public class UserStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private UserStatus status;

    public UserStatusUpdateDTO() {}

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
}
