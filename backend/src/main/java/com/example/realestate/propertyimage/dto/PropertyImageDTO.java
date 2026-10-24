package com.example.realestate.propertyimage.dto;

import com.example.realestate.propertyimage.PropertyImage;
import java.util.UUID;

public class PropertyImageDTO {
    private UUID id;
    private String imageUrl;
    private String thumbnailUrl;
    private int displayOrder;
    private boolean isPrimary;

    public PropertyImageDTO() {}

    public PropertyImageDTO(PropertyImage image) {
        this.id = image.getId();
        this.imageUrl = image.getImageUrl();
        this.thumbnailUrl = image.getThumbnailUrl();
        this.displayOrder = image.getDisplayOrder();
        this.isPrimary = image.isPrimary();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }

    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean primary) { isPrimary = primary; }
}
