package com.example.realestate.admin.dto;

import com.example.realestate.user.Role;
import jakarta.validation.constraints.NotNull;

public class UserRoleUpdateDTO {

    @NotNull(message = "Role is required")
    private Role role;

    public UserRoleUpdateDTO() {}

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
