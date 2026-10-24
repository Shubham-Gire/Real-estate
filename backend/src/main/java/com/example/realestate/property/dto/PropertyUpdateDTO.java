package com.example.realestate.property.dto;

import com.example.realestate.property.PropertyType;
import com.example.realestate.property.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public class PropertyUpdateDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Transaction type is required (SALE or RENT)")
    private TransactionType transactionType;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    private UUID categoryId;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    private BigDecimal deposit;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Locality is required")
    private String locality;

    private String postalCode;

    @NotBlank(message = "Address is required")
    private String address;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @Min(value = 0)
    private int bedrooms = 0;

    @Min(value = 0)
    private int bathrooms = 0;

    private BigDecimal builtUpSqft;
    private BigDecimal carpetSqft;
    private Integer floorNumber;
    private Integer totalFloors;
    private String furnishingStatus;
    private boolean parkingAvailable;
    private LocalDate availabilityDate;

    private Set<UUID> amenityIds;

    public PropertyUpdateDTO() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

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

    public Set<UUID> getAmenityIds() { return amenityIds; }
    public void setAmenityIds(Set<UUID> amenityIds) { this.amenityIds = amenityIds; }
}
