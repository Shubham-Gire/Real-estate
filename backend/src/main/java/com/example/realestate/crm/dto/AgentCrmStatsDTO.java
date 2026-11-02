package com.example.realestate.crm.dto;

import java.math.BigDecimal;
import java.util.Map;

public class AgentCrmStatsDTO {
    private long totalLeads;
    private BigDecimal activePipelineBudget;
    private long activeDealsCount;
    private BigDecimal activeDealsValue;
    private BigDecimal closedCommissionYTD;
    private BigDecimal projectedCommission;
    private long upcomingShowingsCount;
    private long totalContactsCount;
    private Map<String, Long> leadsByStage;
    private Map<String, Long> dealsByStage;

    public AgentCrmStatsDTO() {}

    public AgentCrmStatsDTO(
            long totalLeads,
            BigDecimal activePipelineBudget,
            long activeDealsCount,
            BigDecimal activeDealsValue,
            BigDecimal closedCommissionYTD,
            BigDecimal projectedCommission,
            long upcomingShowingsCount,
            long totalContactsCount,
            Map<String, Long> leadsByStage,
            Map<String, Long> dealsByStage) {
        this.totalLeads = totalLeads;
        this.activePipelineBudget = activePipelineBudget;
        this.activeDealsCount = activeDealsCount;
        this.activeDealsValue = activeDealsValue;
        this.closedCommissionYTD = closedCommissionYTD;
        this.projectedCommission = projectedCommission;
        this.upcomingShowingsCount = upcomingShowingsCount;
        this.totalContactsCount = totalContactsCount;
        this.leadsByStage = leadsByStage;
        this.dealsByStage = dealsByStage;
    }

    public long getTotalLeads() { return totalLeads; }
    public void setTotalLeads(long totalLeads) { this.totalLeads = totalLeads; }

    public BigDecimal getActivePipelineBudget() { return activePipelineBudget; }
    public void setActivePipelineBudget(BigDecimal activePipelineBudget) { this.activePipelineBudget = activePipelineBudget; }

    public long getActiveDealsCount() { return activeDealsCount; }
    public void setActiveDealsCount(long activeDealsCount) { this.activeDealsCount = activeDealsCount; }

    public BigDecimal getActiveDealsValue() { return activeDealsValue; }
    public void setActiveDealsValue(BigDecimal activeDealsValue) { this.activeDealsValue = activeDealsValue; }

    public BigDecimal getClosedCommissionYTD() { return closedCommissionYTD; }
    public void setClosedCommissionYTD(BigDecimal closedCommissionYTD) { this.closedCommissionYTD = closedCommissionYTD; }

    public BigDecimal getProjectedCommission() { return projectedCommission; }
    public void setProjectedCommission(BigDecimal projectedCommission) { this.projectedCommission = projectedCommission; }

    public long getUpcomingShowingsCount() { return upcomingShowingsCount; }
    public void setUpcomingShowingsCount(long upcomingShowingsCount) { this.upcomingShowingsCount = upcomingShowingsCount; }

    public long getTotalContactsCount() { return totalContactsCount; }
    public void setTotalContactsCount(long totalContactsCount) { this.totalContactsCount = totalContactsCount; }

    public Map<String, Long> getLeadsByStage() { return leadsByStage; }
    public void setLeadsByStage(Map<String, Long> leadsByStage) { this.leadsByStage = leadsByStage; }

    public Map<String, Long> getDealsByStage() { return dealsByStage; }
    public void setDealsByStage(Map<String, Long> dealsByStage) { this.dealsByStage = dealsByStage; }
}
