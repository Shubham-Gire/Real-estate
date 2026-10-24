package com.example.realestate.inquiry;

import com.example.realestate.common.response.ApiResponse;
import com.example.realestate.common.response.PagedResponse;
import com.example.realestate.inquiry.dto.InquiryCreateDTO;
import com.example.realestate.inquiry.dto.InquiryResponseDTO;
import com.example.realestate.inquiry.dto.InquiryStatusUpdateDTO;
import com.example.realestate.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inquiries")
@Tag(name = "Inquiries", description = "Endpoints for buyer-to-owner property inquiries and lead management")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping
    @Operation(summary = "Submit an inquiry on a property (Public or Authenticated)")
    public ResponseEntity<ApiResponse<InquiryResponseDTO>> createInquiry(
            @AuthenticationPrincipal UserPrincipal senderPrincipal,
            @Valid @RequestBody InquiryCreateDTO dto) {
        InquiryResponseDTO response = inquiryService.createInquiry(dto, senderPrincipal);
        return new ResponseEntity<>(ApiResponse.ok("Inquiry submitted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/sent")
    @Operation(summary = "Get inquiries sent by the current user")
    public ResponseEntity<ApiResponse<PagedResponse<InquiryResponseDTO>>> getSentInquiries(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<InquiryResponseDTO> response = inquiryService.getMySentInquiries(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/received")
    @Operation(summary = "Get inquiries received by the current owner/agent for their properties")
    public ResponseEntity<ApiResponse<PagedResponse<InquiryResponseDTO>>> getReceivedInquiries(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<InquiryResponseDTO> response = inquiryService.getMyReceivedInquiries(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update inquiry lead status (NEW, CONTACTED, RESOLVED, CLOSED)")
    public ResponseEntity<ApiResponse<InquiryResponseDTO>> updateStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody InquiryStatusUpdateDTO dto) {
        InquiryResponseDTO response = inquiryService.updateStatus(principal, id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Status updated", response));
    }
}
