package com.example.realestate.property;

import com.example.realestate.amenity.Amenity;
import com.example.realestate.amenity.AmenityRepository;
import com.example.realestate.category.CategoryRepository;
import com.example.realestate.category.PropertyCategory;
import com.example.realestate.common.audit.AuditLogService;
import com.example.realestate.common.exception.ForbiddenException;
import com.example.realestate.common.exception.ResourceNotFoundException;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.property.dto.*;
import com.example.realestate.propertyimage.FileStorageService;
import com.example.realestate.propertyimage.PropertyImage;
import com.example.realestate.propertyimage.PropertyImageRepository;
import com.example.realestate.propertyimage.dto.PropertyImageDTO;
import com.example.realestate.security.UserPrincipal;
import com.example.realestate.user.Role;
import com.example.realestate.user.User;
import com.example.realestate.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final CategoryRepository categoryRepository;
    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final AuditLogService auditLogService;

    public PropertyService(
            PropertyRepository propertyRepository,
            PropertyImageRepository propertyImageRepository,
            CategoryRepository categoryRepository,
            AmenityRepository amenityRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService,
            AuditLogService auditLogService) {
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.categoryRepository = categoryRepository;
        this.amenityRepository = amenityRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertySummaryDTO> searchProperties(PropertyFilterDTO filter, Pageable pageable) {
        Specification<Property> spec = PropertySpecification.buildSpecification(filter, null, PropertyStatus.PUBLISHED);
        Page<Property> page = propertyRepository.findAll(spec, pageable);
        List<PropertySummaryDTO> content = page.getContent().stream()
                .map(PropertySummaryDTO::new)
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

    @Transactional
    public PropertyDetailDTO getPropertyDetail(UUID propertyId, boolean incrementView) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        if (incrementView) {
            property.setViewCount(property.getViewCount() + 1);
            propertyRepository.save(property);
        }

        return new PropertyDetailDTO(property);
    }

    @Transactional(readOnly = true)
    public List<PropertySummaryDTO> getFeaturedProperties() {
        return propertyRepository.findTop6ByStatusAndIsFeaturedTrueOrderByCreatedAtDesc(PropertyStatus.PUBLISHED)
                .stream()
                .map(PropertySummaryDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PropertySummaryDTO> getRecentProperties() {
        return propertyRepository.findTop8ByStatusOrderByCreatedAtDesc(PropertyStatus.PUBLISHED)
                .stream()
                .map(PropertySummaryDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getDistinctCities() {
        return propertyRepository.findDistinctCities();
    }

    @Transactional
    public PropertyDetailDTO createProperty(UserPrincipal principal, PropertyCreateDTO dto) {
        User owner = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Property property = new Property();
        property.setOwner(owner);
        applyDtoToProperty(dto, property);

        // By default, new listings go into PENDING_REVIEW unless admin creates them
        if (principal.getRole() == Role.ROLE_ADMIN) {
            property.setStatus(PropertyStatus.PUBLISHED);
        } else {
            property.setStatus(PropertyStatus.PENDING_REVIEW);
        }

        Property saved = propertyRepository.save(property);

        auditLogService.record(
                principal.getId(),
                principal.getUsername(),
                "PROPERTY_CREATED",
                "PROPERTY",
                saved.getId().toString(),
                "Listing created: " + saved.getTitle() + " with status " + saved.getStatus(),
                null
        );

        return new PropertyDetailDTO(saved);
    }

    @Transactional
    public PropertyDetailDTO updateProperty(UserPrincipal principal, UUID propertyId, PropertyUpdateDTO dto) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        validateOwnershipOrAdmin(principal, property);

        property.setTitle(dto.getTitle().trim());
        property.setDescription(dto.getDescription().trim());
        property.setTransactionType(dto.getTransactionType());
        property.setPropertyType(dto.getPropertyType());
        property.setPrice(dto.getPrice());
        property.setDeposit(dto.getDeposit() != null ? dto.getDeposit() : java.math.BigDecimal.ZERO);
        property.setCity(dto.getCity().trim());
        property.setLocality(dto.getLocality().trim());
        property.setPostalCode(dto.getPostalCode());
        property.setAddress(dto.getAddress().trim());
        property.setLatitude(dto.getLatitude());
        property.setLongitude(dto.getLongitude());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setBuiltUpSqft(dto.getBuiltUpSqft());
        property.setCarpetSqft(dto.getCarpetSqft());
        property.setFloorNumber(dto.getFloorNumber());
        property.setTotalFloors(dto.getTotalFloors());
        property.setFurnishingStatus(dto.getFurnishingStatus());
        property.setParkingAvailable(dto.isParkingAvailable());
        property.setAvailabilityDate(dto.getAvailabilityDate());

        if (dto.getCategoryId() != null) {
            PropertyCategory category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            property.setCategory(category);
        }

        if (dto.getAmenityIds() != null) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(dto.getAmenityIds()));
            property.setAmenities(amenities);
        }

        // If regular user updates a published property, re-submit for review
        if (principal.getRole() != Role.ROLE_ADMIN && property.getStatus() == PropertyStatus.PUBLISHED) {
            property.setStatus(PropertyStatus.PENDING_REVIEW);
        }

        Property updated = propertyRepository.save(property);

        auditLogService.record(
                principal.getId(),
                principal.getUsername(),
                "PROPERTY_UPDATED",
                "PROPERTY",
                updated.getId().toString(),
                "Listing updated: " + updated.getTitle(),
                null
        );

        return new PropertyDetailDTO(updated);
    }

    @Transactional
    public void updateStatus(UserPrincipal principal, UUID propertyId, PropertyStatusUpdateDTO dto) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        validateOwnershipOrAdmin(principal, property);

        PropertyStatus targetStatus = dto.getStatus();

        // Non-admin rules
        if (principal.getRole() != Role.ROLE_ADMIN) {
            // Owners can only mark SOLD, RENTED, ARCHIVED, or DRAFT/PENDING_REVIEW
            if (targetStatus == PropertyStatus.PUBLISHED) {
                targetStatus = PropertyStatus.PENDING_REVIEW;
            }
        }

        property.setStatus(targetStatus);
        if (dto.getReason() != null) {
            property.setRejectionReason(dto.getReason());
        }

        propertyRepository.save(property);

        auditLogService.record(
                principal.getId(),
                principal.getUsername(),
                "PROPERTY_STATUS_CHANGED",
                "PROPERTY",
                property.getId().toString(),
                "Status changed to " + targetStatus,
                null
        );
    }

    @Transactional
    public void deleteProperty(UserPrincipal principal, UUID propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        validateOwnershipOrAdmin(principal, property);

        propertyRepository.delete(property);

        auditLogService.record(
                principal.getId(),
                principal.getUsername(),
                "PROPERTY_DELETED",
                "PROPERTY",
                propertyId.toString(),
                "Listing deleted: " + property.getTitle(),
                null
        );
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertySummaryDTO> getMyProperties(UserPrincipal principal, PropertyFilterDTO filter, Pageable pageable) {
        Specification<Property> spec = PropertySpecification.buildSpecification(filter, principal.getId(), null);
        Page<Property> page = propertyRepository.findAll(spec, pageable);
        List<PropertySummaryDTO> content = page.getContent().stream()
                .map(PropertySummaryDTO::new)
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

    @Transactional
    public PropertyImageDTO uploadImage(UserPrincipal principal, UUID propertyId, MultipartFile file, boolean isPrimary) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        validateOwnershipOrAdmin(principal, property);

        FileStorageService.UploadResult uploadResult = fileStorageService.store(file);

        if (isPrimary || property.getImages().isEmpty()) {
            property.getImages().forEach(img -> img.setPrimary(false));
            isPrimary = true;
        }

        int nextOrder = property.getImages().size() + 1;
        PropertyImage image = new PropertyImage(
                property,
                uploadResult.getUrl(),
                uploadResult.getThumbnailUrl(),
                uploadResult.getStorageKey(),
                nextOrder,
                isPrimary
        );

        PropertyImage savedImage = propertyImageRepository.save(image);
        return new PropertyImageDTO(savedImage);
    }

    @Transactional
    public void deleteImage(UserPrincipal principal, UUID propertyId, UUID imageId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        validateOwnershipOrAdmin(principal, property);

        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + imageId));

        if (!image.getProperty().getId().equals(propertyId)) {
            throw new ForbiddenException("Image does not belong to this property");
        }

        fileStorageService.delete(image.getStorageKey());
        propertyImageRepository.delete(image);

        // If deleted image was primary, set first remaining image as primary
        if (image.isPrimary()) {
            List<PropertyImage> remaining = propertyImageRepository.findByPropertyIdOrderByDisplayOrderAsc(propertyId);
            if (!remaining.isEmpty()) {
                remaining.get(0).setPrimary(true);
                propertyImageRepository.save(remaining.get(0));
            }
        }
    }

    @Transactional
    public void setPrimaryImage(UserPrincipal principal, UUID propertyId, UUID imageId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        validateOwnershipOrAdmin(principal, property);

        List<PropertyImage> images = propertyImageRepository.findByPropertyIdOrderByDisplayOrderAsc(propertyId);
        for (PropertyImage img : images) {
            img.setPrimary(img.getId().equals(imageId));
        }
        propertyImageRepository.saveAll(images);
    }

    private void applyDtoToProperty(PropertyCreateDTO dto, Property property) {
        property.setTitle(dto.getTitle().trim());
        property.setDescription(dto.getDescription().trim());
        property.setTransactionType(dto.getTransactionType());
        property.setPropertyType(dto.getPropertyType());
        property.setPrice(dto.getPrice());
        property.setDeposit(dto.getDeposit() != null ? dto.getDeposit() : java.math.BigDecimal.ZERO);
        property.setCity(dto.getCity().trim());
        property.setLocality(dto.getLocality().trim());
        property.setPostalCode(dto.getPostalCode());
        property.setAddress(dto.getAddress().trim());
        property.setLatitude(dto.getLatitude());
        property.setLongitude(dto.getLongitude());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setBuiltUpSqft(dto.getBuiltUpSqft());
        property.setCarpetSqft(dto.getCarpetSqft());
        property.setFloorNumber(dto.getFloorNumber());
        property.setTotalFloors(dto.getTotalFloors());
        property.setFurnishingStatus(dto.getFurnishingStatus() != null ? dto.getFurnishingStatus() : "UNFURNISHED");
        property.setParkingAvailable(dto.isParkingAvailable());
        property.setAvailabilityDate(dto.getAvailabilityDate());

        if (dto.getCategoryId() != null) {
            PropertyCategory category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            property.setCategory(category);
        }

        if (dto.getAmenityIds() != null && !dto.getAmenityIds().isEmpty()) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(dto.getAmenityIds()));
            property.setAmenities(amenities);
        }
    }

    private void validateOwnershipOrAdmin(UserPrincipal principal, Property property) {
        if (principal.getRole() == Role.ROLE_ADMIN) {
            return;
        }
        if (!property.getOwner().getId().equals(principal.getId())) {
            throw new ForbiddenException("You do not have permission to modify this property listing.");
        }
    }
}
