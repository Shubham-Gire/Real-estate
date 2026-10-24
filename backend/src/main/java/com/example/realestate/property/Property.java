package com.example.realestate.property;

import com.example.realestate.amenity.Amenity;
import com.example.realestate.category.PropertyCategory;
import com.example.realestate.propertyimage.PropertyImage;
import com.example.realestate.user.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private PropertyCategory category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private TransactionType transactionType = TransactionType.SALE;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false, length = 30)
    private PropertyType propertyType = PropertyType.APARTMENT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PropertyStatus status = PropertyStatus.PENDING_REVIEW;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal price;

    @Column(precision = 14, scale = 2)
    private BigDecimal deposit = BigDecimal.ZERO;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 120)
    private String locality;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(nullable = false)
    private int bedrooms = 0;

    @Column(nullable = false)
    private int bathrooms = 0;

    @Column(name = "built_up_sqft", precision = 10, scale = 2)
    private BigDecimal builtUpSqft;

    @Column(name = "carpet_sqft", precision = 10, scale = 2)
    private BigDecimal carpetSqft;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "total_floors")
    private Integer totalFloors;

    @Column(name = "furnishing_status", length = 30)
    private String furnishingStatus = "UNFURNISHED";

    @Column(name = "parking_available")
    private boolean parkingAvailable = false;

    @Column(name = "availability_date")
    private LocalDate availabilityDate;

    @Column(name = "is_featured", nullable = false)
    private boolean isFeatured = false;

    @Column(name = "view_count", nullable = false)
    private long viewCount = 0;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moderated_by")
    private User moderatedBy;

    @Column(name = "moderated_at")
    private Instant moderatedAt;

    @ManyToMany
    @JoinTable(
        name = "property_amenities",
        joinColumns = @JoinColumn(name = "property_id"),
        inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private Set<Amenity> amenities = new HashSet<>();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<PropertyImage> images = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Property() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public PropertyCategory getCategory() { return category; }
    public void setCategory(PropertyCategory category) { this.category = category; }

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

    public User getModeratedBy() { return moderatedBy; }
    public void setModeratedBy(User moderatedBy) { this.moderatedBy = moderatedBy; }

    public Instant getModeratedAt() { return moderatedAt; }
    public void setModeratedAt(Instant moderatedAt) { this.moderatedAt = moderatedAt; }

    public Set<Amenity> getAmenities() { return amenities; }
    public void setAmenities(Set<Amenity> amenities) { this.amenities = amenities; }

    public List<PropertyImage> getImages() { return images; }
    public void setImages(List<PropertyImage> images) { this.images = images; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public void addImage(PropertyImage image) {
        images.add(image);
        image.setProperty(this);
    }

    public void removeImage(PropertyImage image) {
        images.remove(image);
        image.setProperty(null);
    }
}
