package com.example.realestate.crm.dto;

import com.example.realestate.crm.enums.DealStage;
import com.example.realestate.crm.enums.DealStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class CrmDealCreateDTO {

    private UUID leadId;
    private UUID propertyId;

    @NotBlank(message = "Deal name is required")
    private String dealName;

    @NotBlank(message = "Client name is required")
    private String clientName;

    @NotNull(message = "Deal value is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Deal value must be greater than zero")
    private BigDecimal dealValue;

    private BigDecimal commissionRate = new BigDecimal("3.00");
    private DealStatus status = DealStatus.ACTIVE;
    private DealStage stage = DealStage.OFFER_SUBMITTED;
    private LocalDate expectedCloseDate;

    public CrmDealCreateDTO() {}

    public UUID getLeadId() { return leadId; }
    public void setLeadId(UUID leadId) { this.leadId = leadId; }

    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }

    public String getDealName() { return dealName; }
    public void setDealName(String dealName) { this.dealName = dealName; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public BigDecimal getDealValue() { return dealValue; }
    public void setDealValue(BigDecimal dealValue) { this.dealValue = dealValue; }

    public BigDecimal getCommissionRate() { return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }

    public DealStatus getStatus() { return status; }
    public void setStatus(DealStatus status) { this.status = status; }

    public DealStage getStage() { return stage; }
    public void setStage(DealStage stage) { this.stage = stage; }

    public LocalDate getExpectedCloseDate() { return expectedCloseDate; }
    public void setExpectedCloseDate(LocalDate expectedCloseDate) { this.expectedCloseDate = expectedCloseDate; }
}
