package com.example.realestate.favorite;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    Optional<Favorite> findByUserIdAndPropertyId(UUID userId, UUID propertyId);

    boolean existsByUserIdAndPropertyId(UUID userId, UUID propertyId);

    Page<Favorite> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    @Query("SELECT f.property.id FROM Favorite f WHERE f.user.id = :userId")
    List<UUID> findFavoritedPropertyIdsByUserId(UUID userId);

    long countByUserId(UUID userId);
}
