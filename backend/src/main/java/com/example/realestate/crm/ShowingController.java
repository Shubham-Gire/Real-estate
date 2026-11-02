package com.example.realestate.crm;

import com.example.realestate.common.response.ApiResponse;
import com.example.realestate.crm.dto.CrmShowingCreateDTO;
import com.example.realestate.crm.dto.CrmShowingDTO;
import com.example.realestate.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/showings")
@Tag(name = "Property Showings & Tours", description = "Endpoints for booking and viewing property showings")
public class ShowingController {

    private final CrmService crmService;

    public ShowingController(CrmService crmService) {
        this.crmService = crmService;
    }

    @PostMapping
    @Operation(summary = "Schedule a property showing or tour (Public or Authenticated)")
    public ResponseEntity<ApiResponse<CrmShowingDTO>> requestShowing(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CrmShowingCreateDTO dto) {
        CrmShowingDTO showing = crmService.createShowing(principal != null ? principal.getId() : null, dto);
        return new ResponseEntity<>(ApiResponse.ok("Showing requested successfully", showing), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @Operation(summary = "Get showings booked by current user")
    public ResponseEntity<ApiResponse<List<CrmShowingDTO>>> getMyShowings(@AuthenticationPrincipal UserPrincipal principal) {
        List<CrmShowingDTO> showings = crmService.getClientShowings(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(showings));
    }
}
