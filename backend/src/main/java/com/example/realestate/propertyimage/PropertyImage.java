package com.example.realestate.propertyimage;

import com.example.realestate.property.Property;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "property_images")
public class PropertyImage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    @JsonIgnore
    private Property property;

    @Column(name = "image_url", nullable = false, length = 512)
    private String imageUrl;

    @Column(name = "thumbnail_url", length = 512)
    private String thumbnailUrl;

    @Column(name = "storage_key", nullable = false, length = 255)
    private String storageKey;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 0;

    @Column(name = "is_primary", nullable = false)
    private boolean isPrimary = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public PropertyImage() {}

    public PropertyImage(Property property, String imageUrl, String thumbnailUrl, String storageKey, int displayOrder, boolean isPrimary) {
        this.property = property;
        this.imageUrl = imageUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.storageKey = storageKey;
        this.displayOrder = displayOrder;
        this.isPrimary = isPrimary;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getStorageKey() { return storageKey; }
    public void setStorageKey(String storageKey) { this.storageKey = storageKey; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }

    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean primary) { isPrimary = primary; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
