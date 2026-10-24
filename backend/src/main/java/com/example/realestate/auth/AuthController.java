package com.example.realestate.auth;

import com.example.realestate.common.response.ApiResponse;
import com.example.realestate.security.UserPrincipal;
import com.example.realestate.user.UserService;
import com.example.realestate.user.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, and session identity")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new buyer, property owner, or agent")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return new ResponseEntity<>(ApiResponse.ok("Registration successful", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT bearer token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserSummaryDTO>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserSummaryDTO user = userService.getCurrentUserProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserSummaryDTO>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UserProfileUpdateDTO dto) {
        UserSummaryDTO user = userService.updateProfile(principal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", user));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change account password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordDTO dto) {
        userService.changePassword(principal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully"));
    }
}
