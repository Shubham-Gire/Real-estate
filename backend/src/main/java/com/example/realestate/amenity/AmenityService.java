package com.example.realestate.amenity;

import com.example.realestate.amenity.dto.AmenityDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AmenityService {

    private final AmenityRepository amenityRepository;

    public AmenityService(AmenityRepository amenityRepository) {
        this.amenityRepository = amenityRepository;
    }

    @Transactional(readOnly = true)
    public List<AmenityDTO> getAllAmenities() {
        return amenityRepository.findAllByOrderByNameAsc()
                .stream()
                .map(AmenityDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Set<Amenity> getAmenitiesByIds(Set<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return Set.of();
        }
        return Set.copyOf(amenityRepository.findAllById(ids));
    }
}
