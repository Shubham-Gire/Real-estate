package com.example.realestate.crm.dto;

import com.example.realestate.crm.AgentProfile;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class AgentProfileDTO {
    private UUID id;
    private UUID userId;
    private String agentName;
    private String agentEmail;
    private String agentPhone;
    private String avatarUrl;
    private String licenseNumber;
    private String agencyName;
    private String specialties;
    private Integer experienceYears;
    private BigDecimal commissionRate;
    private BigDecimal rating;
    private Boolean verified;
    private String bio;
    private Instant createdAt;

    public AgentProfileDTO() {}

    public AgentProfileDTO(AgentProfile profile) {
        this.id = profile.getId();
        if (profile.getUser() != null) {
            this.userId = profile.getUser().getId();
            this.agentName = profile.getUser().getFirstName() + " " + profile.getUser().getLastName();
            this.agentEmail = profile.getUser().getEmail();
            this.agentPhone = profile.getUser().getPhone();
            this.avatarUrl = profile.getUser().getAvatarUrl();
        }
        this.licenseNumber = profile.getLicenseNumber();
        this.agencyName = profile.getAgencyName();
        this.specialties = profile.getSpecialties();
        this.experienceYears = profile.getExperienceYears();
        this.commissionRate = profile.getCommissionRate();
        this.rating = profile.getRating();
        this.verified = profile.getVerified();
        this.bio = profile.getBio();
        this.createdAt = profile.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }

    public String getAgentEmail() { return agentEmail; }
    public void setAgentEmail(String agentEmail) { this.agentEmail = agentEmail; }

    public String getAgentPhone() { return agentPhone; }
    public void setAgentPhone(String agentPhone) { this.agentPhone = agentPhone; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getAgencyName() { return agencyName; }
    public void setAgencyName(String agencyName) { this.agencyName = agencyName; }

    public String getSpecialties() { return specialties; }
    public void setSpecialties(String specialties) { this.specialties = specialties; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public BigDecimal getCommissionRate() { return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
