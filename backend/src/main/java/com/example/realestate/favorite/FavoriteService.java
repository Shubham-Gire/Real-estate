package com.example.realestate.favorite;

import com.example.realestate.common.exception.BadRequestException;
import com.example.realestate.common.exception.ResourceNotFoundException;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.property.Property;
import com.example.realestate.property.PropertyRepository;
import com.example.realestate.property.dto.PropertySummaryDTO;
import com.example.realestate.user.User;
import com.example.realestate.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, PropertyRepository propertyRepository, UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void addFavorite(UUID userId, UUID propertyId) {
        if (favoriteRepository.existsByUserIdAndPropertyId(userId, propertyId)) {
            return; // Already favorited, idempotent
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        Favorite favorite = new Favorite(user, property);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(UUID userId, UUID propertyId) {
        favoriteRepository.findByUserIdAndPropertyId(userId, propertyId)
                .ifPresent(favoriteRepository::delete);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertySummaryDTO> getMyFavorites(UUID userId, Pageable pageable) {
        Page<Favorite> page = favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        List<PropertySummaryDTO> content = page.getContent().stream()
                .map(fav -> new PropertySummaryDTO(fav.getProperty()))
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<UUID> getMyFavoritePropertyIds(UUID userId) {
        return favoriteRepository.findFavoritedPropertyIdsByUserId(userId);
    }
}
