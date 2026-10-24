package com.example.realestate.admin.dto;

public class AdminDashboardStatsDTO {
    private long totalUsers;
    private long totalAgents;
    private long totalProperties;
    private long publishedProperties;
    private long pendingProperties;
    private long rejectedProperties;
    private long suspendedProperties;
    private long totalInquiries;
    private long pendingReports;

    public AdminDashboardStatsDTO() {}

    public AdminDashboardStatsDTO(long totalUsers, long totalAgents, long totalProperties, long publishedProperties,
                                  long pendingProperties, long rejectedProperties, long suspendedProperties,
                                  long totalInquiries, long pendingReports) {
        this.totalUsers = totalUsers;
        this.totalAgents = totalAgents;
        this.totalProperties = totalProperties;
        this.publishedProperties = publishedProperties;
        this.pendingProperties = pendingProperties;
        this.rejectedProperties = rejectedProperties;
        this.suspendedProperties = suspendedProperties;
        this.totalInquiries = totalInquiries;
        this.pendingReports = pendingReports;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalAgents() { return totalAgents; }
    public void setTotalAgents(long totalAgents) { this.totalAgents = totalAgents; }

    public long getTotalProperties() { return totalProperties; }
    public void setTotalProperties(long totalProperties) { this.totalProperties = totalProperties; }

    public long getPublishedProperties() { return publishedProperties; }
    public void setPublishedProperties(long publishedProperties) { this.publishedProperties = publishedProperties; }

    public long getPendingProperties() { return pendingProperties; }
    public void setPendingProperties(long pendingProperties) { this.pendingProperties = pendingProperties; }

    public long getRejectedProperties() { return rejectedProperties; }
    public void setRejectedProperties(long rejectedProperties) { this.rejectedProperties = rejectedProperties; }

    public long getSuspendedProperties() { return suspendedProperties; }
    public void setSuspendedProperties(long suspendedProperties) { this.suspendedProperties = suspendedProperties; }

    public long getTotalInquiries() { return totalInquiries; }
    public void setTotalInquiries(long totalInquiries) { this.totalInquiries = totalInquiries; }

    public long getPendingReports() { return pendingReports; }
    public void setPendingReports(long pendingReports) { this.pendingReports = pendingReports; }
}
