package com.example.realestate.property.dto;

import com.example.realestate.amenity.dto.AmenityDTO;
import com.example.realestate.property.Property;
import com.example.realestate.property.PropertyStatus;
import com.example.realestate.property.PropertyType;
import com.example.realestate.property.TransactionType;
import com.example.realestate.propertyimage.dto.PropertyImageDTO;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class PropertyDetailDTO {
    private UUID id;
    private String title;
    private String description;
    private TransactionType transactionType;
    private PropertyType propertyType;
    private PropertyStatus status;
    private BigDecimal price;
    private BigDecimal deposit;
    private String city;
    private String locality;
    private String postalCode;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private int bedrooms;
    private int bathrooms;
    private BigDecimal builtUpSqft;
    private BigDecimal carpetSqft;
    private Integer floorNumber;
    private Integer totalFloors;
    private String furnishingStatus;
    private boolean parkingAvailable;
    private LocalDate availabilityDate;
    private boolean isFeatured;
    private long viewCount;
    private String rejectionReason;
    private Instant createdAt;
    private Instant updatedAt;

    // Category
    private UUID categoryId;
    private String categoryName;

    // Owner
    private UUID ownerId;
    private String ownerName;
    private String ownerEmail;
    private String ownerPhone;
    private String ownerAvatar;
    private String ownerAgency;
    private String ownerRole;

    // Images & Amenities
    private List<PropertyImageDTO> images = new ArrayList<>();
    private List<AmenityDTO> amenities = new ArrayList<>();

    public PropertyDetailDTO() {}

    public PropertyDetailDTO(Property property) {
        this.id = property.getId();
        this.title = property.getTitle();
        this.description = property.getDescription();
        this.transactionType = property.getTransactionType();
        this.propertyType = property.getPropertyType();
        this.status = property.getStatus();
        this.price = property.getPrice();
        this.deposit = property.getDeposit();
        this.city = property.getCity();
        this.locality = property.getLocality();
        this.postalCode = property.getPostalCode();
        this.address = property.getAddress();
        this.latitude = property.getLatitude();
        this.longitude = property.getLongitude();
        this.bedrooms = property.getBedrooms();
        this.bathrooms = property.getBathrooms();
        this.builtUpSqft = property.getBuiltUpSqft();
        this.carpetSqft = property.getCarpetSqft();
        this.floorNumber = property.getFloorNumber();
        this.totalFloors = property.getTotalFloors();
        this.furnishingStatus = property.getFurnishingStatus();
        this.parkingAvailable = property.isParkingAvailable();
        this.availabilityDate = property.getAvailabilityDate();
        this.isFeatured = property.isFeatured();
        this.viewCount = property.getViewCount();
        this.rejectionReason = property.getRejectionReason();
        this.createdAt = property.getCreatedAt();
        this.updatedAt = property.getUpdatedAt();

        if (property.getCategory() != null) {
            this.categoryId = property.getCategory().getId();
            this.categoryName = property.getCategory().getName();
        }

        if (property.getOwner() != null) {
            this.ownerId = property.getOwner().getId();
            this.ownerName = property.getOwner().getFullName();
            this.ownerEmail = property.getOwner().getEmail();
            this.ownerPhone = property.getOwner().getPhone();
            this.ownerAvatar = property.getOwner().getAvatarUrl();
            this.ownerAgency = property.getOwner().getAgencyName();
            this.ownerRole = property.getOwner().getRole().name();
        }

        if (property.getImages() != null) {
            this.images = property.getImages().stream()
                    .map(PropertyImageDTO::new)
                    .collect(Collectors.toList());
        }

        if (property.getAmenities() != null) {
            this.amenities = property.getAmenities().stream()
                    .map(AmenityDTO::new)
                    .collect(Collectors.toList());
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

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

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public int getBedrooms() { return bedrooms; }
    public void setBedrooms(int bedrooms) { this.bedrooms = bedrooms; }

    public int getBathrooms() { return bathrooms; }
    public void setBathrooms(int bathrooms) { this.bathrooms = bathrooms; }

    public BigDecimal getBuiltUpSqft() { return builtUpSqft; }
    public void setBuiltUpSqft(BigDecimal builtUpSqft) { this.builtUpSqft = builtUpSqft; }

    public BigDecimal getCarpetSqft() { return carpetSqft; }
    public void setCarpetSqft(BigDecimal carpetSqft) { this.carpetSqft = carpetSqft; }

    public Integer getFloorNumber() { return floorNumber; }
    public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }

    public Integer getTotalFloors() { return totalFloors; }
    public void setTotalFloors(Integer totalFloors) { this.totalFloors = totalFloors; }

    public String getFurnishingStatus() { return furnishingStatus; }
    public void setFurnishingStatus(String furnishingStatus) { this.furnishingStatus = furnishingStatus; }

    public boolean isParkingAvailable() { return parkingAvailable; }
    public void setParkingAvailable(boolean parkingAvailable) { this.parkingAvailable = parkingAvailable; }

    public LocalDate getAvailabilityDate() { return availabilityDate; }
    public void setAvailabilityDate(LocalDate availabilityDate) { this.availabilityDate = availabilityDate; }

    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean featured) { isFeatured = featured; }

    public long getViewCount() { return viewCount; }
    public void setViewCount(long viewCount) { this.viewCount = viewCount; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public String getOwnerAvatar() { return ownerAvatar; }
    public void setOwnerAvatar(String ownerAvatar) { this.ownerAvatar = ownerAvatar; }

    public String getOwnerAgency() { return ownerAgency; }
    public void setOwnerAgency(String ownerAgency) { this.ownerAgency = ownerAgency; }

    public String getOwnerRole() { return ownerRole; }
    public void setOwnerRole(String ownerRole) { this.ownerRole = ownerRole; }

    public List<PropertyImageDTO> getImages() { return images; }
    public void setImages(List<PropertyImageDTO> images) { this.images = images; }

    public List<AmenityDTO> getAmenities() { return amenities; }
    public void setAmenities(List<AmenityDTO> amenities) { this.amenities = amenities; }
}
