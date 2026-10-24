package com.example.realestate.report;

import com.example.realestate.common.response.ApiResponse;
import com.example.realestate.report.dto.PropertyReportDTO;
import com.example.realestate.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@Tag(name = "Reports", description = "Endpoints for reporting fraudulent or inaccurate property listings")
public class PropertyReportController {

    private final PropertyReportService propertyReportService;

    public PropertyReportController(PropertyReportService propertyReportService) {
        this.propertyReportService = propertyReportService;
    }

    @PostMapping
    @Operation(summary = "Submit a report against a property listing")
    public ResponseEntity<ApiResponse<PropertyReportDTO>> submitReport(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> body) {
        UUID propertyId = UUID.fromString(body.get("propertyId"));
        String reason = body.get("reason");
        String description = body.get("description");

        PropertyReportDTO report = propertyReportService.createReport(principal, propertyId, reason, description);
        return new ResponseEntity<>(ApiResponse.ok("Report submitted for review", report), HttpStatus.CREATED);
    }
}
