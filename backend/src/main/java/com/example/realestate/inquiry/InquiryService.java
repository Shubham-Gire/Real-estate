package com.example.realestate.inquiry;

import com.example.realestate.common.audit.AuditLogService;
import com.example.realestate.common.exception.ForbiddenException;
import com.example.realestate.common.exception.ResourceNotFoundException;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.inquiry.dto.InquiryCreateDTO;
import com.example.realestate.inquiry.dto.InquiryResponseDTO;
import com.example.realestate.inquiry.dto.InquiryStatusUpdateDTO;
import com.example.realestate.notification.NotificationService;
import com.example.realestate.property.Property;
import com.example.realestate.property.PropertyRepository;
import com.example.realestate.security.UserPrincipal;
import com.example.realestate.user.Role;
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
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public InquiryService(
            InquiryRepository inquiryRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository,
            NotificationService notificationService,
            AuditLogService auditLogService) {
        this.inquiryRepository = inquiryRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public InquiryResponseDTO createInquiry(InquiryCreateDTO dto, UserPrincipal senderPrincipal) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        User recipient = property.getOwner();
        User sender = null;

        if (senderPrincipal != null) {
            sender = userRepository.findById(senderPrincipal.getId()).orElse(null);
        }

        Inquiry inquiry = new Inquiry();
        inquiry.setProperty(property);
        inquiry.setRecipient(recipient);
        inquiry.setSender(sender);
        inquiry.setName(dto.getName().trim());
        inquiry.setEmail(dto.getEmail().trim().toLowerCase());
        inquiry.setPhone(dto.getPhone());
        inquiry.setMessage(dto.getMessage().trim());
        inquiry.setStatus(InquiryStatus.NEW);

        Inquiry saved = inquiryRepository.save(inquiry);

        // Notify property owner / agent
        notificationService.createNotification(
                recipient,
                "New Inquiry on " + property.getTitle(),
                "Buyer " + dto.getName() + " sent an inquiry: \"" + dto.getMessage() + "\"",
                "INQUIRY_RECEIVED",
                "/dashboard/inquiries"
        );

        auditLogService.record(
                sender != null ? sender.getId() : null,
                dto.getEmail(),
                "INQUIRY_CREATED",
                "INQUIRY",
                saved.getId().toString(),
                "Inquiry submitted for property " + property.getTitle(),
                null
        );

        return new InquiryResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<InquiryResponseDTO> getMySentInquiries(UUID senderId, Pageable pageable) {
        Page<Inquiry> page = inquiryRepository.findBySenderIdOrderByCreatedAtDesc(senderId, pageable);
        List<InquiryResponseDTO> content = page.getContent().stream()
                .map(InquiryResponseDTO::new)
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
    public PagedResponse<InquiryResponseDTO> getMyReceivedInquiries(UUID recipientId, Pageable pageable) {
        Page<Inquiry> page = inquiryRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId, pageable);
        List<InquiryResponseDTO> content = page.getContent().stream()
                .map(InquiryResponseDTO::new)
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
    public InquiryResponseDTO updateStatus(UserPrincipal principal, UUID inquiryId, InquiryStatusUpdateDTO dto) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));

        if (principal.getRole() != Role.ROLE_ADMIN && !inquiry.getRecipient().getId().equals(principal.getId())) {
            throw new ForbiddenException("You do not have permission to manage this inquiry");
        }

        inquiry.setStatus(dto.getStatus());
        if (dto.getNotes() != null) {
            inquiry.setNotes(dto.getNotes());
        }

        Inquiry updated = inquiryRepository.save(inquiry);
        return new InquiryResponseDTO(updated);
    }
}
