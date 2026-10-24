package com.example.realestate.user.dto;

import com.example.realestate.user.Role;
import com.example.realestate.user.User;
import com.example.realestate.user.UserStatus;
import java.time.Instant;
import java.util.UUID;

public class UserSummaryDTO {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Role role;
    private UserStatus status;
    private String avatarUrl;
    private String agencyName;
    private String licenseNumber;
    private String bio;
    private Instant createdAt;

    public UserSummaryDTO() {}

    public UserSummaryDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.phone = user.getPhone();
        this.role = user.getRole();
        this.status = user.getStatus();
        this.avatarUrl = user.getAvatarUrl();
        this.agencyName = user.getAgencyName();
        this.licenseNumber = user.getLicenseNumber();
        this.bio = user.getBio();
        this.createdAt = user.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getAgencyName() { return agencyName; }
    public void setAgencyName(String agencyName) { this.agencyName = agencyName; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
