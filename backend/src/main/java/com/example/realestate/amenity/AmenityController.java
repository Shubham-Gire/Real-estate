package com.example.realestate.amenity;

import com.example.realestate.amenity.dto.AmenityDTO;
import com.example.realestate.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/amenities")
@Tag(name = "Amenities", description = "Property amenity metadata")
public class AmenityController {

    private final AmenityService amenityService;

    public AmenityController(AmenityService amenityService) {
        this.amenityService = amenityService;
    }

    @GetMapping
    @Operation(summary = "Get all property amenities")
    public ResponseEntity<ApiResponse<List<AmenityDTO>>> getAmenities() {
        List<AmenityDTO> amenities = amenityService.getAllAmenities();
        return ResponseEntity.ok(ApiResponse.ok(amenities));
    }
}
