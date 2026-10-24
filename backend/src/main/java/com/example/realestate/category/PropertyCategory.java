package com.example.realestate.category;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "property_categories")
public class PropertyCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true, length = 80)
    private String name;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(length = 255)
    private String description;

    @Column(length = 50)
    private String icon;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 0;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public PropertyCategory() {}

    public PropertyCategory(String name, String slug, String description, String icon, int displayOrder) {
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.icon = icon;
        this.displayOrder = displayOrder;
        this.isActive = true;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
