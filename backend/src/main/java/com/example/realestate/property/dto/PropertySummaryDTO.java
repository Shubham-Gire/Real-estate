package com.example.realestate.property.dto;

import com.example.realestate.property.Property;
import com.example.realestate.property.PropertyStatus;
import com.example.realestate.property.PropertyType;
import com.example.realestate.property.TransactionType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PropertySummaryDTO {
    private UUID id;
    private String title;
    private TransactionType transactionType;
    private PropertyType propertyType;
    private PropertyStatus status;
    private BigDecimal price;
    private BigDecimal deposit;
    private String city;
    private String locality;
    private int bedrooms;
    private int bathrooms;
    private BigDecimal builtUpSqft;
    private String primaryImageUrl;
    private boolean isFeatured;
    private long viewCount;
    private UUID ownerId;
    private String ownerName;
    private String ownerRole;
    private String categoryName;
    private Instant createdAt;

    public PropertySummaryDTO() {}

    public PropertySummaryDTO(Property property) {
        this.id = property.getId();
        this.title = property.getTitle();
        this.transactionType = property.getTransactionType();
        this.propertyType = property.getPropertyType();
        this.status = property.getStatus();
        this.price = property.getPrice();
        this.deposit = property.getDeposit();
        this.city = property.getCity();
        this.locality = property.getLocality();
        this.bedrooms = property.getBedrooms();
        this.bathrooms = property.getBathrooms();
        this.builtUpSqft = property.getBuiltUpSqft();
        this.isFeatured = property.isFeatured();
        this.viewCount = property.getViewCount();
        this.createdAt = property.getCreatedAt();

        if (property.getOwner() != null) {
            this.ownerId = property.getOwner().getId();
            this.ownerName = property.getOwner().getFullName();
            this.ownerRole = property.getOwner().getRole().name();
        }

        if (property.getCategory() != null) {
            this.categoryName = property.getCategory().getName();
        }

        if (property.getImages() != null && !property.getImages().isEmpty()) {
            this.primaryImageUrl = property.getImages().stream()
                    .filter(img -> img.isPrimary())
                    .findFirst()
                    .map(img -> img.getImageUrl())
                    .orElse(property.getImages().get(0).getImageUrl());
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getDeposit() { return deposit; }
    public void setDeposit(BigDecimal deposit) { this.deposit = deposit; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public int getBedrooms() { return bedrooms; }
    public void setBedrooms(int bedrooms) { this.bedrooms = bedrooms; }

    public int getBathrooms() { return bathrooms; }
    public void setBathrooms(int bathrooms) { this.bathrooms = bathrooms; }

    public BigDecimal getBuiltUpSqft() { return builtUpSqft; }
    public void setBuiltUpSqft(BigDecimal builtUpSqft) { this.builtUpSqft = builtUpSqft; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }

    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean featured) { isFeatured = featured; }

    public long getViewCount() { return viewCount; }
    public void setViewCount(long viewCount) { this.viewCount = viewCount; }

    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerRole() { return ownerRole; }
    public void setOwnerRole(String ownerRole) { this.ownerRole = ownerRole; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
