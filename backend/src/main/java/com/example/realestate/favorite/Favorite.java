package com.example.realestate.favorite;

import com.example.realestate.property.Property;
import com.example.realestate.user.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "favorites", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_favorite", columnNames = {"user_id", "property_id"})
})
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Favorite() {}

    public Favorite(User user, Property property) {
        this.user = user;
        this.property = property;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
