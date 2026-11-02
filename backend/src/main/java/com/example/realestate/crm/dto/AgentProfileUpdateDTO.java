package com.example.realestate.crm.dto;

import java.math.BigDecimal;

public class AgentProfileUpdateDTO {
    private String licenseNumber;
    private String agencyName;
    private String specialties;
    private Integer experienceYears;
    private BigDecimal commissionRate;
    private String bio;

    public AgentProfileUpdateDTO() {}

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

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
