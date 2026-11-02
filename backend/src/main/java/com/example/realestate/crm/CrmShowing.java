package com.example.realestate.crm;

import com.example.realestate.crm.enums.ShowingStatus;
import com.example.realestate.crm.enums.ShowingType;
import com.example.realestate.property.Property;
import com.example.realestate.user.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "crm_showings")
public class CrmShowing {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private User client;

    @Column(name = "client_name", nullable = false, length = 150)
    private String clientName;

    @Column(name = "client_email", nullable = false, length = 150)
    private String clientEmail;

    @Column(name = "client_phone", length = 50)
    private String clientPhone;

    @Column(name = "showing_time", nullable = false)
    private Instant showingTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "showing_type", length = 50)
    private ShowingType showingType = ShowingType.IN_PERSON;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ShowingStatus status = ShowingStatus.REQUESTED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public CrmShowing() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getAgent() { return agent; }
    public void setAgent(User agent) { this.agent = agent; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public User getClient() { return client; }
    public void setClient(User client) { this.client = client; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }

    public Instant getShowingTime() { return showingTime; }
    public void setShowingTime(Instant showingTime) { this.showingTime = showingTime; }

    public ShowingType getShowingType() { return showingType; }
    public void setShowingType(ShowingType showingType) { this.showingType = showingType; }

    public ShowingStatus getStatus() { return status; }
    public void setStatus(ShowingStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
