package com.example.realestate.crm;

import com.example.realestate.common.response.ApiResponse;
import com.example.realestate.crm.dto.*;
import com.example.realestate.crm.enums.DealStatus;
import com.example.realestate.crm.enums.LeadStage;
import com.example.realestate.crm.enums.ShowingStatus;
import com.example.realestate.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/crm")
@PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
@Tag(name = "Agent CRM", description = "Endpoints for real estate CRM: leads, deals, contacts, showings, and pipeline")
public class CrmController {

    private final CrmService crmService;

    public CrmController(CrmService crmService) {
        this.crmService = crmService;
    }

    // ==========================================
    // STATS & DASHBOARD
    // ==========================================
    @GetMapping("/stats")
    @Operation(summary = "Get aggregated CRM performance statistics for current agent")
    public ResponseEntity<ApiResponse<AgentCrmStatsDTO>> getCrmStats(@AuthenticationPrincipal UserPrincipal principal) {
        AgentCrmStatsDTO stats = crmService.getAgentCrmStats(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    // ==========================================
    // LEADS & KANBAN PIPELINE
    // ==========================================
    @GetMapping("/leads")
    @Operation(summary = "Get CRM leads with optional stage filter")
    public ResponseEntity<ApiResponse<List<CrmLeadDTO>>> getLeads(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) LeadStage stage) {
        List<CrmLeadDTO> leads = crmService.getLeads(principal.getId(), stage);
        return ResponseEntity.ok(ApiResponse.ok(leads));
    }

    @PostMapping("/leads")
    @Operation(summary = "Create a new CRM lead")
    public ResponseEntity<ApiResponse<CrmLeadDTO>> createLead(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CrmLeadCreateDTO dto) {
        CrmLeadDTO lead = crmService.createLead(principal.getId(), dto);
        return new ResponseEntity<>(ApiResponse.ok("Lead created successfully", lead), HttpStatus.CREATED);
    }

    @PatchMapping("/leads/{id}/stage")
    @Operation(summary = "Update lead pipeline stage")
    public ResponseEntity<ApiResponse<CrmLeadDTO>> updateLeadStage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody CrmLeadStageUpdateDTO dto) {
        CrmLeadDTO updated = crmService.updateLeadStage(principal.getId(), id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Lead stage updated", updated));
    }

    // ==========================================
    // DEALS & COMMISSION
    // ==========================================
    @GetMapping("/deals")
    @Operation(summary = "Get deals and commission pipeline")
    public ResponseEntity<ApiResponse<List<CrmDealDTO>>> getDeals(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) DealStatus status) {
        List<CrmDealDTO> deals = crmService.getDeals(principal.getId(), status);
        return ResponseEntity.ok(ApiResponse.ok(deals));
    }

    @PostMapping("/deals")
    @Operation(summary = "Create a new deal transaction")
    public ResponseEntity<ApiResponse<CrmDealDTO>> createDeal(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CrmDealCreateDTO dto) {
        CrmDealDTO deal = crmService.createDeal(principal.getId(), dto);
        return new ResponseEntity<>(ApiResponse.ok("Deal created successfully", deal), HttpStatus.CREATED);
    }

    @PatchMapping("/deals/{id}/status")
    @Operation(summary = "Update deal status (ACTIVE / WON / LOST)")
    public ResponseEntity<ApiResponse<CrmDealDTO>> updateDealStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @RequestParam DealStatus status) {
        CrmDealDTO updated = crmService.updateDealStatus(principal.getId(), id, status);
        return ResponseEntity.ok(ApiResponse.ok("Deal status updated", updated));
    }

    // ==========================================
    // CRM CONTACTS DIRECTORY
    // ==========================================
    @GetMapping("/contacts")
    @Operation(summary = "Get CRM client contacts directory")
    public ResponseEntity<ApiResponse<List<CrmContactDTO>>> getContacts(@AuthenticationPrincipal UserPrincipal principal) {
        List<CrmContactDTO> contacts = crmService.getContacts(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(contacts));
    }

    @PostMapping("/contacts")
    @Operation(summary = "Add a new client contact to CRM")
    public ResponseEntity<ApiResponse<CrmContactDTO>> createContact(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CrmContactCreateDTO dto) {
        CrmContactDTO contact = crmService.createContact(principal.getId(), dto);
        return new ResponseEntity<>(ApiResponse.ok("Contact created successfully", contact), HttpStatus.CREATED);
    }

    // ==========================================
    // SHOWINGS / TOURS
    // ==========================================
    @GetMapping("/showings")
    @Operation(summary = "Get agent scheduled property showings and tours")
    public ResponseEntity<ApiResponse<List<CrmShowingDTO>>> getShowings(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) ShowingStatus status) {
        List<CrmShowingDTO> showings = crmService.getShowings(principal.getId(), status);
        return ResponseEntity.ok(ApiResponse.ok(showings));
    }

    @PatchMapping("/showings/{id}/status")
    @Operation(summary = "Update showing status (CONFIRMED / COMPLETED / CANCELLED)")
    public ResponseEntity<ApiResponse<CrmShowingDTO>> updateShowingStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody CrmShowingStatusUpdateDTO dto) {
        CrmShowingDTO updated = crmService.updateShowingStatus(principal.getId(), id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Showing status updated", updated));
    }

    // ==========================================
    // CRM ACTIVITY NOTES
    // ==========================================
    @GetMapping("/notes")
    @Operation(summary = "Get activity notes for an entity (lead, deal, contact)")
    public ResponseEntity<ApiResponse<List<CrmNoteDTO>>> getNotes(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String entityType,
            @RequestParam UUID entityId) {
        List<CrmNoteDTO> notes = crmService.getNotes(principal.getId(), entityType, entityId);
        return ResponseEntity.ok(ApiResponse.ok(notes));
    }

    @PostMapping("/notes")
    @Operation(summary = "Log an interaction or note")
    public ResponseEntity<ApiResponse<CrmNoteDTO>> createNote(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CrmNoteCreateDTO dto) {
        CrmNoteDTO note = crmService.createNote(principal.getId(), dto);
        return new ResponseEntity<>(ApiResponse.ok("Note logged successfully", note), HttpStatus.CREATED);
    }

    // ==========================================
    // AGENT PROFILE
    // ==========================================
    @GetMapping("/profile")
    @Operation(summary = "Get agent professional profile")
    public ResponseEntity<ApiResponse<AgentProfileDTO>> getAgentProfile(@AuthenticationPrincipal UserPrincipal principal) {
        AgentProfileDTO profile = crmService.getAgentProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update agent professional profile")
    public ResponseEntity<ApiResponse<AgentProfileDTO>> updateAgentProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody AgentProfileUpdateDTO dto) {
        AgentProfileDTO updated = crmService.updateAgentProfile(principal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Agent profile updated", updated));
    }
}
