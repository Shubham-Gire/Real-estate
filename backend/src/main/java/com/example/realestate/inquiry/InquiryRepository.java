package com.example.realestate.inquiry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, UUID> {

    Page<Inquiry> findByRecipientIdOrderByCreatedAtDesc(UUID recipientId, Pageable pageable);

    Page<Inquiry> findBySenderIdOrderByCreatedAtDesc(UUID senderId, Pageable pageable);

    long countByRecipientId(UUID recipientId);

    long countByRecipientIdAndStatus(UUID recipientId, InquiryStatus status);

    long countByStatus(InquiryStatus status);
}
