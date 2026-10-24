package com.example.realestate.property;

import com.example.realestate.amenity.AmenityService;
import com.example.realestate.amenity.dto.AmenityDTO;
import com.example.realestate.category.CategoryService;
import com.example.realestate.category.dto.CategoryDTO;
import com.example.realestate.common.response.ApiResponse;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.property.dto.*;
import com.example.realestate.propertyimage.dto.PropertyImageDTO;
import com.example.realestate.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Properties", description = "Endpoints for public property browsing, search, and owner/agent management")
public class PropertyController {

    private final PropertyService propertyService;
    private final CategoryService categoryService;
    private final AmenityService amenityService;

    public PropertyController(
            PropertyService propertyService,
            CategoryService categoryService,
            AmenityService amenityService) {
        this.propertyService = propertyService;
        this.categoryService = categoryService;
        this.amenityService = amenityService;
    }

    @GetMapping("/properties")
    @Operation(summary = "Search, filter, and paginate public published properties")
    public ResponseEntity<ApiResponse<PagedResponse<PropertySummaryDTO>>> searchProperties(
            @ModelAttribute PropertyFilterDTO filter,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<PropertySummaryDTO> response = propertyService.searchProperties(filter, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/properties/{id}")
    @Operation(summary = "Get detailed property information by ID")
    public ResponseEntity<ApiResponse<PropertyDetailDTO>> getPropertyDetail(@PathVariable UUID id) {
        PropertyDetailDTO property = propertyService.getPropertyDetail(id, true);
        return ResponseEntity.ok(ApiResponse.ok(property));
    }

    @GetMapping("/properties/featured")
    @Operation(summary = "Get featured properties for homepage showcase")
    public ResponseEntity<ApiResponse<List<PropertySummaryDTO>>> getFeaturedProperties() {
        List<PropertySummaryDTO> list = propertyService.getFeaturedProperties();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/properties/recent")
    @Operation(summary = "Get recently published properties")
    public ResponseEntity<ApiResponse<List<PropertySummaryDTO>>> getRecentProperties() {
        List<PropertySummaryDTO> list = propertyService.getRecentProperties();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/properties/locations")
    @Operation(summary = "Get distinct cities with active listings")
    public ResponseEntity<ApiResponse<List<String>>> getLocations() {
        List<String> cities = propertyService.getDistinctCities();
        return ResponseEntity.ok(ApiResponse.ok(cities));
    }

    @GetMapping("/properties/categories")
    @Operation(summary = "Get all active property categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getCategories() {
        List<CategoryDTO> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }

    @GetMapping("/properties/amenities")
    @Operation(summary = "Get all available amenities")
    public ResponseEntity<ApiResponse<List<AmenityDTO>>> getAmenities() {
        List<AmenityDTO> amenities = amenityService.getAllAmenities();
        return ResponseEntity.ok(ApiResponse.ok(amenities));
    }

    @PostMapping("/properties")
    @Operation(summary = "Create a new property listing")
    public ResponseEntity<ApiResponse<PropertyDetailDTO>> createProperty(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PropertyCreateDTO dto) {
        PropertyDetailDTO created = propertyService.createProperty(principal, dto);
        return new ResponseEntity<>(ApiResponse.ok("Property created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/properties/{id}")
    @Operation(summary = "Update an existing property listing")
    public ResponseEntity<ApiResponse<PropertyDetailDTO>> updateProperty(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody PropertyUpdateDTO dto) {
        PropertyDetailDTO updated = propertyService.updateProperty(principal, id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Property updated successfully", updated));
    }

    @PatchMapping("/properties/{id}/status")
    @Operation(summary = "Change status of a property (e.g. SOLD, RENTED, ARCHIVED)")
    public ResponseEntity<ApiResponse<Void>> updatePropertyStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody PropertyStatusUpdateDTO dto) {
        propertyService.updateStatus(principal, id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Property status updated successfully"));
    }

    @DeleteMapping("/properties/{id}")
    @Operation(summary = "Delete a property listing")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        propertyService.deleteProperty(principal, id);
        return ResponseEntity.ok(ApiResponse.ok("Property deleted successfully"));
    }

    @GetMapping("/users/me/properties")
    @Operation(summary = "Get current user's owned properties across all statuses")
    public ResponseEntity<ApiResponse<PagedResponse<PropertySummaryDTO>>> getMyProperties(
            @AuthenticationPrincipal UserPrincipal principal,
            @ModelAttribute PropertyFilterDTO filter,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<PropertySummaryDTO> response = propertyService.getMyProperties(principal, filter, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping(value = "/properties/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload an image for a property listing")
    public ResponseEntity<ApiResponse<PropertyImageDTO>> uploadImage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPrimary", defaultValue = "false") boolean isPrimary) {
        PropertyImageDTO image = propertyService.uploadImage(principal, id, file, isPrimary);
        return new ResponseEntity<>(ApiResponse.ok("Image uploaded successfully", image), HttpStatus.CREATED);
    }

    @DeleteMapping("/properties/{id}/images/{imageId}")
    @Operation(summary = "Delete an image from a property listing")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @PathVariable UUID imageId) {
        propertyService.deleteImage(principal, id, imageId);
        return ResponseEntity.ok(ApiResponse.ok("Image deleted successfully"));
    }

    @PutMapping("/properties/{id}/images/primary/{imageId}")
    @Operation(summary = "Set an image as the primary image of a property")
    public ResponseEntity<ApiResponse<Void>> setPrimaryImage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @PathVariable UUID imageId) {
        propertyService.setPrimaryImage(principal, id, imageId);
        return ResponseEntity.ok(ApiResponse.ok("Primary image updated successfully"));
    }
}
