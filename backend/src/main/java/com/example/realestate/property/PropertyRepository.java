package com.example.realestate.property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyRepository extends JpaRepository<Property, UUID>, JpaSpecificationExecutor<Property> {

    List<Property> findTop6ByStatusAndIsFeaturedTrueOrderByCreatedAtDesc(PropertyStatus status);

    List<Property> findTop8ByStatusOrderByCreatedAtDesc(PropertyStatus status);

    Page<Property> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId, Pageable pageable);

    long countByStatus(PropertyStatus status);

    long countByOwnerId(UUID ownerId);

    long countByOwnerIdAndStatus(UUID ownerId, PropertyStatus status);

    @Query("SELECT DISTINCT p.city FROM Property p WHERE p.status = 'PUBLISHED' ORDER BY p.city ASC")
    List<String> findDistinctCities();
}
