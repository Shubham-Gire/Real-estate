package com.example.realestate.property;

import com.example.realestate.amenity.Amenity;
import com.example.realestate.property.dto.PropertyFilterDTO;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class PropertySpecification {

    public static Specification<Property> buildSpecification(PropertyFilterDTO filter, UUID ownerIdOnly, PropertyStatus defaultStatus) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Owner Filter (if querying by specific owner)
            if (ownerIdOnly != null) {
                predicates.add(cb.equal(root.get("owner").get("id"), ownerIdOnly));
            }

            // 2. Status Filter
            if (filter != null && filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            } else if (defaultStatus != null) {
                predicates.add(cb.equal(root.get("status"), defaultStatus));
            }

            if (filter == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            // 3. Free Text Search Query
            if (StringUtils.hasText(filter.getQuery())) {
                String searchPattern = "%" + filter.getQuery().trim().toLowerCase() + "%";
                Predicate titlePredicate = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate localityPredicate = cb.like(cb.lower(root.get("locality")), searchPattern);
                Predicate cityPredicate = cb.like(cb.lower(root.get("city")), searchPattern);
                predicates.add(cb.or(titlePredicate, localityPredicate, cityPredicate));
            }

            // 4. City Filter
            if (StringUtils.hasText(filter.getCity())) {
                predicates.add(cb.equal(cb.lower(root.get("city")), filter.getCity().trim().toLowerCase()));
            }

            // 5. Locality Filter
            if (StringUtils.hasText(filter.getLocality())) {
                predicates.add(cb.like(cb.lower(root.get("locality")), "%" + filter.getLocality().trim().toLowerCase() + "%"));
            }

            // 6. Transaction Type Filter (SALE, RENT)
            if (filter.getTransactionType() != null) {
                predicates.add(cb.equal(root.get("transactionType"), filter.getTransactionType()));
            }

            // 7. Property Type Filter (APARTMENT, VILLA, etc.)
            if (filter.getPropertyType() != null) {
                predicates.add(cb.equal(root.get("propertyType"), filter.getPropertyType()));
            }

            // 8. Category Filter
            if (filter.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategoryId()));
            }

            // 9. Price Boundaries
            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }

            // 10. Bedrooms & Bathrooms
            if (filter.getBedrooms() != null && filter.getBedrooms() > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bedrooms"), filter.getBedrooms()));
            }
            if (filter.getBathrooms() != null && filter.getBathrooms() > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bathrooms"), filter.getBathrooms()));
            }

            // 11. Furnishing Status
            if (StringUtils.hasText(filter.getFurnishingStatus())) {
                predicates.add(cb.equal(root.get("furnishingStatus"), filter.getFurnishingStatus().trim()));
            }

            // 12. Featured Flag
            if (filter.getIsFeatured() != null) {
                predicates.add(cb.equal(root.get("isFeatured"), filter.getIsFeatured()));
            }

            // 13. Amenity Filtering
            if (filter.getAmenityIds() != null && !filter.getAmenityIds().isEmpty()) {
                Join<Property, Amenity> amenitiesJoin = root.join("amenities", JoinType.INNER);
                predicates.add(amenitiesJoin.get("id").in(filter.getAmenityIds()));
                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
