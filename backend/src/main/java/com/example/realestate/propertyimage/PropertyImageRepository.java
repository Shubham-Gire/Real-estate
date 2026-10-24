package com.example.realestate.propertyimage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyImageRepository extends JpaRepository<PropertyImage, UUID> {
    List<PropertyImage> findByPropertyIdOrderByDisplayOrderAsc(UUID propertyId);
}
