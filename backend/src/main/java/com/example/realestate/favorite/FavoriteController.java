package com.example.realestate.favorite;

import com.example.realestate.common.response.ApiResponse;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.property.dto.PropertySummaryDTO;
import com.example.realestate.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/favorites")
@Tag(name = "Favorites", description = "Endpoints for managing saved user favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    @Operation(summary = "Get user's favorited properties")
    public ResponseEntity<ApiResponse<PagedResponse<PropertySummaryDTO>>> getFavorites(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<PropertySummaryDTO> response = favoriteService.getMyFavorites(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/ids")
    @Operation(summary = "Get list of favorited property UUIDs for client UI heart badge state")
    public ResponseEntity<ApiResponse<List<UUID>>> getFavoriteIds(@AuthenticationPrincipal UserPrincipal principal) {
        List<UUID> ids = favoriteService.getMyFavoritePropertyIds(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(ids));
    }

    @PostMapping("/{propertyId}")
    @Operation(summary = "Save property to favorites")
    public ResponseEntity<ApiResponse<Void>> addFavorite(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID propertyId) {
        favoriteService.addFavorite(principal.getId(), propertyId);
        return ResponseEntity.ok(ApiResponse.ok("Property added to favorites"));
    }

    @DeleteMapping("/{propertyId}")
    @Operation(summary = "Remove property from favorites")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID propertyId) {
        favoriteService.removeFavorite(principal.getId(), propertyId);
        return ResponseEntity.ok(ApiResponse.ok("Property removed from favorites"));
    }
}
