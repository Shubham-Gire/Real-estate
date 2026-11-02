package com.example.realestate.crm.dto;

import com.example.realestate.crm.CrmDeal;
import com.example.realestate.crm.enums.DealStage;
import com.example.realestate.crm.enums.DealStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class CrmDealDTO {
    private UUID id;
    private UUID agentId;
    private UUID leadId;
    private UUID propertyId;
    private String propertyTitle;
    private String dealName;
    private String clientName;
    private BigDecimal dealValue;
    private BigDecimal commissionRate;
    private BigDecimal commissionAmount;
    private DealStatus status;
    private DealStage stage;
    private LocalDate expectedCloseDate;
    private Instant closedAt;
    private Instant createdAt;

    public CrmDealDTO() {}

    public CrmDealDTO(CrmDeal deal) {
        this.id = deal.getId();
        this.agentId = deal.getAgent() != null ? deal.getAgent().getId() : null;
        this.leadId = deal.getLead() != null ? deal.getLead().getId() : null;
        if (deal.getProperty() != null) {
            this.propertyId = deal.getProperty().getId();
            this.propertyTitle = deal.getProperty().getTitle();
        }
        this.dealName = deal.getDealName();
        this.clientName = deal.getClientName();
        this.dealValue = deal.getDealValue();
        this.commissionRate = deal.getCommissionRate();
        this.commissionAmount = deal.getCommissionAmount();
        this.status = deal.getStatus();
        this.stage = deal.getStage();
        this.expectedCloseDate = deal.getExpectedCloseDate();
        this.closedAt = deal.getClosedAt();
        this.createdAt = deal.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAgentId() { return agentId; }
    public void setAgentId(UUID agentId) { this.agentId = agentId; }

    public UUID getLeadId() { return leadId; }
    public void setLeadId(UUID leadId) { this.leadId = leadId; }

    public UUID getPropertyId() { return propertyId; }
    public void setPropertyId(UUID propertyId) { this.propertyId = propertyId; }

    public String getPropertyTitle() { return propertyTitle; }
    public void setPropertyTitle(String propertyTitle) { this.propertyTitle = propertyTitle; }

    public String getDealName() { return dealName; }
    public void setDealName(String dealName) { this.dealName = dealName; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public BigDecimal getDealValue() { return dealValue; }
    public void setDealValue(BigDecimal dealValue) { this.dealValue = dealValue; }

    public BigDecimal getCommissionRate() { return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }

    public BigDecimal getCommissionAmount() { return commissionAmount; }
    public void setCommissionAmount(BigDecimal commissionAmount) { this.commissionAmount = commissionAmount; }

    public DealStatus getStatus() { return status; }
    public void setStatus(DealStatus status) { this.status = status; }

    public DealStage getStage() { return stage; }
    public void setStage(DealStage stage) { this.stage = stage; }

    public LocalDate getExpectedCloseDate() { return expectedCloseDate; }
    public void setExpectedCloseDate(LocalDate expectedCloseDate) { this.expectedCloseDate = expectedCloseDate; }

    public Instant getClosedAt() { return closedAt; }
    public void setClosedAt(Instant closedAt) { this.closedAt = closedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
