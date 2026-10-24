package com.example.realestate;

import com.example.realestate.amenity.AmenityRepository;
import com.example.realestate.category.CategoryRepository;
import com.example.realestate.common.audit.AuditLogService;
import com.example.realestate.common.exception.ForbiddenException;
import com.example.realestate.common.exception.ResourceNotFoundException;
import com.example.realestate.property.*;
import com.example.realestate.property.dto.PropertyCreateDTO;
import com.example.realestate.property.dto.PropertyDetailDTO;
import com.example.realestate.property.dto.PropertyStatusUpdateDTO;
import com.example.realestate.propertyimage.FileStorageService;
import com.example.realestate.propertyimage.PropertyImageRepository;
import com.example.realestate.security.UserPrincipal;
import com.example.realestate.user.Role;
import com.example.realestate.user.User;
import com.example.realestate.user.UserRepository;
import com.example.realestate.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private PropertyImageRepository propertyImageRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private AmenityRepository amenityRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private FileStorageService fileStorageService;
    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private PropertyService propertyService;

    private User owner;
    private UserPrincipal ownerPrincipal;
    private UserPrincipal otherPrincipal;

    @BeforeEach
    void setUp() {
        UUID ownerId = UUID.randomUUID();
        owner = new User("owner@example.com", "pass", "John", "Owner", Role.ROLE_USER);
        owner.setId(ownerId);

        ownerPrincipal = new UserPrincipal(
                ownerId, "owner@example.com", "pass", Role.ROLE_USER, UserStatus.ACTIVE,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );

        otherPrincipal = new UserPrincipal(
                UUID.randomUUID(), "other@example.com", "pass", Role.ROLE_USER, UserStatus.ACTIVE,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    @Test
    void createProperty_DefaultStatusIsPendingReviewForNormalUser() {
        PropertyCreateDTO dto = new PropertyCreateDTO();
        dto.setTitle("Cozy Apartment");
        dto.setDescription("Lovely studio apartment");
        dto.setTransactionType(TransactionType.SALE);
        dto.setPropertyType(PropertyType.APARTMENT);
        dto.setPrice(new BigDecimal("250000"));
        dto.setCity("Boston");
        dto.setLocality("Back Bay");
        dto.setAddress("100 Commonwealth Ave");

        when(userRepository.findById(ownerPrincipal.getId())).thenReturn(Optional.of(owner));
        when(propertyRepository.save(any(Property.class))).thenAnswer(invocation -> {
            Property p = invocation.getArgument(0);
            p.setId(UUID.randomUUID());
            return p;
        });

        PropertyDetailDTO created = propertyService.createProperty(ownerPrincipal, dto);

        assertNotNull(created);
        assertEquals(PropertyStatus.PENDING_REVIEW, created.getStatus());
        assertEquals("Cozy Apartment", created.getTitle());
    }

    @Test
    void updateStatus_UnauthorizedUser_ThrowsForbiddenException() {
        UUID propertyId = UUID.randomUUID();
        Property property = new Property();
        property.setId(propertyId);
        property.setOwner(owner);

        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));

        PropertyStatusUpdateDTO dto = new PropertyStatusUpdateDTO();
        dto.setStatus(PropertyStatus.SOLD);

        assertThrows(ForbiddenException.class, () -> propertyService.updateStatus(otherPrincipal, propertyId, dto));
        verify(propertyRepository, never()).save(any());
    }
}
