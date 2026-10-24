package com.example.realestate.property.dto;

import com.example.realestate.property.PropertyStatus;
import com.example.realestate.property.PropertyType;
import com.example.realestate.property.TransactionType;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

public class PropertyFilterDTO {
    private String query;
    private String city;
    private String locality;
    private TransactionType transactionType;
    private PropertyType propertyType;
    private UUID categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer bedrooms;
    private Integer bathrooms;
    private String furnishingStatus;
    private Boolean isFeatured;
    private PropertyStatus status;
    private Set<UUID> amenityIds;

    public PropertyFilterDTO() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }

    public String getFurnishingStatus() { return furnishingStatus; }
    public void setFurnishingStatus(String furnishingStatus) { this.furnishingStatus = furnishingStatus; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public Set<UUID> getAmenityIds() { return amenityIds; }
    public void setAmenityIds(Set<UUID> amenityIds) { this.amenityIds = amenityIds; }
}
