package com.example.realestate.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<PropertyCategory, UUID> {
    List<PropertyCategory> findByIsActiveTrueOrderByDisplayOrderAsc();
    Optional<PropertyCategory> findBySlug(String slug);
    boolean existsByNameIgnoreCase(String name);
}
