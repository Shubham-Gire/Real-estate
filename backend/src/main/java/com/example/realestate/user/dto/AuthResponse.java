package com.example.realestate.user.dto;

import com.example.realestate.user.Role;
import com.example.realestate.user.UserStatus;
import java.util.UUID;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private UserStatus status;
    private String avatarUrl;
    private String agencyName;

    public AuthResponse() {}

    public AuthResponse(String token, UUID id, String email, String firstName, String lastName, Role role, UserStatus status, String avatarUrl, String agencyName) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.status = status;
        this.avatarUrl = avatarUrl;
        this.agencyName = agencyName;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getAgencyName() { return agencyName; }
    public void setAgencyName(String agencyName) { this.agencyName = agencyName; }
}
