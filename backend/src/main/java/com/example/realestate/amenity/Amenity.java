package com.example.realestate.amenity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "amenities")
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true, length = 80)
    private String name;

    @Column(nullable = false, length = 50)
    private String category = "General";

    @Column(length = 50)
    private String icon;

    public Amenity() {}

    public Amenity(String name, String category, String icon) {
        this.name = name;
        this.category = category;
        this.icon = icon;
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
