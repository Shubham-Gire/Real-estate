package com.example.realestate.amenity.dto;

import com.example.realestate.amenity.Amenity;
import java.util.UUID;

public class AmenityDTO {
    private UUID id;
    private String name;
    private String category;
    private String icon;

    public AmenityDTO() {}

    public AmenityDTO(Amenity amenity) {
        this.id = amenity.getId();
        this.name = amenity.getName();
        this.category = amenity.getCategory();
        this.icon = amenity.getIcon();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
