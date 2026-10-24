package com.example.realestate.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserProfileUpdateDTO {

    @NotBlank(message = "First name is required")
    @Size(max = 80)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 80)
    private String lastName;

    private String phone;
    private String avatarUrl;
    private String agencyName;
    private String licenseNumber;
    private String bio;

    public UserProfileUpdateDTO() {}

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getAgencyName() { return agencyName; }
    public void setAgencyName(String agencyName) { this.agencyName = agencyName; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
